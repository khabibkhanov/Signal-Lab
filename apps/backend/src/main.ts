import "reflect-metadata";

import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import { NextFunction, Request, Response } from "express";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { LoggingService } from "./observability/logging.service";
import { MetricsService } from "./observability/metrics.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
	});

	const metricsService = app.get(MetricsService);
	const loggingService = app.get(LoggingService);

	const sentryDsn = process.env.SENTRY_DSN;
	const sentryEnabled =
		process.env.SENTRY_ENABLED !== "false" && Boolean(sentryDsn);
	if (sentryEnabled) {
		const tracesSampleRate = Number(
			process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.2",
		);
		const profilesSampleRate = Number(
			process.env.SENTRY_PROFILES_SAMPLE_RATE ?? "0.0",
		);
		const sentryEnvironment =
			process.env.SENTRY_ENVIRONMENT ??
			process.env.NODE_ENV ??
			"development";

		Sentry.init({
			dsn: sentryDsn,
			tracesSampleRate: Number.isNaN(tracesSampleRate)
				? 0.2
				: tracesSampleRate,
			profilesSampleRate: Number.isNaN(profilesSampleRate)
				? 0
				: profilesSampleRate,
			environment: sentryEnvironment,
			release: process.env.SENTRY_RELEASE,
			attachStacktrace: true,
			sendDefaultPii: false,
		});
		Sentry.setTag("service", "signal-lab-backend");
		loggingService.info("Sentry initialized.", {
			environment: sentryEnvironment,
			release: process.env.SENTRY_RELEASE ?? "unset",
		});
	} else {
		loggingService.warn(
			"Sentry capture is disabled. Provide SENTRY_DSN and keep SENTRY_ENABLED=true.",
		);
	}

	app.setGlobalPrefix("api", {
		exclude: [{ path: "metrics", method: RequestMethod.GET }],
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.use((req: Request, res: Response, next: NextFunction) => {
		const start = process.hrtime.bigint();
		res.on("finish", () => {
			const durationMs =
				Number(process.hrtime.bigint() - start) / 1_000_000;
			metricsService.recordHttpRequest(
				req.method,
				req.path,
				String(res.statusCode),
				durationMs,
			);
		});
		next();
	});

	app.useGlobalFilters(new HttpExceptionFilter(loggingService));

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Signal Lab API")
		.setDescription("Scenario runner and observability API")
		.setVersion("1.0.0")
		.addTag("health")
		.addTag("scenarios")
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("api/docs", app, document);

	const port = Number(process.env.PORT ?? "3001");
	await app.listen(port);
	loggingService.info("Backend server started.", { port });
}

bootstrap();
