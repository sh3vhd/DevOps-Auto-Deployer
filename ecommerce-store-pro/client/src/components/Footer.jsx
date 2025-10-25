export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} {__APP_NAME__}. Built for portfolio showcase.</p>
        <div className="flex gap-4">
          <a
            className="hover:text-neon focus-ring rounded"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="hover:text-neon focus-ring rounded"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
