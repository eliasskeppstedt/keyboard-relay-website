export default function Footer() {
  return (
    <footer className="py-5 text-center text-[0.75rem] text-muted font-mono tracking-widest border-t border-border space-y-1">
      <span className="block">
        Made in{" "}
        <a
          href="https://antigravity.google/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100"
        >
          Antigravity
        </a>
      </span>
      <span className="block">Keyboard ReLay © 2026</span>
    </footer>
  );
}
