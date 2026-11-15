export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-4 text-center text-sm text-muted">
      <div className="flex justify-center gap-4 font-semibold">
        <a
          href="https://github.com/q1Lim"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
        <a href="mailto:cochlea00@gmail.com" className="hover:text-foreground">
          Email
        </a>
      </div>
      <p>© {year} qlog. Powered by Next.js</p>
    </footer>
  );
}
