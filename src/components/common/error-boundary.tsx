import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../../i18n";

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
          className="p-6 bg-red-950 text-white h-screen font-mono text-xs overflow-auto"
        >
          <h2 className="text-xl font-bold mb-4">
            {i18n.t("common.systemError", "Lỗi Hệ Thống")}
          </h2>
          {import.meta.env.DEV && (
            <p className="mb-4 whitespace-pre-wrap break-all">
              {this.state.error?.toString()}
            </p>
          )}
          {!import.meta.env.DEV && (
            <p className="mb-4">
              {i18n.t(
                "common.errorOccurred",
                "Đã xảy ra lỗi. Vui lòng tải lại trang.",
              )}
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 p-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
          >
            {i18n.t("common.reloadPage", "TẢI LẠI TRANG")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
