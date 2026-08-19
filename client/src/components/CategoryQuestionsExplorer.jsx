import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Plus, CheckCircle, Clock, Sparkles, BookOpen, 
  HelpCircle, ChevronRight, Layers, Lightbulb, Copy, X, ArrowRight,
  Briefcase, Feather, Film, Utensils, Music, Trophy, Trees, 
  Calculator, GraduationCap, Gamepad2, Rocket, Globe, Code, Monitor
} from 'lucide-react';
import toast from 'react-hot-toast';
import { prebuiltQuestions, getQuestionsForCategory, getAllCategories } from '../data/prebuiltQuestions';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  HelpCircle,
  Sparkles,
  Code,
  Globe,
  BookOpen,
  GraduationCap,
  Rocket,
  Gamepad2,
  Calculator,
  Trees,
  Trophy,
  Music,
  Utensils,
  Film,
  Feather,
  Briefcase,
  Monitor
};

const CategoryIcon = ({ name, className = "h-3.5 w-3.5" }) => {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent className={className} />;
};

export default function CategoryQuestionsExplorer({
  activeCategory = 'general knowledge',
  onAddQuestion,
  onImportAll,
  onCreateQuizFromCategory,
  isModal = false,
  onClose
}) {
  const { themeMode } = useTheme();
  const isLight = themeMode === 'light';

  const categories = useMemo(() => getAllCategories(), []);
  const [selectedCatKey, setSelectedCatKey] = useState(activeCategory.toLowerCase());
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically retrieve reference questions matching searched category or search term
  const currentQuestions = useMemo(() => {
    return getQuestionsForCategory(selectedCatKey, searchQuery);
  }, [selectedCatKey, searchQuery]);

  const handleCopyQuestion = (q) => {
    const text = `${q.questionText}\nOptions:\n1. ${q.options[0]}\n2. ${q.options[1]}\n3. ${q.options[2]}\n4. ${q.options[3]}\nAnswer: ${q.options[q.correctAnswer]}`;
    navigator.clipboard.writeText(text);
    toast.success('Question copied to clipboard!');
  };

  const handleAddSingle = (q) => {
    if (onAddQuestion) {
      onAddQuestion({
        questionText: q.questionText,
        options: [...q.options],
        correctAnswer: q.correctAnswer,
        timeLimit: q.timeLimit || 15,
        backgroundImage: ''
      });
      toast.success('Added reference question to quiz!');
    }
  };

  const handleImportAllCategory = () => {
    if (onImportAll && currentQuestions.length > 0) {
      onImportAll(currentQuestions);
      toast.success(`Imported ${currentQuestions.length} questions from ${selectedCatKey}!`);
    } else if (onCreateQuizFromCategory && currentQuestions.length > 0) {
      onCreateQuizFromCategory(selectedCatKey, currentQuestions);
    }
  };

  const content = (
    <div className={`flex flex-col space-y-4 ${isModal ? 'p-4 sm:p-6' : 'py-4'}`}>
      {/* Search & Header Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search category or question topic (e.g. Science, Space, HTML)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            style={{
              backgroundColor: isLight ? 'rgba(249, 250, 251, 0.9)' : 'rgba(20, 20, 30, 0.8)',
              borderColor: isLight ? 'rgba(209, 213, 219, 0.8)' : 'rgba(255, 255, 255, 0.12)',
              color: 'var(--text-main)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Button */}
        {currentQuestions.length > 0 && (
          <button
            type="button"
            onClick={handleImportAllCategory}
            className="btn-premium btn-primary-gradient px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shrink-0 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>{onImportAll ? 'Import All Category Questions' : 'Create Quiz from Category'}</span>
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {categories.map((cat) => {
          const isActive = selectedCatKey.toLowerCase() === cat.key.toLowerCase();
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setSelectedCatKey(cat.key);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105'
                  : isLight
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <CategoryIcon name={cat.icon} className="h-3.5 w-3.5 shrink-0" />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/10 text-gray-500'}`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions Preview Cards Grid */}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {currentQuestions.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-gray-500/20">
            <HelpCircle className="h-10 w-10 text-gray-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-gray-400">No reference questions found for "{searchQuery || selectedCatKey}".</p>
            <p className="text-xs text-gray-500 mt-1">Try selecting another category pill above.</p>
          </div>
        ) : (
          currentQuestions.map((q, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="p-3.5 sm:p-4 rounded-xl border transition-all hover:border-primary/40 group"
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 15, 25, 0.8)',
                borderColor: isLight ? 'rgba(229, 231, 235, 1)' : 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-heading)' }}>
                    {q.questionText}
                  </h4>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/10 text-secondary font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {q.timeLimit || 15}s
                  </span>

                  {onAddQuestion && (
                    <button
                      type="button"
                      onClick={() => handleAddSingle(q)}
                      className="px-2.5 py-1 rounded-lg bg-primary/15 hover:bg-primary text-primary hover:text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleCopyQuestion(q)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Copy Question text"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswer;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isCorrect
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold'
                          : isLight
                          ? 'bg-gray-50 border border-gray-200 text-gray-700'
                          : 'bg-white/5 border border-white/5 text-gray-300'
                      }`}
                    >
                      <span className="truncate pr-2">
                        <strong className="mr-1.5 opacity-60">{String.fromCharCode(65 + oIdx)}.</strong>
                        {opt}
                      </span>
                      {isCorrect && <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  if (!isModal) {
    return (
      <div 
        className="rounded-2xl border shadow-xl backdrop-blur-xl p-4 sm:p-6"
        style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12, 12, 20, 0.98)',
          borderColor: isLight ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.10)'
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <div>
              <h3 className="font-outfit text-base sm:text-lg font-bold" style={{ color: 'var(--text-heading)' }}>
                Theme & Category Reference Questions
              </h3>
              <p className="text-xs text-gray-400">Dynamically matching pre-built questions for "{selectedCatKey}"</p>
            </div>
          </div>
        </div>

        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden"
        style={{
          backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(12, 12, 20, 0.98)',
          borderColor: isLight ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b flex items-center justify-between" style={{ borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-outfit text-base sm:text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
                Category Reference Questions
              </h3>
              <p className="text-xs text-gray-400">Search and import pre-built questions for your quiz.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {content}
        </div>
      </div>
    </div>
  );
}
