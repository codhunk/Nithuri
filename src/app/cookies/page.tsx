import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CookiePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-black mb-8 underline decoration-primary decoration-4 underline-offset-8">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 font-medium">
          <p>This Cookie Policy explains how Nithuri Singh & Sons Associates uses cookies and similar technologies to recognize you when you visit our website.</p>
          
          <h2 className="text-2xl font-black text-slate-900 pt-6">1. What Are Cookies?</h2>
          <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide info to the site owners.</p>
          
          <h2 className="text-2xl font-black text-slate-900 pt-6">2. Why Do We Use Cookies?</h2>
          <p>We use cookies for several reasons. Some are required for technical reasons for our website to operate, and we refer to these as "essential" cookies. Others enable us to track and target the interests of our users to enhance the experience on our site.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
