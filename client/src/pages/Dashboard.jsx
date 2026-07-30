import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Award, PlusCircle, Mail,
  Calendar, FileText, ArrowRight, Play, Users, HelpCircle,
  X, Trophy, Clock, BarChart3, UserCheck, ChevronRight, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import Logo from '../components/Logo';
import { getProfile } from '../services/authService';
import { getMyQuizzes } from '../services/quizService';
import { getMyResults } from '../services/resultService';
import { createGame } from '../services/gameService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeModal, setActiveModal] = useState(null); // 'sessions' | 'students' | null

  // Clear any lingering guest credentials so Host testing doesn't get bugged
  useEffect(() => {
    localStorage.removeItem('guest_playerName');
    localStorage.removeItem('guest_pin');
  }, []);

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
        toast.success('Lobby initialized!');
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
  const hostedSessions = resultsData?.results || [];
  const totalGamesHosted = hostedSessions.length;

  // Process Student Data Across Sessions
  const studentMap = {};
  hostedSessions.forEach(res => {
    (res.players || []).forEach(p => {
      const pName = p.name || p.username || 'Student';
      if (!studentMap[pName]) {
        studentMap[pName] = { name: pName, totalScore: 0, sessionsCount: 0, avatar: p.avatar };
      }
      studentMap[pName].totalScore += (p.score !== undefined ? p.score : (p.totalScore || 0));
      studentMap[pName].sessionsCount += 1;
    });
  });
  const studentList = Object.values(studentMap).sort((a, b) => b.totalScore - a.totalScore);
  const totalStudents = studentList.length || hostedSessions.reduce((sum, res) => sum + (res.players?.length || 0), 0);

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
            <p className="text-sm font-semibold tracking-wide text-gray-400">Loading your battle dashboard...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  const user = profileData?.user;

  return (
    <AnimatedPage>
      <div className="flex flex-1 flex-col md:flex-row min-h-screen bg-background overflow-x-hidden">

        {/* SIDEBAR */}
        <aside className="w-full md:w-64 bg-background border-b md:border-b-0 md:border-r border-white/5 px-4 py-4 md:p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-8">
            {/* Logo area */}
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-outfit text-lg font-bold text-white">Fourise <span className="text-secondary">Quiz Hub</span></span>
            </div>

            {/* Nav links */}
            <nav className="flex flex-row md:flex-col gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-1 px-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => navigate('/quiz/my')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide transition-all whitespace-nowrap text-gray-400 hover:text-white hover:bg-white/5 border border-transparent`}
              >
                <FileText className="h-4 w-4" />
                <span>My Quizzes</span>
              </button>

              <button
                onClick={() => navigate('/quiz/create')}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl tracking-wide transition-all whitespace-nowrap text-gray-400 hover:text-white hover:bg-white/5 border border-transparent`}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create New Quiz</span>
              </button>
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
        <div className="flex-1 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 overflow-y-auto overflow-x-hidden">

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

          {/* METRIC CARDS GRID WITH SEPARATE DISTINCT ACTIONS */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
            {/* Total Quizzes Card -> Navigates to My Quizzes */}
            <div 
              onClick={() => navigate('/quiz/my')}
              className="glass-panel rounded-2xl p-5 text-left flex justify-between items-start relative overflow-hidden group border border-white/5 hover:border-primary/40 hover:scale-[1.02] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-primary transition-colors">Total Quizzes</span>
                <div className="font-outfit text-3xl font-extrabold text-white">{totalQuizzes}</div>
                <p className="text-[10px] text-gray-500 font-medium">Custom battle sets built</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Sessions Hosted Card -> Opens Sessions Hosted History Modal */}
            <div 
              onClick={() => setActiveModal('sessions')}
              className="glass-panel rounded-2xl p-5 text-left flex justify-between items-start relative overflow-hidden group border border-white/5 hover:border-secondary/40 hover:scale-[1.02] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-secondary transition-colors">Sessions Hosted</span>
                <div className="font-outfit text-3xl font-extrabold text-white">{totalGamesHosted}</div>
                <p className="text-[10px] text-gray-500 font-medium">Real-time games executed</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-secondary/10 group-hover:border-secondary/30 transition-all">
                <Play className="h-5 w-5 text-secondary" />
              </div>
            </div>

            {/* Total Students Card -> Opens Total Students Roster Modal */}
            <div 
              onClick={() => setActiveModal('students')}
              className="glass-panel rounded-2xl p-5 text-left flex justify-between items-start relative overflow-hidden group border border-white/5 hover:border-accent/40 hover:scale-[1.02] transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-accent transition-colors">Total Students</span>
                <div className="font-outfit text-3xl font-extrabold text-white">{totalStudents}</div>
                <p className="text-[10px] text-gray-500 font-medium">Active players connected</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
                <Users className="h-5 w-5 text-accent" />
              </div>
            </div>
          </div>

          {/* CREATE GAME & JOIN GAME CARDS */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            <Link
              to="/quiz/create"
              className="glass-panel rounded-2xl p-6 text-left flex flex-col gap-3 group border border-white/5 hover:border-primary/30 transition-all relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <PlusCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-white group-hover:text-primary transition-colors">Create Game</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Build a custom quiz and host a live multiplayer battle session for your players.
              </p>
            </Link>
            <Link
              to="/join"
              className="glass-panel rounded-2xl p-6 text-left flex flex-col gap-3 group border border-white/5 hover:border-secondary/30 transition-all relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20">
                <Play className="h-6 w-6 text-secondary fill-current" />
              </div>
              <h3 className="font-outfit text-lg font-bold text-white group-hover:text-secondary transition-colors">Join Game</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Enter a game code and jump into an active quiz session hosted by another moderator.
              </p>
            </Link>
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
                    You haven't created any quizzes yet. Create your first multiplayer challenge!
                  </p>
                  <Link to="/quiz/create" className="inline-flex btn-premium btn-primary-gradient px-4 py-2.5 text-xs font-bold">
                    Create Quiz
                  </Link>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {quizzesData?.quizzes?.slice(0, 4).map((quiz) => (
                    <div key={quiz._id} className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[220px] group border border-white/5 hover:border-primary/30 transition-all relative">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {quiz.category || 'General'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-semibold">{quiz.questions?.length || 0} Questions</span>
                        </div>
                        <h4 className="font-bold text-white mt-4 text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h4>
                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{quiz.description || 'No description provided.'}</p>
                      </div>

                      <div className="flex flex-col gap-2.5 mt-5 pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleHostGame(quiz._id)}
                          className="flex-1 btn-premium btn-primary-gradient py-2.5 px-3 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-premium-glow"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Launch Lobby</span>
                        </button>
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

            </div>

          </div>

        </div>

        {/* SESSIONS HOSTED MODAL */}
        {activeModal === 'sessions' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-extrabold text-white text-lg">Hosted Sessions History</h3>
                    <p className="text-xs text-gray-400">Total games executed: {totalGamesHosted}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {hostedSessions.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <Clock className="h-10 w-10 text-gray-600 mx-auto" />
                    <p className="text-sm font-semibold text-gray-300">No hosted sessions found yet.</p>
                    <p className="text-xs text-gray-500">Launch a battle lobby to start hosting quiz sessions!</p>
                  </div>
                ) : (
                  hostedSessions.map((session, idx) => (
                    <div 
                      key={session._id || session.id || idx}
                      className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/5 hover:border-secondary/30 transition-all"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-base">{session.quizTitle || session.quiz?.title || 'Quiz Session'}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            {new Date(session.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-secondary font-semibold">
                            <Users className="h-3.5 w-3.5" />
                            {session.players?.length || 0} Players
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveModal(null);
                          navigate(`/results/${session._id || session.id}`);
                        }}
                        className="btn-premium bg-secondary text-white hover:bg-secondary/80 px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 whitespace-nowrap self-end sm:self-center shadow-md"
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>View Analytics</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TOTAL STUDENTS MODAL */}
        {activeModal === 'students' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#121216] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-xl text-accent">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-extrabold text-white text-lg">Student Engagement Roster</h3>
                    <p className="text-xs text-gray-400">Unique connected students: {studentList.length}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-3">
                {studentList.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <UserCheck className="h-10 w-10 text-gray-600 mx-auto" />
                    <p className="text-sm font-semibold text-gray-300">No student records found yet.</p>
                    <p className="text-xs text-gray-500">Host a quiz session and let students join via game pin!</p>
                  </div>
                ) : (
                  studentList.map((st, idx) => (
                    <div 
                      key={idx}
                      className="glass-panel p-3.5 rounded-xl flex items-center justify-between gap-3 border border-white/5 hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                          idx === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                          idx === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/40' :
                          idx === 2 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40' :
                          'bg-white/5 text-gray-400 border border-white/10'
                        }`}>
                          {idx === 0 ? <Trophy className="h-4 w-4 text-yellow-400" /> : `#${idx + 1}`}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                            <span>{st.name}</span>
                            {idx === 0 && <span className="text-[9px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-extrabold uppercase">Top Student</span>}
                          </h4>
                          <span className="text-[10px] text-gray-400">Participated in {st.sessionsCount} session{st.sessionsCount > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-accent text-sm">{st.totalScore} pts</div>
                        <span className="text-[9px] text-gray-500">Cumulative Score</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AnimatedPage>
  );
}