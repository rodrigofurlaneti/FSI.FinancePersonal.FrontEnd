import React from "react";

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-x-circle-fill text-danger fs-2 me-2" aria-hidden="true"></i>
            <h3 className="mb-0">Algo deu errado.</h3>
          </div>
          <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.error ?? "")}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}