export type ScenarioType =
	| "success"
	| "validation_error"
	| "system_error"
	| "slow_request"
	| "teapot";

export type ScenarioRun = {
	id: string;
	type: ScenarioType;
	status: string;
	duration?: number | null;
	error?: string | null;
	metadata?: Record<string, unknown> | null;
	createdAt: string;
};

export type RunScenarioPayload = {
	type: ScenarioType;
	name?: string;
};

export type RunScenarioResponse = {
	id?: string;
	type?: ScenarioType;
	status?: string;
	duration?: number;
	signal?: number;
	message?: string;
};
