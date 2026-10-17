import { Link } from "@tanstack/react-router";
import { ChevronsLeft, ChevronsRight, LayoutDashboard, Menu, Package, Users } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import { SignOutButton, UserAvatar } from "#/integrations/better-auth/header-user";
import type { Role } from "#/lib/db";
import { cn } from "#/lib/utils";

import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

const COLLAPSED_KEY = "admin-sidebar-collapsed";

const NAV_ITEMS = [
	{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tone: "text-emerald-600 dark:text-emerald-400", adminOnly: false },
	{ to: "/products", label: "Products", icon: Package, tone: "text-sky-600 dark:text-sky-400", adminOnly: false },
	{ to: "/users", label: "Users", icon: Users, tone: "text-violet-600 dark:text-violet-400", adminOnly: true },
] as const;

function readCollapsed(): boolean {
	try {
		return window.localStorage.getItem(COLLAPSED_KEY) === "1";
	} catch {
		return false;
	}
}

function writeCollapsed(value: boolean) {
	try {
		window.localStorage.setItem(COLLAPSED_KEY, value ? "1" : "0");
	} catch {
		// Preference just won't persist.
	}
}

/** Logo tile and name, as in the Cleopatra navbar. */
function Brand() {
	return (
		<Link to="/dashboard" className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
			<span
				className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold shadow-sm"
				aria-hidden="true"
			>
				E
			</span>
			<span className="truncate text-base font-semibold tracking-tight text-foreground">Ekraf</span>
		</Link>
	);
}

function NavList({
	role,
	compact,
	onNavigate,
}: {
	role: Role;
	compact: boolean;
	onNavigate?: () => void;
}) {
	const items = NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin");
	return (
		<nav aria-label="Admin navigation" className="flex flex-col gap-1">
			{items.map((item) => {
				const Icon = item.icon;
				return (
					<Link
						key={item.to}
						to={item.to}
						onClick={onNavigate}
						aria-label={compact ? item.label : undefined}
						title={compact ? item.label : undefined}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors outline-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
							compact && "justify-center px-0",
						)}
						activeProps={{ className: "bg-primary/15 text-primary font-semibold hover:bg-primary/15 hover:text-primary" }}
					>
						<Icon className={cn("size-4 shrink-0", item.tone)} aria-hidden="true" />
						{!compact && <span className="truncate">{item.label}</span>}
					</Link>
				);
			})}
		</nav>
	);
}

export function AdminShell({
	user,
	role,
	children,
}: {
	user: { name?: string | null; email: string };
	role: Role;
	children: React.ReactNode;
}) {
	const [collapsed, setCollapsed] = useState(readCollapsed);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleCollapsed = () => {
		setCollapsed((prev) => {
			writeCollapsed(!prev);
			return !prev;
		});
	};

	return (
		<div className="flex min-h-dvh flex-col bg-background">
			{/* Top navbar */}
			<header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur md:px-6">
				<button
					type="button"
					onClick={() => setDrawerOpen(true)}
					aria-label="Open navigation"
					className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs outline-none transition-colors hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden"
				>
					<Menu className="size-4" aria-hidden="true" />
				</button>
				<Brand />

				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
					<div className="mx-1 hidden items-center gap-2.5 md:flex">
						<UserAvatar name={user.name} email={user.email} />
						<div className="min-w-0 leading-tight">
							<p className="m-0 max-w-48 truncate text-sm font-medium text-foreground">
								{user.name || user.email}
							</p>
							<p className="m-0 text-xs text-muted-foreground">
								{role === "admin" ? "Administrator" : "User"}
							</p>
						</div>
					</div>
					<div className="hidden md:block">
						<SignOutButton />
					</div>
				</div>
			</header>

			<div className="flex flex-1">
				{/* Desktop sidebar */}
				<aside
					aria-label="Sidebar"
					className={cn(
						"sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground transition-[width] duration-200 md:flex",
						collapsed ? "w-[72px] px-3" : "w-64",
					)}
				>
					<NavList role={role} compact={collapsed} />
					<div className="mt-auto">
						<button
							type="button"
							onClick={toggleCollapsed}
							aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
							aria-expanded={!collapsed}
							className={cn(
								"flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-[3px] focus-visible:ring-sidebar-ring/50",
								collapsed && "justify-center px-0",
							)}
						>
							{collapsed ? (
								<ChevronsRight className="size-4 shrink-0" aria-hidden="true" />
							) : (
								<ChevronsLeft className="size-4 shrink-0" aria-hidden="true" />
							)}
							{!collapsed && <span>Collapse</span>}
						</button>
					</div>
				</aside>

				{/* Mobile drawer */}
				<Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
					<DialogContent
						showCloseButton
						className="top-0 left-0 h-dvh max-h-none w-72 max-w-[85vw] translate-x-0 translate-y-0 gap-6 rounded-none border-y-0 border-l-0 bg-sidebar p-5 text-sidebar-foreground"
					>
						<DialogTitle className="sr-only">Navigation</DialogTitle>
						<Brand />
						<NavList role={role} compact={false} onNavigate={() => setDrawerOpen(false)} />
						<div className="mt-auto flex flex-col gap-3 border-t border-sidebar-border pt-4">
							<div className="flex items-center gap-3">
								<UserAvatar name={user.name} email={user.email} />
								<div className="min-w-0">
									<p className="m-0 truncate text-sm font-medium text-foreground">
										{user.name || user.email}
									</p>
									<p className="m-0 text-xs text-muted-foreground">
										{role === "admin" ? "Administrator" : "User"}
									</p>
								</div>
							</div>
							<SignOutButton className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted" />
						</div>
					</DialogContent>
				</Dialog>

				<div className="flex min-w-0 flex-1 flex-col">
					<main id="main" className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8">
						<div className="mx-auto w-full max-w-6xl">{children}</div>
					</main>
					<Footer />
				</div>
			</div>
		</div>
	);
}
