import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { getFaqs } from '../services/infoService';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(0); // first item open by default
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    const fetchFaqsData = async () => {
      setLoading(true);
      const data = await getFaqs();
      if (isMounted) {
        setFaqs(data);
        setLoading(false);
      }
    };
    fetchFaqsData();
    return () => { isMounted = false; };
  }, []);

  const categories = ['All', ...Array.from(new Set(faqs.map(f => f.category || 'General')))];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => (f.category || 'General') === activeCategory);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 scroll-mt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6 sm:mb-8"
      >
        <span className="text-xs font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3.5 py-1.5 rounded-full border border-primary/20">
          Got Questions?
        </span>
        <h2 className="font-outfit text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
          Frequently Asked <span className="text-gradient-primary">Questions</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-xl mx-auto leading-relaxed">
          Everything you need to know about Quiz Hub live battles, plans, export reporting, and account security.
        </p>

        {/* Category Filter Pills */}
        {categories.length > 2 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Accordion Container */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="glass-panel p-5 rounded-2xl animate-pulse border border-white/10 h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-4 text-left">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={faq._id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className={`glass-panel rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-primary/40 bg-white/10 shadow-xl' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`h-5 w-5 shrink-0 ${isOpen ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="font-outfit font-bold text-white text-base sm:text-lg">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-xl bg-white/5 border border-white/10 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180 bg-primary/20 text-primary border-primary/30' : 'text-gray-400'
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 mt-1 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Support Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 glass-panel p-6 rounded-3xl border border-white/15 text-center flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="h-12 w-12 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-white text-base">Have more questions?</h4>
            <p className="text-xs text-gray-400">Our support squad is available 24/7 to assist you.</p>
          </div>
        </div>

        <a
          href="mailto:support@fourisequiz.com"
          className="btn-premium btn-secondary-gradient px-6 py-3 text-xs font-bold rounded-xl whitespace-nowrap shadow-secondary-glow"
        >
          Contact Support Team
        </a>
      </motion.div>
    </section>
  );
}
