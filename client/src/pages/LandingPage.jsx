import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Play, Sparkles, Plus, Radio, KeyRound, Trophy, Zap, ShieldCheck, Smartphone,
  LogIn, Gamepad2, Clock, Timer, CheckCircle, ListOrdered, Star, Quote,
  FileDown, QrCode,
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

const features = [
  { title: 'Real-time Multiplayer Quiz', icon: <Radio className="h-5 w-5 text-primary" />, desc: 'Battle live with players in synchronized real-time quiz sessions.' },
  { title: 'Create & Host Custom Quizzes', icon: <Plus className="h-5 w-5 text-secondary" />, desc: 'Design your own questions and host engaging quiz games instantly.' },
  { title: 'Join with Game Code', icon: <KeyRound className="h-5 w-5 text-accent" />, desc: 'Quickly enter a PIN and join any active game in seconds.' },
  { title: 'Live Leaderboard', icon: <Trophy className="h-5 w-5 text-primary" />, desc: 'Track rankings in real-time as players answer each question.' },
  { title: 'Instant Results', icon: <Zap className="h-5 w-5 text-secondary" />, desc: 'Get immediate feedback and final scores the moment a game ends.' },
  { title: 'Secure Authentication', icon: <ShieldCheck className="h-5 w-5 text-accent" />, desc: 'Protected user accounts with JWT-based login and password recovery.' },
  { title: 'Responsive Design', icon: <Smartphone className="h-5 w-5 text-primary" />, desc: 'Enjoy a seamless experience across desktop, tablet, and mobile devices.' },
  { title: 'Export Results & Analytics', icon: <FileDown className="h-5 w-5 text-secondary" />, desc: 'Download detailed game reports and player analytics as PDF or Excel.' },
  { title: 'QR Code Game Join', icon: <QrCode className="h-5 w-5 text-accent" />, desc: 'Scan a QR code to instantly join any live quiz session without typing a PIN.' },
];

const howItWorks = [
  { step: 1, title: 'Sign Up / Login', icon: <LogIn className="h-5 w-5 text-primary" />, desc: 'Create your account or log in to access the quiz dashboard.' },
  { step: 2, title: 'Create or Join a Quiz', icon: <Gamepad2 className="h-5 w-5 text-secondary" />, desc: 'Host a new quiz game or join an existing one with a game code.' },
  { step: 3, title: 'Wait for the Host to Start', icon: <Clock className="h-5 w-5 text-accent" />, desc: 'Relax in the waiting room until the host launches the session.' },
  { step: 4, title: 'Answer Questions Before Time Runs Out', icon: <Timer className="h-5 w-5 text-primary" />, desc: 'Think fast and select the correct answer before the timer expires.' },
  { step: 5, title: 'View the Live Leaderboard', icon: <ListOrdered className="h-5 w-5 text-secondary" />, desc: 'See where you rank against other players after every question.' },
  { step: 6, title: 'Check Final Results & Performance', icon: <CheckCircle className="h-5 w-5 text-accent" />, desc: 'Review your final score and detailed performance at the end.' },
];

const reviews = [
  {
    name: 'Aarav Sharma',
    role: 'Educator',
    rating: 5,
    text: 'QuizForge transformed my classroom sessions. The real-time multiplayer mode keeps every student engaged and excited to participate.',
  },
  {
    name: 'Priya Patel',
    role: 'Corporate Trainer',
    rating: 5,
    text: 'I use QuizForge for team-building trivia nights. The live leaderboard adds a competitive spark that everyone loves.',
  },
  {
    name: 'Rohan Mehta',
    role: 'Student',
    rating: 4,
    text: 'Joining a game with a code is super quick. The instant results and leaderboard make every quiz feel like a real competition.',
  },
  {
    name: 'Sneha Reddy',
    role: 'Quiz Host',
    rating: 5,
    text: 'Creating custom quizzes is effortless. The interface is clean, responsive, and the animations make it feel premium.',
  },
  {
    name: 'Karan Verma',
    role: 'Event Organizer',
    rating: 5,
    text: 'We hosted a 200-player trivia event and QuizForge handled it flawlessly. Secure auth and smooth gameplay throughout.',
  },
  {
    name: 'Ananya Iyer',
    role: 'Teacher',
    rating: 4,
    text: 'The waiting room and host controls are intuitive. My students ask for quiz battles every week now!',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden bg-background">

        {/* Glow Spheres */}
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-glow-primary pointer-events-none opacity-60"></div>
        <div className="absolute bottom-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-glow-secondary pointer-events-none opacity-50"></div>

        {/* Ambient floating geometry particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 360]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[15%] h-12 w-12 border border-primary/20 rounded-xl"
          />
          <motion.div
            animate={{
              y: [0, 40, 0],
              x: [0, -20, 0],
              rotate: [360, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[30%] left-[10%] h-16 w-16 border border-secondary/20 rounded-full"
          />
          <motion.div
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[50%] left-[45%] h-3 w-3 bg-accent rounded-full blur-[2px]"
          />
        </div>

        {/* Hero Section ONLY */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 sm:pt-20 sm:pb-12 lg:px-8">
          <div className="text-center">

            {/* Promo Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/15 transition-all mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Version 2.0 Live Battle Engine</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Create Epic Quizzes.<br />
              <span className="text-gradient-primary">Battle Real-Time.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base text-gray-400 sm:text-lg px-2 sm:px-0"
            >
              The premium multiplayer quiz platform designed for classrooms, corporate squads, and trivia champions. Engage players instantly.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            >
              <Link
                to="/login"
                className="btn-premium btn-primary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 group text-sm sm:text-base font-bold shadow-premium-glow w-full sm:w-auto"
              >
                <span>Create Quiz</span>
                <Plus className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/join"
                className="btn-premium btn-secondary-gradient px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-secondary-glow w-full sm:w-auto"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Join Game</span>
              </Link>
            </motion.div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="font-outfit text-2xl sm:text-4xl font-extrabold text-white">Features</h2>
            <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
              Everything you need to build, host, and battle through engaging live quizzes.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-5 flex flex-col gap-3 border border-white/5 hover:border-primary/20 transition-all text-left"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {feature.icon}
                </div>
                <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="font-outfit text-2xl sm:text-4xl font-extrabold text-white">How It Works</h2>
            <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
              From sign-up to final results — get battle-ready in six simple steps.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-5 flex flex-col gap-3 border border-white/5 hover:border-primary/20 transition-all relative text-left"
              >
                <div className="absolute top-4 right-4 font-outfit text-3xl font-extrabold text-white/5">
                  {item.step}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {item.icon}
                </div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* REVIEWS / TESTIMONIALS SECTION */}
        <section id="testimonials" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="font-outfit text-2xl sm:text-4xl font-extrabold text-white">Reviews</h2>
            <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
              See what our community says about QuizForge.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-primary/20 transition-all relative text-left"
              >
                <Quote className="absolute top-5 right-5 h-8 w-8 text-white/5" />

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-extrabold text-sm text-white">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{review.name}</h4>
                    <span className="text-[10px] font-semibold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{review.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                    />
                  ))}
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{review.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </AnimatedPage>
  );
}