export default function Footer() {
  return (
    <footer className="py-5 text-center text-[0.75rem] text-muted font-mono tracking-widest border-t border-border space-y-1">
      <span className="block">
        Site generated with {" "}
        <a
          href="https://antigravity.google/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-100"
        >
          Antigravity
        </a> and good {" "}
        <a
          href="https://www.ibm.com/think/topics/vibe-coding"
          target="_blank"
          rel="noopener noreferrer"
          title="With good vibes?"
        >
          vibes
        </a> 😎
      </span>
      <span className="block">Keyboard ReLay © 2026</span>
    </footer>
  );
}
