import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, Package, Plus, ShieldCheck, UserRound, Users } from "lucide-react";

import { ProductThumb } from "@/components/product-bits";
import { EmptyState, ErrorState, PageHeader, Panel, SkeletonRows } from "@/components/states";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { PRODUCTS_QUERY_KEY, USERS_QUERY_KEY } from "@/lib/query-keys";
import { getProducts } from "@/lib/server/products";
import { getUsers } from "@/lib/server/users";

export const Route = createFileRoute("/_admin/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	const { currentUser, role } = Route.useRouteContext();
	const isAdmin = role === "admin";

	const productsQuery = useQuery({
		queryKey: PRODUCTS_QUERY_KEY,
		queryFn: () => getProducts(),
	});
	// Only administrators may list users, so skip the request for everyone else.
	const usersQuery = useQuery({
		queryKey: USERS_QUERY_KEY,
		queryFn: () => getUsers(),
		enabled: isAdmin,
	});

	const products = productsQuery.data ?? [];
	const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
	const users = usersQuery.data ?? [];
	const adminCount = users.filter((u) => u.role === "admin").length;
	const firstName = (currentUser.name || "").trim().split(/\s+/)[0];

	return (
		<>
			<PageHeader
				kicker="Overview"
				title={firstName ? `Welcome back, ${firstName}` : "Dashboard"}
				description={
					isAdmin
						? "Your catalogue and team at a glance."
						: "Browse the catalogue. Ask an administrator for editing access."
				}
				actions={
					isAdmin && (
						<Button asChild>
							<Link to="/products" search={{ new: true }}>
								<Plus aria-hidden="true" />
								Add product
							</Link>
						</Button>
					)
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<Stat icon={Package} tone="emerald"
					label="Products" value={productsQuery.data ? products.length : null} />
				<Stat icon={Boxes} tone="sky"
					label="Units in stock" value={productsQuery.data ? totalStock : null} />
				{isAdmin ? (
					<Stat
						icon={ShieldCheck}
						tone="violet"
					label="Administrators"
						value={usersQuery.data ? adminCount : null}
						hint={
							usersQuery.data
								? `${users.length} ${users.length === 1 ? "account" : "accounts"} in total`
								: undefined
						}
						error={usersQuery.isError}
					/>
				) : (
					<Stat icon={UserRound} tone="amber"
					label="Your role" valueText="User" hint="Read-only access" />
				)}
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
				<Panel>
					<div className="mb-4 flex items-center justify-between gap-3">
						<h2 className="m-0 text-sm font-semibold text-foreground">Recent products</h2>
						<Link
							to="/products"
							className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
						>
							View all
							<ArrowRight className="size-3.5" aria-hidden="true" />
						</Link>
					</div>

					{productsQuery.isPending ? (
						<SkeletonRows rows={4} />
					) : productsQuery.isError ? (
						<ErrorState
							message={`Could not load products. ${(productsQuery.error as Error).message}`}
							onRetry={() => void productsQuery.refetch()}
						/>
					) : products.length === 0 ? (
						<EmptyState
							title="No products yet"
							description={isAdmin ? "Add your first product to get started." : undefined}
						/>
					) : (
						<ul className="divide-y divide-border">
							{products.slice(0, 5).map((p) => (
								<li key={p.id} className="flex items-center gap-3 py-3">
									<ProductThumb src={p.imageUrl} size="size-10" />
									<div className="min-w-0 flex-1">
										<p className="m-0 truncate text-sm font-semibold text-foreground">
											{p.name}
										</p>
										<p className="m-0 text-xs text-muted-foreground">Stock {p.stock}</p>
									</div>
									<p className="m-0 shrink-0 text-sm font-semibold text-foreground">
										{formatPrice(p.price)}
									</p>
								</li>
							))}
						</ul>
					)}
				</Panel>

				<Panel>
					<h2 className="m-0 mb-4 text-sm font-semibold text-foreground">Shortcuts</h2>
					<div className="grid gap-3">
						<ShortcutLink
							to="/products"
							icon={Package}
							tone="sky"
							title="Products"
							body="Browse, sort and manage the catalogue."
						/>
						{isAdmin && (
							<ShortcutLink
								to="/users"
								icon={Users}
								tone="violet"
								title="Users"
								body="Change roles and remove accounts."
							/>
						)}
					</div>
				</Panel>
			</div>

			{usersQuery.isError && isAdmin && (
				<div className="mt-4">
					<ErrorState message={`Could not load users. ${(usersQuery.error as Error).message}`} />
				</div>
			)}
		</>
	);
}

const TONES = {
	emerald: {
		top: "bg-emerald-500",
		tile: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
	},
	sky: {
		top: "bg-sky-500",
		tile: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
	},
	violet: {
		top: "bg-violet-500",
		tile: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
	},
	amber: {
		top: "bg-amber-500",
		tile: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
	},
} as const;

function Stat({
	icon: Icon,
	tone,
	label,
	value,
	valueText,
	hint,
	error,
}: {
	icon: typeof Package;
	tone: keyof typeof TONES;
	label: string;
	value?: number | null;
	valueText?: string;
	hint?: string;
	error?: boolean;
}) {
	const loading = valueText === undefined && (value === null || value === undefined) && !error;
	return (
		<div className="card relative overflow-hidden p-5">
			<span className={`absolute inset-x-0 top-0 h-1 ${TONES[tone].top}`} aria-hidden="true" />
			<div className="mb-3 flex items-center gap-3">
				<span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone].tile}`}>
					<Icon className="size-5" aria-hidden="true" />
				</span>
				<p className="m-0 text-xs font-medium tracking-wide text-muted-foreground uppercase">
					{label}
				</p>
			</div>
			{loading ? (
				<span
					role="status"
					aria-label="Loading"
					className="block h-9 w-20 animate-pulse rounded-md bg-muted"
				/>
			) : (
				<p className="m-0 text-3xl font-bold text-foreground">
					{error ? "!" : (valueText ?? value?.toLocaleString())}
				</p>
			)}
			{hint && <p className="m-0 mt-1 text-xs text-muted-foreground">{hint}</p>}
		</div>
	);
}

function ShortcutLink({
	to,
	icon: Icon,
	tone,
	title,
	body,
}: {
	to: "/products" | "/users";
	icon: typeof Package;
	tone: keyof typeof TONES;
	title: string;
	body: string;
}) {
	return (
		<Link
			to={to}
			className="group flex items-center gap-4 rounded-lg border border-border bg-background p-4 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			<span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone].tile}`}>
				<Icon className="size-5" aria-hidden="true" />
			</span>
			<span className="min-w-0 flex-1">
				<span className="block text-sm font-semibold text-foreground">{title}</span>
				<span className="block text-xs text-muted-foreground">{body}</span>
			</span>
			<ArrowRight
				className="size-4 text-muted-foreground transition group-hover:translate-x-0.5"
				aria-hidden="true"
			/>
		</Link>
	);
}
