import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { Request, Response } from "express";

import { LoggingService } from "../../observability/logging.service";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(private readonly loggingService: LoggingService) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = "Internal server error";

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const exceptionResponse = exception.getResponse();
			if (typeof exceptionResponse === "string") {
				message = exceptionResponse;
			} else if (
				typeof exceptionResponse === "object" &&
				exceptionResponse !== null &&
				"message" in exceptionResponse
			) {
				const value = (
					exceptionResponse as { message?: string | string[] }
				).message;
				if (Array.isArray(value)) {
					message = value.join(", ");
				} else if (value) {
					message = value;
				}
			}
		} else if (exception instanceof Error) {
			message = exception.message;
		}

		if (status >= 500) {
			Sentry.withScope((scope) => {
				scope.setTag("http.status_code", String(status));
				scope.setTag("http.method", request.method);
				scope.setTag("http.path", request.url);
				scope.setContext("request", {
					method: request.method,
					path: request.url,
				});
				Sentry.captureException(exception);
			});
		}

		this.loggingService.error("Unhandled request exception.", {
			method: request.method,
			path: request.url,
			status,
			message,
			stack: exception instanceof Error ? exception.stack : undefined,
		});

		response.status(status).json({
			statusCode: status,
			message,
			path: request.url,
			timestamp: new Date().toISOString(),
		});
	}
}
