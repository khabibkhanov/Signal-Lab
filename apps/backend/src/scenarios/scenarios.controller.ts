import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { RunScenarioDto } from "./dto/run-scenario.dto";
import { RunSentryDemoDto } from "./dto/run-sentry-demo.dto";
import { ScenariosService } from "./scenarios.service";

@ApiTags("scenarios")
@Controller("scenarios")
export class ScenariosController {
	constructor(private readonly scenariosService: ScenariosService) {}

	@Post("run")
	@ApiOperation({ summary: "Run a scenario and emit observability signals" })
	async runScenario(
		@Body() dto: RunScenarioDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<Record<string, unknown>> {
		const result = await this.scenariosService.runScenario(dto);
		response.status(result.statusCode);
		return result.body;
	}

	@Post("sentry-demo")
	@ApiOperation({
		summary:
			"Emit a unique Sentry demo exception and return event metadata",
	})
	async runSentryDemo(
		@Body() dto: RunSentryDemoDto,
		@Res({ passthrough: true }) response: Response,
	): Promise<Record<string, unknown>> {
		const result = await this.scenariosService.runSentryDemo(dto.name);
		response.status(result.statusCode);
		return result.body;
	}

	@Get("runs")
	@ApiOperation({ summary: "List latest scenario runs" })
	async listRuns(@Query("limit") limit = "20") {
		return this.scenariosService.findLatest(Number(limit));
	}
}
