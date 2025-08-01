import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, ErrorBoundary } from "solid-js";
import { AppProvider } from "./contexts/AppContext";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <ErrorBoundary
          fallback={(err) => (
            <div class="min-h-screen bg-secondary-50 flex items-center justify-center">
              <div class="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                <div class="text-6xl mb-4">💥</div>
                <h1 class="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
                <p class="text-secondary-600 mb-6">
                  Something went wrong. Please try refreshing the page.
                </p>
                <p class="text-sm text-secondary-500 mt-4">
                  Error: {err.message}
                </p>
              </div>
            </div>
          )}
        >
          <AppProvider>
            <Suspense>{props.children}</Suspense>
          </AppProvider>
        </ErrorBoundary>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
