export default function Download() {
  return (
    <div className="w-full max-w-[480px] flex flex-col gap-8">

      {/* Message */}
      <div className="border-l-2 border-border pl-5">
        <h1 className="text-[1.4rem] font-normal leading-relaxed text-text mb-4">
          Download
        </h1>
        <p className="text-[0.95rem] text-text/90 leading-relaxed">
          The program is in a very early stage and has a pre-release version available to
          download. Bugs might still occur, probably related to the state of a key.{' '}
          <a
            href="https://github.com/eliasskeppstedt/keyboard-relay-app?tab=readme-ov-file#run-program"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Here
          </a>{' '}
          you can see how to run the program, and you can download it from the links below.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.08em]">
            Download Keyboard ReLay
          </h2>
          <a
            className="flex items-center justify-between px-[1.1rem] py-[0.9rem] bg-card border border-border rounded-[var(--radius-panel)] no-underline text-text text-[0.85rem] transition-all duration-200 group hover:border-accent hover:bg-accent-dim"
            href="https://github.com/eliasskeppstedt/keyboard-relay-app/releases/download/v0.0.2/Keyboard.ReLay.zip"
            target="_blank"
            rel="noopener noreferrer"
            title="Download now"
            download
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[0.85rem] text-text">Windows Release v0.0.2</span>
                <span className="text-[0.7rem] text-muted">Keyboard.ReLay.zip</span>
              </div>
            </div>
            <span className="inline-flex items-center justify-center text-muted text-[0.8rem] transition-transform duration-200 group-hover:text-accent group-hover:translate-x-[3px] will-change-transform transform-gpu">→</span>
          </a>
        </div>

        <div className="h-[1px] bg-border/50" />

        <div className="flex flex-col gap-3">
          <a
            className="flex items-center justify-between px-[1.1rem] py-[0.9rem] bg-card/40 border border-border/50 rounded-[var(--radius-panel)] no-underline text-muted text-[0.85rem] transition-all duration-200 group hover:border-border hover:bg-card hover:text-text"
            href="https://github.com/eliasskeppstedt/keyboard-relay-app/releases/tag/v0.0.2"
            target="_blank"
            rel="noopener noreferrer"
            title="Take me to the release page on GitHub"
          >
            <div className="flex items-center gap-4 text-muted group-hover:text-text transition-colors duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-[0.8rem]">View all assets on GitHub Release Page</span>
            </div>
            <span className="inline-flex items-center justify-center text-muted text-[0.8rem] transition-transform duration-200 group-hover:translate-x-[3px] will-change-transform transform-gpu">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
