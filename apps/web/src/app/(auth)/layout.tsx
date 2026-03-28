import Link from "next/link";
import { Rocket } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Rocket className="h-5 w-5 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          ApplyPilot
        </span>
      </Link>
      {children}
    </div>
  );
}
