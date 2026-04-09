import {
	RunScenarioPayload,
	RunScenarioResponse,
	ScenarioRun,
} from "@/types/scenario";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function runScenario(
	payload: RunScenarioPayload,
): Promise<RunScenarioResponse> {
	const response = await fetch(`${API_BASE_URL}/api/scenarios/run`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const data = (await response
		.json()
		.catch(() => ({}))) as RunScenarioResponse & {
		message?: string | string[];
	};

	if (!response.ok) {
		const message = Array.isArray(data.message)
			? data.message.join(", ")
			: data.message;
		throw new Error(
			message ?? `Scenario run failed with HTTP ${response.status}`,
		);
	}

	return data;
}

export async function getLatestRuns(limit = 20): Promise<ScenarioRun[]> {
	const response = await fetch(
		`${API_BASE_URL}/api/scenarios/runs?limit=${limit}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		throw new Error("Could not load scenario runs.");
	}

	return (await response.json()) as ScenarioRun[];
}
