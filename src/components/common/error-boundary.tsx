import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="p-6 bg-red-100 dark:bg-red-950 text-red-900 dark:text-white h-screen font-mono text-xs overflow-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            <i className="fas fa-bug mr-2" />
            Lỗi Hệ Thống
          </h2>
          <p className="mb-4">{this.state.error?.toString()}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 p-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
          >
            TẢI LẠI TRANG
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
