import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Play, Trash2, Search, Filter, Plus, ArrowLeft, 
  HelpCircle, MoreVertical, Calendar, ArrowRight, ShieldCheck,
  BarChart3, Trophy, Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { getMyQuizzes, deleteQuiz } from '../services/quizService';
import { getMyResults } from '../services/resultService';
import { createGame } from '../services/gameService';

export default function MyQuizzes() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openReportMenuId, setOpenReportMenuId] = useState(null);

  // Query to fetch quizzes
  const { 
    data, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['my-quizzes-full'],
    queryFn: getMyQuizzes,
  });

  const { 
    data: resultsData, 
    isLoading: isResultsLoading 
  } = useQuery({
    queryKey: ['my-results'],
    queryFn: getMyResults,
  });

  // Launch Host Game Mutation
  const hostGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Lobby created! PIN active 🚀');
        navigate(`/host/lobby/${data.game.pin}`);
      } else {
        toast.error(data.message || 'Lobby creation failed');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error creating lobby session');
    }
  });

  // Delete Quiz Mutation
  const deleteQuizMutation = useMutation({
    mutationFn: deleteQuiz,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Quiz deleted successfully');
        refetch();
      } else {
        toast.error(data.message || 'Failed to delete quiz');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error deleting quiz');
    }
  });

  const handleHostGame = (quizId) => {
    toast.loading('Initializing lobby...', { id: 'lobby-init' });
    hostGameMutation.mutate(quizId, {
      onSettled: () => toast.dismiss('lobby-init')
    });
  };

  const handleDeleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      toast.loading('Deleting quiz...', { id: 'quiz-delete' });
      deleteQuizMutation.mutate(quizId, {
        onSettled: () => toast.dismiss('quiz-delete')
      });
    }
  };

  // Filter quizzes based on search query and category selector
  const quizzes = data?.quizzes || [];
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                            quiz.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Unique categories list
  const categories = ['all', ...new Set(quizzes.map(q => q.category).filter(Boolean))];

  return (
    <AnimatedPage>
      <div className="relative min-h-screen bg-background text-gray-200 p-6 sm:p-8">
        
        {/* Glow Spheres */}
        <div className="absolute top-[-5%] left-[10%] h-[350px] w-[350px] bg-glow-primary pointer-events-none opacity-40"></div>
        <div className="absolute bottom-[10%] right-[5%] h-[400px] w-[400px] bg-glow-secondary pointer-events-none opacity-30"></div>

        <div className="mx-auto max-w-7xl relative z-10 space-y-6 text-left">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <h1 className="font-outfit text-3xl font-extrabold text-white">My Quizzes</h1>
                <p className="text-xs text-gray-400 mt-1">Manage and launch your multiplayer rooms.</p>
              </div>
            </div>

            <Link
              to="/quiz/create"
              className="btn-premium btn-primary-gradient px-5 py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-premium-glow"
            >
              <Plus className="h-4 w-4" />
              <span>Forge a Quiz</span>
            </Link>
          </div>

          {/* FILTERING CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                <Search className="h-4.5 w-4.5" />
              </div>
              <input
                type="text"
                placeholder="Search quizzes by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 pl-11 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Category Dropdown */}
            {categories.length > 1 && (
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl bg-[#111115] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary uppercase font-semibold tracking-wider cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* QUIZZES CARD GRID */}
          {isLoading || isResultsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 skeleton-loading rounded-2xl"></div>
              ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="glass-panel rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto">
              <HelpCircle className="h-12 w-12 text-gray-600 mx-auto" />
              <h3 className="font-outfit text-xl font-bold text-white">No Quizzes Found</h3>
              <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                {searchQuery || selectedCategory !== 'all' 
                  ? "We couldn't find any quizzes matching your search keyword or selected category filter."
                  : "You haven't forged any quizzes yet. Click 'Forge a Quiz' to start creating your first multiplayer room."}
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="btn-premium btn-glass px-4 py-2 text-xs font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredQuizzes.map((quiz) => (
                  <motion.div
                    key={quiz._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="glass-panel rounded-2xl p-5.5 flex flex-col justify-between h-52 border border-white/5 hover:border-primary/25 transition-all group relative"
                  >
                    <div className="flex flex-col gap-2">
                      {/* Badge / Header bar */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {quiz.category || 'General'}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-500 font-semibold">{quiz.questions?.length || 0} Questions</span>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="p-1 rounded-lg border border-red-500/10 text-red-500/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                            title="Delete Quiz"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="px-1 pt-2">
                        <h3
                          className="font-outfit text-white text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug"
                          style={{ fontWeight: 900, letterSpacing: '-0.02em' }}
                        >
                          {quiz.title}
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {quiz.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>

                    {/* Launch button */}
                    <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-white/5">
                      <button
                        onClick={() => handleHostGame(quiz._id)}
                        className="flex-1 btn-premium btn-primary-gradient py-2 px-4 flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-premium-glow"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Launch Lobby</span>
                      </button>

                      {(() => {
                        const quizResults = resultsData?.results?.filter(res => res.quizId?._id === quiz._id) || [];
                        if (quizResults.length > 0) {
                          return (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (quizResults.length === 1) {
                                    navigate(`/results/${quizResults[0].sessionId}`);
                                  } else {
                                    setOpenReportMenuId(openReportMenuId === quiz._id ? null : quiz._id);
                                  }
                                }}
                                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                                title={`View latest report (${quizResults[0].players?.length || 0} participants)`}
                              >
                                <BarChart3 className="h-3.5 w-3.5 text-secondary animate-pulse" />
                                <span>Reports ({quizResults.length})</span>
                              </button>

                              {openReportMenuId === quiz._id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-20" 
                                    onClick={() => setOpenReportMenuId(null)}
                                  />
                                  <div className="absolute right-0 bottom-full mb-2 w-64 rounded-xl bg-[#111115]/95 border border-white/10 p-2 shadow-2xl backdrop-blur-xl z-30 space-y-1">
                                    <div className="px-2.5 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 mb-1 flex items-center gap-1">
                                      <Trophy className="h-3 w-3 text-accent" />
                                      <span>Select Battle Session</span>
                                    </div>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                      {quizResults.map((res) => (
                                        <button
                                          key={res._id}
                                          onClick={() => {
                                            setOpenReportMenuId(null);
                                            navigate(`/results/${res.sessionId}`);
                                          }}
                                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-white/5 transition-all flex flex-col gap-0.5 border border-transparent hover:border-white/5"
                                        >
                                          <div className="flex justify-between items-center text-[10px] font-bold text-white">
                                            <span>{new Date(res.playedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-[9px] text-green-400 font-semibold">{res.winner ? `🏆 ${res.winner}` : 'No winner'}</span>
                                          </div>
                                          <div className="text-[9px] text-gray-500 font-medium flex items-center gap-1">
                                            <Users className="h-2.5 w-2.5" />
                                            <span>{res.players?.length || 0} participants</span>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </AnimatedPage>
  );
}
