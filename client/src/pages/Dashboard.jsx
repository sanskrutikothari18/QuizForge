import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Award, PlusCircle, BarChart3, User, Mail, 
  Calendar, FileText, ArrowRight, Play, Trash2, Trophy, Users, HelpCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import Logo from '../components/Logo';
import { getProfile } from '../services/authService';
import { getMyQuizzes, deleteQuiz } from '../services/quizService';
import { getMyResults } from '../services/resultService';
import { createGame } from '../services/gameService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [openReportMenuId, setOpenReportMenuId] = useState(null);

  // React Queries
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const { 
    data: quizzesData, 
    isLoading: isQuizzesLoading, 
    refetch: refetchQuizzes 
  } = useQuery({
    queryKey: ['my-quizzes'],
    queryFn: getMyQuizzes,
  });

  const { 
    data: resultsData, 
    isLoading: isResultsLoading 
  } = useQuery({
    queryKey: ['my-results'],
    queryFn: getMyResults,
  });

  // Host Game Mutation
  const hostGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Lobby initialized! 🚀');
        navigate(`/host/lobby/${data.game.pin}`);
      } else {
        toast.error(data.message || 'Failed to initialize game lobby');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error creating game session');
    }
  });

  // Calculate Metrics
  const totalQuizzes = quizzesData?.quizzes?.length || 0;
  const totalGamesHosted = resultsData?.results?.length || 0;
  const totalStudents = resultsData?.results?.reduce((sum, res) => sum + (res.players?.length || 0), 0) || 0;

  const handleHostGame = (quizId) => {
    toast.loading('Creating game lobby...', { id: 'host-game' });
    hostGameMutation.mutate(quizId, {
      onSettled: () => toast.dismiss('host-game')
    });
  };

  const isLoading = isProfileLoading || isQuizzesLoading || isResultsLoading;

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-background">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold tracking-wide text-gray-400">Loading your battle forge dashboard...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const user = profileData?.user;

  return (
    <AnimatedPage>
      <div className="flex flex-1 flex-col md:flex-row min-h-screen bg-background">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-background border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo area */}
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-outfit text-lg font-bold text-white">Fourise Quiz Hub</span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'overview' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                Overview
              </button>
              <Link 
                to="/quiz/my"
                className="flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all whitespace-nowrap"
              >
                <Award className="h-4.5 w-4.5" />
                My Quizzes
              </Link>
              <Link 
                to="/quiz/create"
                className="flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide text-gray-400 hover:text-white hover:bg-white/5 border border-transparent transition-all whitespace-nowrap"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Create Quiz
              </Link>
            </nav>
          </div>

          {/* User Mini Profile Card */}
          <div className="hidden md:flex items-center gap-3 border-t border-white/5 pt-6 mt-6">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-sm text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-left overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user?.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD */}
        <div className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="font-outfit text-3xl font-extrabold text-white">
                Dashboard Overview
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Manage your active quizzes and view participant logs.
              </p>
            </div>
            
            {/* Create Action button */}
            <Link
              to="/quiz/create"
              className="btn-premium btn-primary-gradient px-5 py-3 flex items-center gap-2 text-xs font-bold shadow-premium-glow whitespace-nowrap"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Quiz</span>
            </Link>
          </div>

          {/* METRIC CARDS GRID */}
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: 'Total Quizzes', value: totalQuizzes, icon: <FileText className="h-5 w-5 text-primary" />, desc: 'Custom battle sets built' },
              { label: 'Sessions Hosted', value: totalGamesHosted, icon: <Play className="h-5 w-5 text-secondary" />, desc: 'Real-time games executed' },
              { label: 'Total Students', value: totalStudents, icon: <Users className="h-5 w-5 text-accent" />, desc: 'Active players connected' },
            ].map((metric, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-5 text-left flex justify-between items-start relative overflow-hidden">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{metric.label}</span>
                  <div className="font-outfit text-3xl font-extrabold text-white">{metric.value}</div>
                  <p className="text-[10px] text-gray-500 font-medium">{metric.desc}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {metric.icon}
                </div>
              </div>
            ))}
          </div>

          {/* TWO PANEL CONTENT */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left/Center: Recent Quizzes */}
            <div className="lg:col-span-2 space-y-6 text-left">
              <div className="flex justify-between items-center">
                <h3 className="font-outfit text-lg font-bold text-white">Recent Quizzes</h3>
                <Link to="/quiz/my" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {quizzesData?.quizzes?.length === 0 ? (
                <div className="glass-panel rounded-2xl p-10 text-center space-y-4">
                  <HelpCircle className="h-10 w-10 text-gray-600 mx-auto" />
                  <h4 className="font-semibold text-white">No Quizzes Found</h4>
                  <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
                    You haven't forged any quizzes yet. Create your first multiplayer challenge!
                  </p>
                  <Link to="/quiz/create" className="inline-flex btn-premium btn-primary-gradient px-4 py-2.5 text-xs font-bold">
                    Create Quiz
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {quizzesData?.quizzes?.slice(0, 4).map((quiz) => (
                    <div key={quiz._id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-48 group border border-white/5 hover:border-primary/30 transition-all relative">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {quiz.category || 'General'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">{quiz.questions?.length || 0} Questions</span>
                        </div>
                        <h4 className="font-bold text-white mt-3 text-sm group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{quiz.description || 'No description provided.'}</p>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleHostGame(quiz._id)}
                          className="flex-1 btn-premium btn-primary-gradient py-2 px-3 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider shadow-premium-glow"
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
                                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-1"
                                  title={`View latest report (${quizResults[0].players?.length || 0} participants)`}
                                >
                                  <BarChart3 className="h-3 w-3 text-secondary animate-pulse" />
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Profile Summary & Stats */}
            <div className="space-y-6 text-left">
              <h3 className="font-outfit text-lg font-bold text-white">Host Profile</h3>
              
              <div className="glass-panel rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-extrabold text-base text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{user?.name}</h4>
                    <span className="text-[10px] font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">Quiz Moderator</span>
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-white/5 pt-5 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>

              {/* Recent Results Summary */}
              {resultsData?.results?.length > 0 && (
                <div className="space-y-3.5">
                  <h4 className="font-outfit text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Battle Summaries</h4>
                  <div className="space-y-3">
                    {resultsData.results.slice(0, 3).map((res) => (
                      <Link 
                        key={res._id} 
                        to={`/results/${res.sessionId}`} 
                        className="glass-panel rounded-xl p-3.5 flex items-center justify-between hover:bg-white/5 border border-white/5 transition-all block"
                      >
                        <div className="overflow-hidden pr-2">
                          <h5 className="font-bold text-white text-xs truncate">{res.quizTitle}</h5>
                          <div className="flex gap-2 items-center text-[10px] text-gray-500 mt-1">
                            <span className="flex items-center gap-0.5"><Users className="h-3 w-3" /> {res.players?.length || 0} players</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-green-400 font-semibold"><Trophy className="h-3 w-3" /> {res.winner || 'No winner'}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </AnimatedPage>
  );
}
