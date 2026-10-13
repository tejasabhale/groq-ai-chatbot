import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-5 text-sm text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} AI
      </div>
    </footer>
  );
};

export default Footer;
