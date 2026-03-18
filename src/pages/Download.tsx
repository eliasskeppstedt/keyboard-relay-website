export default function Download() {
  return (
    <div className="w-full max-w-[480px] flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-baseline gap-3">
        <span className="w-[6px] h-[6px] rounded-full bg-accent flex-shrink-0 self-center animate-pulse" />
        <span className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em]">Under construction</span>
      </div>

      {/* Message */}
      <div className="border-l-2 border-border pl-5">
        <h1 className="text-[1.4rem] font-normal leading-relaxed text-text mb-2">
          Download
        </h1>
        <p className="text-[0.9rem] text-muted leading-relaxed">
          Keyboard ReLay is not done for downloading yet. If you are interested in the source code,
          you can find it on the Keyboard ReLay app repository on GitHub.
        </p>
      </div>


      <div className="flex flex-col gap-3">
        <a
          className="flex items-center justify-between px-[1.1rem] py-[0.9rem] bg-card border border-border rounded-[var(--radius-panel)] no-underline text-text text-[0.85rem] transition-all duration-200 group hover:border-accent hover:bg-accent-dim"
          href="https://github.com/eliasskeppstedt/keyboard-relay-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[0.8rem] text-text">keyboard-relay-app</span>
            <span className="text-[0.75rem] text-muted">Keyboard ReLay (the app)</span>
          </div>
          <span className="text-muted text-[0.8rem] transition-all duration-200 group-hover:text-accent group-hover:translate-x-[3px]">→</span>
        </a>
      </div>
    </div>
  );
}
