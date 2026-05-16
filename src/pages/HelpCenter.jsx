import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, MessageCircle } from "lucide-react";

const faqs = [
  {
    question: "How do I save a movie or show for later?",
    answer:
      "Click the 'Save for Later' button on any movie's hero banner or detail page. You must be logged in. All saved items appear in 'My Watchlist' under your profile menu.",
  },
  {
    question: "How do I use AI Movie Picks?",
    answer:
      "Click the 'Get AI Movie Picks' button in the navbar. You'll be asked a few questions about your mood and preferences, and our AI will recommend personalized movies and shows for you.",
  },
  {
    question: "How do I search for a movie or TV show?",
    answer:
      "Use the search bar in the navbar and type any movie, show, or anime title. Results will show both movies and TV shows with their type labeled.",
  },
  {
    question: "Why is the Watch Now button disabled?",
    answer:
      "The Watch Now button opens the official YouTube trailer. If it's disabled, it means no trailer is available on YouTube for that title yet.",
  },
  {
    question: "How do I remove a movie from my Watchlist?",
    answer:
      "Go to My Watchlist from your profile menu. Hover over any card and click the red trash icon that appears to remove it.",
  },
  {
    question: "How do I log out?",
    answer:
      "Click your profile avatar in the top right corner, then click 'Log Out' from the dropdown menu.",
  },
  {
    question: "I forgot my password. What do I do?",
    answer:
      "Currently, please contact our support team via the contact form below and we'll help you reset your password manually.",
  },
  {
    question: "Why are some movie details showing N/A?",
    answer:
      "Movie details like budget, revenue, and countries are sourced from The Movie Database (TMDB). Some titles may have incomplete data on their end.",
  },
];

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`bg-[#232323] rounded-xl border transition-all duration-200
        ${open ? "border-[#e50914]/60" : "border-[#333]"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 text-left"
      >
        <span className="text-white font-medium">{faq.question}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#e50914] shrink-0 ml-4" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[#888] shrink-0 ml-4" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-4 text-[#aaa] text-sm leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
};

const HelpCenter = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    // Simulate sending — wire to your backend if needed
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#232323] to-[#181818] px-6 md:px-16 py-12 text-white">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold mb-2">Help Center</h1>
        <p className="text-[#888] text-sm">
          Find answers to common questions or contact our support team.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <div className="bg-[#232323] border border-[#333] rounded-xl p-6 flex items-center gap-4">
          <div className="bg-[#e50914]/10 p-3 rounded-full">
            <MessageCircle className="w-6 h-6 text-[#e50914]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Browse FAQs</h3>
            <p className="text-[#888] text-xs mt-1">
              Quick answers to the most common questions.
            </p>
          </div>
        </div>
        <div className="bg-[#232323] border border-[#333] rounded-xl p-6 flex items-center gap-4">
          <div className="bg-[#e50914]/10 p-3 rounded-full">
            <Mail className="w-6 h-6 text-[#e50914]" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Contact Support</h3>
            <p className="text-[#888] text-xs mt-1">
              Fill out the form below and we'll get back to you.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="flex flex-col gap-3 mb-16">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} />
        ))}
      </div>

      {/* Contact Form */}
      <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
      <div className="bg-[#232323] border border-[#333] rounded-2xl p-8 max-w-2xl">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <p className="text-4xl">✅</p>
            <p className="text-white font-semibold text-lg">Message Sent!</p>
            <p className="text-[#888] text-sm text-center">
              Thanks for reaching out. We'll get back to you within 24-48 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}
              className="mt-4 bg-[#e50914] text-white px-6 py-2 rounded-full text-sm hover:bg-red-700 transition"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm text-[#aaa] mb-1 block">Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-[#aaa] mb-1 block">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-[#aaa] mb-1 block">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your issue or question..."
                rows={5}
                className="w-full bg-[#181818] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#e50914] text-white py-3 rounded-full font-semibold hover:bg-red-700 transition disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;