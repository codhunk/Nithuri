import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ComplaintsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-background-dark transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-20 w-full">
        <h1 className="text-4xl font-black mb-8 dark:text-white underline decoration-primary decoration-4 underline-offset-8">Complaints Procedure</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-medium">
          <p>At Nithuri Singh & Sons Associates, we are committed to providing an exceptional level of service to all our clients. When something goes wrong, we need you to tell us about it. This will help us to improve our standards.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">How to Make a Complaint</h2>
          <p>If you have a complaint, please contact us in writing with the details. You can email us at <span className="text-primary font-bold">complaints@nithurisingh.com</span> or send a letter to our head office address.</p>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white pt-6">What Happens Next?</h2>
          <ol className="list-decimal pl-6 space-y-4">
             <li>We will send you a letter acknowledging receipt of your complaint within three working days of receiving it, enclosing a copy of this procedure.</li>
             <li>We will then investigate your complaint. This will normally be dealt with by the office manager who will review your file and speak to the member of staff who acted for you.</li>
             <li>A formal written outcome of our investigation will be sent to you within 15 working days of sending the acknowledgement letter.</li>
          </ol>
        </div>

        <div className="mt-20 p-8 border-2 border-primary/20 dark:border-primary/40 rounded-[2rem] bg-slate-50 dark:bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 pl-1">Need Faster Help?</p>
              <h3 className="text-2xl font-black dark:text-white">Our Support Team is Online</h3>
           </div>
           <a href="/contact" className="px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 min-w-[200px] text-center">
              Open Support Ticket
           </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
