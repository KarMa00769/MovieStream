import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 mt-5 text-center text-white" style={{ minHeight: '80vh' }}>
          <h2 className="mb-3"><i className="bi bi-exclamation-triangle text-warning"></i> Algo sali&oacute; mal</h2>
          <p className="text-secondary mb-4">Ocurri&oacute; un error inesperado. Intenta recargar la p&aacute;gina.</p>
          <button className="btn btn-brand" onClick={() => window.location.reload()}>
            Recargar p&aacute;gina
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
