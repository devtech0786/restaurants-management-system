import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-6xl font-bold text-brand-500">404</h1>
      <p className="text-lg text-gray-600">Page not found</p>
      <Link
        href="/"
        className="px-6 py-2 bg-brand-500 text-white rounded-full font-medium hover:bg-brand-600 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
