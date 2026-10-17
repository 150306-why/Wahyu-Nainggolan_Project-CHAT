import { Link } from "@tanstack/react-router";

import { SignOutButton } from "#/integrations/better-auth/header-user";
import { authClient } from "#/lib/auth-client";

import ThemeToggle from "./ThemeToggle";
import { buttonVariants } from "./ui/button";

/** Top bar for public pages (home, sign-in, setup). Flat navbar, as in Cleopatra. */
export default function Header() {
	const { data: session, isPending } = authClient.useSession();

	return (
		<header className="sticky top-0 z-50 border-b border-border bg-background">
			<nav className="page-wrap flex h-16 items-center justify-between gap-3" aria-label="Main">
				<Link
					to="/"
					className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
				>
					<span
						className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
						aria-hidden="true"
					>
						E
					</span>
					<span className="text-base font-semibold tracking-tight text-foreground">
						Ekraf Dashboard
					</span>
				</Link>

				<div className="flex items-center gap-2">
					{!isPending &&
						(session?.user ? (
							<>
								<Link to="/dashboard" className={buttonVariants({ variant: "outline" })}>
									Dashboard
								</Link>
								<SignOutButton />
							</>
						) : (
							<Link to="/login" className={buttonVariants({ variant: "outline" })}>
								Sign in
							</Link>
						))}
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
