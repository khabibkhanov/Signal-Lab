import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const SCENARIO_TYPES = [
	"success",
	"validation_error",
	"system_error",
	"slow_request",
	"teapot",
] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export class RunScenarioDto {
	@IsIn(SCENARIO_TYPES)
	type!: ScenarioType;

	@IsOptional()
	@IsString()
	@MaxLength(120)
	name?: string;
}
