import { Injectable } from "@nestjs/common";
import {
	collectDefaultMetrics,
	Counter,
	Histogram,
	Registry,
} from "prom-client";

@Injectable()
export class MetricsService {
	private readonly registry = new Registry();
	private readonly scenarioRunsTotal: Counter<"type" | "status">;
	private readonly scenarioRunDurationSeconds: Histogram<"type">;
	private readonly httpRequestsTotal: Counter<
		"method" | "path" | "status_code"
	>;

	constructor() {
		collectDefaultMetrics({
			register: this.registry,
			prefix: "signal_lab_",
		});

		this.scenarioRunsTotal = new Counter({
			name: "scenario_runs_total",
			help: "Total number of scenario runs by type and status",
			labelNames: ["type", "status"],
			registers: [this.registry],
		});

		this.scenarioRunDurationSeconds = new Histogram({
			name: "scenario_run_duration_seconds",
			help: "Scenario execution duration in seconds",
			labelNames: ["type"],
			buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
			registers: [this.registry],
		});

		this.httpRequestsTotal = new Counter({
			name: "http_requests_total",
			help: "Total HTTP requests by method, path, and status code",
			labelNames: ["method", "path", "status_code"],
			registers: [this.registry],
		});
	}

	recordScenarioRun(type: string, status: string, durationMs: number): void {
		this.scenarioRunsTotal.inc({ type, status });
		this.scenarioRunDurationSeconds.observe({ type }, durationMs / 1000);
	}

	recordHttpRequest(
		method: string,
		path: string,
		statusCode: string,
		_durationMs: number,
	): void {
		this.httpRequestsTotal.inc({
			method: method.toUpperCase(),
			path,
			status_code: statusCode,
		});
	}

	getContentType(): string {
		return this.registry.contentType;
	}

	async getMetrics(): Promise<string> {
		return this.registry.metrics();
	}
}
