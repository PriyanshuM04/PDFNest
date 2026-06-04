import type { ReactNode } from "react";
import { FileStack } from "lucide-react";

import { useTheme } from "../hooks/useTheme";
import { ThemeToggle } from "./ThemeToggle";
import { ToastProvider } from "../contexts/toast";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-paper text-ink transition dark:bg-slate-950 dark:text-slate-50">
        <header className="border-b border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-nest text-white">
                <FileStack size={20} />
              </div>
              <div>
                <p className="text-lg font-semibold leading-6">PDFNest</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Lightweight PDF utilities</p>
              </div>
            </div>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
