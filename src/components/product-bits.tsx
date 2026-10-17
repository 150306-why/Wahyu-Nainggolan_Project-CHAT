import { ImageIcon } from "lucide-react";

import { cn } from "#/lib/utils";

/** Product image, or a neutral placeholder. The name is shown beside it, so alt is empty. */
export function ProductThumb({
	src,
	size = "size-11",
}: {
	src: string | null;
	size?: string;
}) {
	const base = cn("shrink-0 rounded-lg ring-1 ring-border", size);
	if (src) {
		return <img src={src} alt="" loading="lazy" className={cn(base, "object-cover")} />;
	}
	return (
		<span
			aria-hidden="true"
			className={cn(base, "flex items-center justify-center bg-muted")}
		>
			<ImageIcon className="size-4 text-muted-foreground" />
		</span>
	);
}

export function StockBadge({ value }: { value: number }) {
	const tone =
		value === 0
			? "bg-red-500/10 text-red-700 dark:text-red-400"
			: value <= 5
				? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
				: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
	const label = value === 0 ? "Out of stock" : value <= 5 ? `Low · ${value}` : `${value}`;
	return (
		<span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tone)}>
			{label}
		</span>
	);
}
