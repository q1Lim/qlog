import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border py-4">
      <Link href="/" className="font-semibold text-foreground">
        qlog
      </Link>
      <nav className="flex items-center gap-4 text-sm text-muted">
        <Link href="/about" className="hover:text-foreground">
          About
        </Link>
        <a
          href="https://github.com/q1Lim"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}
