import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Package, ShieldCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_public/")({
	component: Home,
});

const FEATURES = [
	{
		icon: Package,
		tile: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
		title: "Product catalogue",
		body: "Price, stock and product images. Images are resized to fit 512×512px before they are saved.",
	},
	{
		icon: Users,
		tile: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
		title: "Team access",
		body: "Promote or remove administrators. The app blocks changes that would lock everyone out.",
	},
	{
		icon: ShieldCheck,
		tile: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
		title: "Checked on the server",
		body: "Every change is validated and authorized on the server. Client-side checks are only for convenience.",
	},
];

function Home() {
	const { data: session, isPending } = authClient.useSession();

	return (
		<main className="page-wrap px-4 py-14 sm:py-20">
			<section className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
				<div className="min-w-0">
					<h1 className="text-4xl leading-tight font-semibold tracking-tight text-foreground sm:text-5xl">
						Run your catalogue and team access from one secure place.
					</h1>
					<p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
						Manage products with images, stock and pricing, and control who can administer the app.
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-3">
						{!isPending &&
							(session?.user ? (
								<Button asChild size="lg">
									<Link to="/dashboard">
										Open dashboard
										<ArrowRight aria-hidden="true" />
									</Link>
								</Button>
							) : (
								<Button asChild size="lg">
									<Link to="/login">
										Sign in
										<ArrowRight aria-hidden="true" />
									</Link>
								</Button>
							))}
						<Button asChild variant="outline" size="lg">
							<Link to="/setup">First-time setup</Link>
						</Button>
					</div>
				</div>

				<ul className="grid gap-4">
					{FEATURES.map((feature) => {
						const Icon = feature.icon;
						return (
							<li key={feature.title} className="card flex gap-4 p-5">
								<span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${feature.tile}`}>
									<Icon className="size-5" aria-hidden="true" />
								</span>
								<div className="min-w-0">
									<h2 className="m-0 text-base font-semibold text-foreground">{feature.title}</h2>
									<p className="m-0 mt-1 text-sm leading-6 text-muted-foreground">
										{feature.body}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
			</section>
		</main>
	);
}
