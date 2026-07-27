import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-yellow font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground font-display">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground font-body">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-yellow"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
