"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Activity } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { runScenario, getLatestRuns } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const scenarioOptions = [
	{ value: "success", label: "success" },
	{ value: "validation_error", label: "validation_error" },
	{ value: "system_error", label: "system_error" },
	{ value: "slow_request", label: "slow_request" },
	{ value: "teapot", label: "teapot (bonus)" },
] as const;

const schema = z.object({
	type: z.enum([
		"success",
		"validation_error",
		"system_error",
		"slow_request",
		"teapot",
	]),
	name: z
		.string()
		.max(120, "Name cannot exceed 120 characters")
		.optional()
		.or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function statusVariant(
	status: string,
): "success" | "warning" | "danger" | "neutral" {
	if (status === "completed") return "success";
	if (status === "validation_error" || status === "teapot") return "warning";
	if (status === "error" || status === "failed") return "danger";
	return "neutral";
}

export default function HomePage() {
	const queryClient = useQueryClient();

	const { register, handleSubmit, formState, reset } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: "success",
			name: "",
		},
	});

	const runsQuery = useQuery({
		queryKey: ["scenario-runs"],
		queryFn: () => getLatestRuns(20),
		refetchInterval: 5_000,
	});

	const mutation = useMutation({
		mutationFn: runScenario,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["scenario-runs"] });
			if (data.signal === 42) {
				toast.warning("Teapot scenario returned HTTP 418.");
			} else {
				toast.success("Scenario executed successfully.");
			}
			reset({ type: "success", name: "" });
		},
		onError: (error: Error) => {
			queryClient.invalidateQueries({ queryKey: ["scenario-runs"] });
			toast.error(error.message);
		},
	});

	const sortedRuns = useMemo(() => runsQuery.data ?? [], [runsQuery.data]);

	const onSubmit = handleSubmit(async (values) => {
		await mutation.mutateAsync({
			type: values.type,
			name: values.name || undefined,
		});
	});

	return (
		<main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
			<section className="mb-8 animate-rise rounded-xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
				<div className="flex items-center gap-3">
					<div className="rounded-lg bg-primary/20 p-2 text-primary">
						<Activity className="h-5 w-5" />
					</div>
					<div>
						<h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
							Signal Lab
						</h1>
						<p className="text-sm text-muted-foreground md:text-base">
							Trigger scenarios and inspect metrics, logs, and
							errors in real time.
						</p>
					</div>
				</div>
			</section>

			<section className="grid gap-6 lg:grid-cols-5">
				<Card className="animate-rise lg:col-span-2">
					<CardHeader>
						<CardTitle>Run Scenario</CardTitle>
						<CardDescription>
							React Hook Form + TanStack Query mutation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							className="space-y-4"
							onSubmit={onSubmit}
						>
							<div className="space-y-2">
								<label
									className="text-sm font-medium"
									htmlFor="type"
								>
									Scenario Type
								</label>
								<Select
									id="type"
									{...register("type")}
								>
									{scenarioOptions.map((option) => (
										<option
											key={option.value}
											value={option.value}
										>
											{option.label}
										</option>
									))}
								</Select>
								{formState.errors.type ? (
									<p className="text-xs text-rose-600">
										{formState.errors.type.message}
									</p>
								) : null}
							</div>

							<div className="space-y-2">
								<label
									className="text-sm font-medium"
									htmlFor="name"
								>
									Scenario Name (optional)
								</label>
								<Input
									id="name"
									placeholder="nightly-smoke"
									{...register("name")}
								/>
								{formState.errors.name ? (
									<p className="text-xs text-rose-600">
										{formState.errors.name.message}
									</p>
								) : null}
							</div>

							<Button
								className="w-full"
								disabled={
									mutation.isPending || formState.isSubmitting
								}
								type="submit"
							>
								{mutation.isPending
									? "Running..."
									: "Run Scenario"}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card
					className="animate-rise lg:col-span-3"
					style={{ animationDelay: "120ms" }}
				>
					<CardHeader>
						<CardTitle>Run History</CardTitle>
						<CardDescription>
							Latest 20 runs with auto-refresh
						</CardDescription>
					</CardHeader>
					<CardContent>
						{runsQuery.isLoading ? (
							<p className="text-sm text-muted-foreground">
								Loading run history...
							</p>
						) : null}
						{runsQuery.isError ? (
							<p className="text-sm text-rose-600">
								Could not load run history. Check backend
								status.
							</p>
						) : null}

						<ul className="space-y-2">
							{sortedRuns.map((run) => (
								<li
									key={run.id}
									className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white/70 p-3"
								>
									<div className="min-w-0">
										<p className="font-mono text-sm font-medium text-foreground">
											{run.type}
										</p>
										<p className="text-xs text-muted-foreground">
											{new Date(
												run.createdAt,
											).toLocaleString()}{" "}
											• {run.duration ?? 0} ms
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={statusVariant(run.status)}
										>
											{run.status}
										</Badge>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</section>

			<section
				className="mt-6 animate-rise"
				style={{ animationDelay: "220ms" }}
			>
				<Card>
					<CardHeader>
						<CardTitle>Observability Links</CardTitle>
						<CardDescription>
							Use these targets during verification walkthrough.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="grid gap-2 text-sm md:grid-cols-2">
							<li>
								<a
									className="inline-flex items-center gap-1 underline decoration-dotted"
									href="http://localhost:3001/metrics"
									rel="noreferrer"
									target="_blank"
								>
									Prometheus Metrics{" "}
									<ExternalLink className="h-3.5 w-3.5" />
								</a>
							</li>
							<li>
								<a
									className="inline-flex items-center gap-1 underline decoration-dotted"
									href="http://localhost:3000/grafana"
									rel="noreferrer"
									target="_blank"
								>
									Grafana via /grafana{" "}
									<ExternalLink className="h-3.5 w-3.5" />
								</a>
							</li>
							<li>
								<a
									className="inline-flex items-center gap-1 underline decoration-dotted"
									href="http://localhost:3100"
									rel="noreferrer"
									target="_blank"
								>
									Grafana direct (port 3100){" "}
									<ExternalLink className="h-3.5 w-3.5" />
								</a>
							</li>
							<li>
								<span className="font-mono text-xs text-muted-foreground">
									Loki query: {`{app="signal-lab"}`}
								</span>
							</li>
							<li>
								<span className="font-mono text-xs text-muted-foreground">
									Sentry: check project dashboard for
									system_error
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
