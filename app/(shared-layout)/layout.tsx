import { Navbar } from "@/components/web/navbar";
import { Footer } from "@/components/web/footer";
import { ScrollToTop } from "@/components/web/ScrollToTop";

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 md:px-6 lg:px-8">
        {children}
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
