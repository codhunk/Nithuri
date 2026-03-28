import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-black mb-8 dark:text-white underline decoration-primary decoration-4 underline-offset-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-medium">
          <p>Last updated: March 28, 2026</p>
          <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Nithuri Singh & Sons Associates platform.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">1. Acceptance of Terms</h2>
          <p>By accessing and using our website, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use our services.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">2. Use of Services</h2>
          <p>You agree to use our platform only for lawful purposes. You are responsible for all activity that occurs under your account. We reserve the right to suspend or terminate accounts that violate our community guidelines.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">3. Property Listings</h2>
          <p>Nithuri Singh & Sons Associates provides a platform for listing and discovering properties. While we strive for accuracy, we do not warrant the completeness or reliability of any listings on our platform.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">4. Intellectual Property</h2>
          <p>All content on this site, including text, graphics, logos, and images, is the property of Nithuri Singh & Sons Associates or its content suppliers and is protected by international copyright laws.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">5. Limitation of Liability</h2>
          <p>Nithuri Singh & Sons Associates shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
