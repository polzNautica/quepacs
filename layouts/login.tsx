import { Link } from "@heroui/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { Divider } from "@heroui/react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-4">
        {children}
      </main>
      <Divider className="mt-10" />
      <footer className="w-full flex items-center justify-center py-3">
        <p className="text-xs text-gray-500 text-center"> © 2024-2025 Powered by FK Technology Sdn Bhd (929210-W). All Rights Reserved.</p>
      </footer>
    </div>
  );
}