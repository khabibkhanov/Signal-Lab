import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				neutral: "border-slate-300 bg-slate-100 text-slate-700",
				success: "border-emerald-300 bg-emerald-100 text-emerald-700",
				warning: "border-amber-300 bg-amber-100 text-amber-800",
				danger: "border-rose-300 bg-rose-100 text-rose-700",
			},
		},
		defaultVariants: {
			variant: "neutral",
		},
	},
);

export interface BadgeProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}
