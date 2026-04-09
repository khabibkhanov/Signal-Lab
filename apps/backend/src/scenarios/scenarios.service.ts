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
			const scenarioError = new Error(
				"Simulated system error from ScenarioService.",
			);
			Sentry.withScope((scope) => {
				scope.setTag("scenario.type", dto.type);
				scope.setTag("scenario.status", "error");
				scope.setContext("scenario", {
					scenarioId: run.id,
					scenarioType: dto.type,
					duration,
					name,
				});
				Sentry.captureException(scenarioError);
			});
			this.loggingService.error("System error scenario executed.", {
				scenarioType: dto.type,
				scenarioId: run.id,
				duration,
				error: scenarioError.message,
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
