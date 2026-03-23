export default function About() {
  return (
    <div className="w-full max-w-[480px] flex flex-col gap-8">

      {/* Main Description */}
      <div className="flex flex-col gap-6">
        <div className="border-l-2 border-border pl-5">
          <h1 className="text-[1.4rem] font-normal leading-relaxed text-text mb-4">
            About
          </h1>
          <p className="text-[0.95rem] text-text/90 leading-relaxed">
            Keyboard ReLay is a program that makes keyboard modification accessible to everyone.
            The website is a visual mapping tool, which allows you to easily customize your key layout.
            Simply the tool page and make your changes, while a configuration file is generated holding your remaps.
            When youre done, download the file and use it with Keyboard ReLay.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-[0.9rem] text-muted leading-relaxed">
          <p>
            This mapping interface is inspired by Oryx, which is a visual configuration tool from <a href="https://www.zsa.io/voyager" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              ZSA
            </a> for their split keyboards. I use their <strong>Voyager</strong> keyboard and find it
            amazing to use, and a big part of it is the intuitive and accessable configuration.
          </p>
          <p>
            There are many tools available for advanced remapping of your keyboard, however Keyboard ReLay aims to
            provide a similar experience as that of Oryx, bringing the same type of usability to regular keyboards.
          </p>
        </div>
      </div>

      {/* Divider and Repo Intro */}
      <div className="border-t border-border pt-2">
        <p className="text-[0.85rem] text-muted leading-relaxed italic">
          You can find the source code for Keyboard ReLay and this website in the repositories below
        </p>
      </div>

      {/* Links */}
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
          <span className="inline-flex items-center justify-center text-muted text-[0.8rem] transition-transform duration-200 group-hover:text-accent group-hover:translate-x-[3px] will-change-transform transform-gpu">→</span>
        </a>

        <a
          className="flex items-center justify-between px-[1.1rem] py-[0.9rem] bg-card border border-border rounded-[var(--radius-panel)] no-underline text-text text-[0.85rem] transition-all duration-200 group hover:border-accent hover:bg-accent-dim"
          href="https://github.com/eliasskeppstedt/keyboard-relay-website"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[0.8rem] text-text">keyboard-relay-web</span>
            <span className="text-[0.75rem] text-muted">Website sources</span>
          </div>
          <span className="inline-flex items-center justify-center text-muted text-[0.8rem] transition-transform duration-200 group-hover:text-accent group-hover:translate-x-[3px] will-change-transform transform-gpu">→</span>
        </a>
      </div>

      {/* Author */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="font-mono text-[0.75rem] text-muted">Elias Skeppstedt</span>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/eliasskeppstedt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors duration-200"
            aria-label="GitHub"
          >
            {/* GitHub icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/elias-skeppstedt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors duration-200"
            aria-label="LinkedIn"
          >
            {/* LinkedIn icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>

    </div>
  );
}

