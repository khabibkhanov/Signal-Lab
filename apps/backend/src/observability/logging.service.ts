import { Injectable } from "@nestjs/common";
import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

type LogPayload = Record<string, unknown>;

@Injectable()
export class LoggingService {
	private readonly logFilePath =
		process.env.LOG_FILE_PATH ?? "/var/log/signal-lab/backend.log";

	constructor() {
		const logDir = dirname(this.logFilePath);
		if (!existsSync(logDir)) {
			mkdirSync(logDir, { recursive: true });
		}
	}

	info(message: string, payload?: LogPayload): void {
		this.write("info", message, payload);
	}

	warn(message: string, payload?: LogPayload): void {
		this.write("warn", message, payload);
	}

	error(message: string, payload?: LogPayload): void {
		this.write("error", message, payload);
	}

	private write(
		level: "info" | "warn" | "error",
		message: string,
		payload?: LogPayload,
	): void {
		const line = JSON.stringify({
			timestamp: new Date().toISOString(),
			level,
			message,
			...payload,
		});

		if (level === "error") {
			console.error(line);
		} else if (level === "warn") {
			console.warn(line);
		} else {
			console.log(line);
		}

		try {
			appendFileSync(this.logFilePath, `${line}\n`, "utf8");
		} catch (error) {
			const fallback = JSON.stringify({
				timestamp: new Date().toISOString(),
				level: "error",
				message: "Failed to append backend log file.",
				error: error instanceof Error ? error.message : "unknown",
			});
			console.error(fallback);
		}
	}
}
