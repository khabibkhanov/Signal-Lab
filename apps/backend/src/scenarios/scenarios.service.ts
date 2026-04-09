import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from "@nestjs/common";
import * as Sentry from "@sentry/node";

import { LoggingService } from "../observability/logging.service";
import { MetricsService } from "../observability/metrics.service";
import { PrismaService } from "../prisma/prisma.service";
import { RunScenarioDto } from "./dto/run-scenario.dto";

type ScenarioResponse = {
	statusCode: number;
	body: Record<string, unknown>;
};

@Injectable()
export class ScenariosService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly metricsService: MetricsService,
		private readonly loggingService: LoggingService,
	) {}

	async runScenario(dto: RunScenarioDto): Promise<ScenarioResponse> {
		const startedAt = Date.now();
		const name = dto.name?.trim() || null;

		if (dto.type === "validation_error") {
			const duration = Date.now() - startedAt;
			const run = await this.prisma.scenarioRun.create({
				data: {
					type: dto.type,
					status: "validation_error",
					duration,
					error: "Validation failed: demo scenario triggered.",
					metadata: name ? { name } : undefined,
				},
			});

			this.metricsService.recordScenarioRun(
				dto.type,
				"validation_error",
				duration,
			);
			Sentry.addBreadcrumb({
				category: "validation",
				message: "Validation error scenario executed",
				level: "warning",
				data: { scenarioId: run.id, scenarioType: dto.type },
			});
			this.loggingService.warn("Validation error scenario executed.", {
				scenarioType: dto.type,
				scenarioId: run.id,
				duration,
				error: "Validation failed: demo scenario triggered.",
			});

			throw new BadRequestException(
				"Validation failed: demo scenario triggered.",
			);
		}

		if (dto.type === "system_error") {
			const duration = Date.now() - startedAt;
			const run = await this.prisma.scenarioRun.create({
				data: {
					type: dto.type,
					status: "error",
					duration,
					error: "Simulated system failure.",
					metadata: name ? { name } : undefined,
				},
			});

			this.metricsService.recordScenarioRun(dto.type, "error", duration);
			const correlationId = `system-error-${run.id}-${Date.now()}`;
			const scenarioError = new Error(
				`Simulated system error from ScenarioService. correlationId=${correlationId}`,
			);
			const sentryEventId = Sentry.withScope((scope) => {
				scope.setTag("scenario.type", dto.type);
				scope.setTag("scenario.status", "error");
				scope.setTag("scenario.id", run.id);
				scope.setTag("scenario.correlation_id", correlationId);
				scope.setContext("scenario", {
					scenarioId: run.id,
					scenarioType: dto.type,
					duration,
					name,
					correlationId,
				});

				const isDevelopment =
					(process.env.NODE_ENV ?? "development") === "development";
				if (isDevelopment) {
					// In dev, keep each UI-triggered system_error independently visible in Sentry.
					scope.setFingerprint([
						"signal-lab",
						"system-error",
						correlationId,
					]);
				} else {
					scope.setFingerprint(["signal-lab", "system-error"]);
				}

				return Sentry.captureException(scenarioError);
			});
			const sentryFlushed = await Sentry.flush(1_500);
			this.loggingService.error("System error scenario executed.", {
				scenarioType: dto.type,
				scenarioId: run.id,
				duration,
				error: scenarioError.message,
				sentryEventId,
				sentryCorrelationId: correlationId,
				sentryFlushed,
			});

			throw new InternalServerErrorException(
				"Scenario execution failed.",
			);
		}

		if (dto.type === "slow_request") {
			await this.sleep(2000 + Math.floor(Math.random() * 3000));
			return this.completeSuccessfulRun(dto.type, startedAt, name);
		}

		if (dto.type === "teapot") {
			const duration = Date.now() - startedAt;
			const run = await this.prisma.scenarioRun.create({
				data: {
					type: dto.type,
					status: "teapot",
					duration,
					metadata: {
						easter: true,
						signal: 42,
						...(name ? { name } : {}),
					},
				},
			});

			this.metricsService.recordScenarioRun(dto.type, "teapot", duration);
			this.loggingService.warn("Teapot scenario executed.", {
				scenarioType: dto.type,
				scenarioId: run.id,
				duration,
			});

			return {
				statusCode: 418,
				body: {
					signal: 42,
					message: "I'm a teapot",
				},
			};
		}

		return this.completeSuccessfulRun(dto.type, startedAt, name);
	}

	async findLatest(limit = 20) {
		const normalizedLimit = Number.isFinite(limit)
			? Math.min(Math.max(limit, 1), 20)
			: 20;
		return this.prisma.scenarioRun.findMany({
			orderBy: { createdAt: "desc" },
			take: normalizedLimit,
		});
	}

	async runSentryDemo(name?: string): Promise<ScenarioResponse> {
		const sentryReady =
			process.env.SENTRY_ENABLED !== "false" &&
			Boolean(process.env.SENTRY_DSN);
		if (!sentryReady) {
			this.loggingService.warn(
				"Sentry demo requested while Sentry is disabled.",
			);
			return {
				statusCode: 503,
				body: {
					ok: false,
					message:
						"Sentry is not enabled. Set SENTRY_DSN and SENTRY_ENABLED=true.",
				},
			};
		}

		const demoName = name?.trim() || "sentry-demo";
		const correlationId = `sentry-demo-${Date.now()}`;
		const demoError = new Error(
			`Sentry demo error: ${demoName} (${correlationId})`,
		);

		const eventId = Sentry.withScope((scope) => {
			scope.setTag("scenario.type", "sentry_demo");
			scope.setTag("scenario.status", "error");
			scope.setContext("sentry_demo", {
				demoName,
				correlationId,
				environment: process.env.SENTRY_ENVIRONMENT ?? "development",
			});
			// Unique fingerprint prevents grouping confusion during verification.
			scope.setFingerprint(["signal-lab", "sentry-demo", correlationId]);
			return Sentry.captureException(demoError);
		});

		const flushed = await Sentry.flush(2_000);
		this.loggingService.error("Sentry demo event emitted.", {
			demoName,
			correlationId,
			eventId,
			flushed,
		});

		return {
			statusCode: 202,
			body: {
				ok: true,
				eventId,
				correlationId,
				flushed,
				message:
					"Sentry demo event emitted. Search by eventId or correlationId in Sentry.",
			},
		};
	}

	private async completeSuccessfulRun(
		type: string,
		startedAt: number,
		name: string | null,
	): Promise<ScenarioResponse> {
		const duration = Date.now() - startedAt;
		const run = await this.prisma.scenarioRun.create({
			data: {
				type,
				status: "completed",
				duration,
				metadata: name ? { name } : undefined,
			},
		});

		this.metricsService.recordScenarioRun(type, "completed", duration);
		this.loggingService.info("Scenario run completed.", {
			scenarioType: type,
			scenarioId: run.id,
			duration,
			error: null,
		});

		return {
			statusCode: 200,
			body: {
				id: run.id,
				type,
				status: "completed",
				duration,
			},
		};
	}

	private async sleep(ms: number): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}
}
