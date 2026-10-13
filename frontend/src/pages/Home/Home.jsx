import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import aiService from "../../services/ai.service";

const MAX_CHARS = 2000;
const MAX_TEXTAREA_HEIGHT = 200;

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const CodeBlock = ({ children }) => {
  const codeEl = React.Children.only(children);
  const className = codeEl.props.className || "";
  const language = /language-([\w-]+)/.exec(className)?.[1] || "text";
  const code = String(codeEl.props.children).replace(/\n$/, "");

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-muted px-3 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
};

const markdownComponents = {
  pre: CodeBlock,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
      {children}
    </code>
  ),
  h1: (p) => (
    <h1
      className="mb-3 mt-6 text-xl font-semibold text-foreground first:mt-0"
      {...p}
    />
  ),
  h2: (p) => (
    <h2
      className="mb-3 mt-6 text-lg font-semibold text-foreground first:mt-0"
      {...p}
    />
  ),
  h3: (p) => (
    <h3
      className="mb-2 mt-5 text-base font-semibold text-foreground first:mt-0"
      {...p}
    />
  ),
  p: (p) => <p className="my-3 leading-7 first:mt-0 last:mb-0" {...p} />,
  ul: (p) => <ul className="my-3 list-disc space-y-1.5 pl-6" {...p} />,
  ol: (p) => <ol className="my-3 list-decimal space-y-1.5 pl-6" {...p} />,
  li: (p) => <li className="leading-7" {...p} />,
  strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
  a: (p) => (
    <a
      className="text-foreground underline underline-offset-2 hover:opacity-80"
      target="_blank"
      rel="noreferrer"
      {...p}
    />
  ),
  blockquote: (p) => (
    <blockquote
      className="my-4 border-l-2 border-border pl-4 text-muted-foreground"
      {...p}
    />
  ),
  hr: () => <hr className="my-6 border-border" />,
  table: (p) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...p} />
    </div>
  ),
  th: (p) => (
    <th
      className="border border-border bg-muted px-3 py-2 font-medium"
      {...p}
    />
  ),
  td: (p) => <td className="border border-border px-3 py-2" {...p} />,
};

const Turn = ({ turn, onRetry, retryDisabled }) => {
  return (
    <article className="space-y-3">
      {/* Prompt */}
      <div className="rounded-lg border border-border bg-muted px-4 py-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Prompt
        </p>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground sm:text-base">
          {turn.prompt}
        </p>
      </div>

      {/* Response */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5 sm:px-5">
          <h2 className="text-sm font-medium text-foreground">Response</h2>
          {turn.status === "done" && <CopyButton text={turn.answer} />}
          {turn.status === "error" && (
            <button
              type="button"
              onClick={() => onRetry(turn)}
              disabled={retryDisabled}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Retry
            </button>
          )}
        </div>

        <div className="px-4 py-4 text-sm text-foreground sm:px-5 sm:text-base">
          {turn.status === "loading" && (
            <p className="text-muted-foreground">Generating...</p>
          )}

          {turn.status === "error" && (
            <p role="alert" className="text-destructive">
              {turn.error}
            </p>
          )}

          {turn.status === "done" && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {turn.answer}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </article>
  );
};

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [turns, setTurns] = useState([]);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const loading = turns.some((t) => t.status === "loading");
  const canSubmit = prompt.trim().length > 0 && !loading;

  // Auto-grow textarea up to a max height
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [prompt]);

  // Keep the latest turn in view
  useEffect(() => {
    if (turns.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [turns]);

  const updateTurn = (id, patch) => {
    setTurns((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const runTurn = async (id, text) => {
    try {
      const data = await aiService.generateResponse(text);
      updateTurn(id, { status: "done", answer: data.answer, error: "" });
    } catch (err) {
      updateTurn(id, {
        status: "error",
        error: err.response?.data?.error || "Failed to generate response.",
      });
    }
  };

  const handleGenerate = () => {
    if (!canSubmit) return;

    const text = prompt.trim();
    const id = Date.now();

    setTurns((prev) => [
      ...prev,
      { id, prompt: text, answer: "", status: "loading", error: "" },
    ]);
    setPrompt("");
    runTurn(id, text);
  };

  const handleRetry = (turn) => {
    if (loading) return;
    updateTurn(turn.id, { status: "loading", error: "" });
    runTurn(turn.id, turn.prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleClearAll = () => {
    if (loading) return;
    setTurns([]);
    setPrompt("");
    textareaRef.current?.focus();
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-6">
      {/* Conversation */}
      <div className="flex-1 py-8 sm:py-12" aria-live="polite">
        {turns.length === 0 ? (
          <header className="pt-6 sm:pt-16">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What do you want to know?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Enter a prompt below and get a response. Answers are formatted,
              and code is shown in copyable blocks.
            </p>
          </header>
        ) : (
          <div className="space-y-8">
            {turns.map((turn) => (
              <Turn
                key={turn.id}
                turn={turn}
                onRetry={handleRetry}
                retryDisabled={loading}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 bg-background pb-4 pt-3">
        <div className="overflow-hidden rounded-lg border border-border bg-card transition-colors focus-within:border-foreground/50">
          <label htmlFor="prompt" className="sr-only">
            Prompt
          </label>
          <textarea
            id="prompt"
            ref={textareaRef}
            value={prompt}
            maxLength={MAX_CHARS}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={2}
            className="block w-full resize-none bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
          />

          <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
            <span className="text-xs text-muted-foreground">
              {prompt.length}/{MAX_CHARS}
              <span className="hidden sm:inline">
                {" "}
                · Ctrl/⌘ + Enter to send
              </span>
            </span>

            <div className="flex gap-2">
              {turns.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={loading}
                  className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canSubmit}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
