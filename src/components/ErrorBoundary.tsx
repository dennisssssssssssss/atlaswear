import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";

interface ErrorBoundaryProps {
  children: ReactNode;
  title: string;
  description: string;
  cta: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Application error boundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground px-4 py-24">
          <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              {siteConfig.brandShortName}
            </p>
            <h1 className="mt-4 font-heading text-4xl">{this.props.title}</h1>
            <p className="mt-4 text-muted-foreground">{this.props.description}</p>
            <Link
              to="/"
              className="mt-8 inline-flex rounded-full border border-gold px-5 py-3 text-sm uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
            >
              {this.props.cta}
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { t } = useLanguage();

  return (
    <ErrorBoundaryInner
      title={t("errorBoundary.title")}
      description={t("errorBoundary.description")}
      cta={t("errorBoundary.cta")}
    >
      {children}
    </ErrorBoundaryInner>
  );
};

export default ErrorBoundary;
