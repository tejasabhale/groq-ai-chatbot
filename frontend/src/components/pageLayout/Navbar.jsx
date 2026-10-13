import React from "react";

const Navbar = () => {
  return (
    <header className="border-b border-border bg-background">
      <nav className="mx-auto flex h-14 w-full max-w-3xl items-center justify-center px-4 sm:px-6">
        <a
          href="/"
          className="text-lg font-semibold tracking-tight text-primary"
        >
          AI
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
