import { Controller, Get, Res } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { Response } from "express";

import { MetricsService } from "./metrics.service";

@ApiExcludeController()
@Controller("metrics")
export class MetricsController {
	constructor(private readonly metricsService: MetricsService) {}

	@Get()
	async getMetrics(@Res() response: Response): Promise<void> {
		response.setHeader(
			"Content-Type",
			this.metricsService.getContentType(),
		);
		response.send(await this.metricsService.getMetrics());
	}
}
