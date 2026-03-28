import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <Image src="/logo-icon.svg" alt="Zypply" width={40} height={40} className="rounded-xl" />
        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
          Zypply
        </span>
      </Link>
      {children}
    </div>
  );
}
