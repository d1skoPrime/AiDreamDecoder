function Link({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
	return (
		<a href={href} className={className}>
			{children}
		</a>
	)
}

export default Link