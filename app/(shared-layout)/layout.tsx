import { Navbar } from "@/components/web/navbar";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
