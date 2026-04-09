import { Global, Module } from "@nestjs/common";

import { LoggingService } from "./logging.service";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";

@Global()
@Module({
	controllers: [MetricsController],
	providers: [MetricsService, LoggingService],
	exports: [MetricsService, LoggingService],
})
export class ObservabilityModule {}
