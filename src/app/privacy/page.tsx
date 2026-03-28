import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-black mb-8 dark:text-white underline decoration-primary decoration-4 underline-offset-8">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-medium">
          <p>Last updated: March 28, 2026</p>
          <p>At Nithuri Singh & Sons Associates, your privacy is our priority. This policy outlines how we collect, use, and safeguard your personal information.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">1. Information Collection</h2>
          <p>We collect information when you create an account, list a property, or contact our support. This may include your name, email, phone number, and properties of interest.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">2. Use of Information</h2>
          <p>The information we collect is used to provide and improve our services, communicate with you about listings and investments, and comply with legal requirements.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">3. Data Sharing</h2>
          <p>We do not sell your personal data. We only share information with third parties when necessary for providing our services or when required by law.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
