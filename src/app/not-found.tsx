import Link from "next/link";
import { Map, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mb-6">
        <Map className="w-7 h-7 text-purple-400" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-gray-500 text-sm mb-6">This page could not be found.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
