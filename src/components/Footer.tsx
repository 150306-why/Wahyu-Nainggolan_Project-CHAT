export default function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className="border-t border-border px-4 py-6 text-sm text-muted-foreground">
			<div className="page-wrap flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
				<p className="m-0">&copy; {year} Ekraf Dashboard</p>
				<p className="m-0 text-xs">Built with TanStack Start</p>
			</div>
		</footer>
	);
}
