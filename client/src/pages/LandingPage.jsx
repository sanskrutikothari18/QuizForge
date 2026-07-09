import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Play, Sparkles, Award, Users, Zap, Shield, 
  ArrowRight, CheckCircle2, ChevronRight, MessageSquare, Star, Plus 
} from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

// Variants for fade-in lists and containers
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function LandingPage() {
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

        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8">
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
              className="font-outfit text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7.5xl"
            >
              Forge Epic Quizzes.<br />
              <span className="text-gradient-primary">Battle Real-Time.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-base text-gray-400 sm:text-lg lg:text-xl"
            >
              The premium multiplayer quiz platform designed for classrooms, corporate squads, and trivia champions. Engage players instantly.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mt-10 flex max-w-md flex-col justify-center gap-4 sm:flex-row"
            >
              <Link
                to="/login"
                className="btn-premium btn-primary-gradient px-8 py-4 flex items-center justify-center gap-2 group text-base font-bold shadow-premium-glow"
              >
                <span>Create Quiz</span>
                <Plus className="h-4.5 w-4.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/join"
                className="btn-premium btn-secondary-gradient px-8 py-4 flex items-center justify-center gap-2 text-base font-bold shadow-secondary-glow"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
                <span>Join Game</span>
              </Link>
            </motion.div>

          </div>

          {/* Interactive Floating Leaderboard Showcase Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 60, delay: 0.4 }}
            className="mx-auto mt-16 max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
              </div>
              <span className="text-xs text-gray-500 font-mono tracking-wider">LIVE SESSION: PIN 589 231</span>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            {/* Mock Dashboard Leaderboard */}
            <div className="grid gap-4 sm:grid-cols-3 text-left">
              {[
                { name: 'Alex Miller', score: '3,840 pts', color: 'border-yellow-500/20 bg-yellow-500/5', icon: '👑', place: '1st Place' },
                { name: 'Sophia Chen', score: '3,520 pts', color: 'border-slate-400/20 bg-slate-400/5', icon: '🥈', place: '2nd Place' },
                { name: 'Marcus Vance', score: '3,110 pts', color: 'border-amber-700/20 bg-amber-700/5', icon: '🥉', place: '3rd Place' },
              ].map((player, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-4.5 flex flex-col justify-between h-36 transform hover:scale-[1.02] transition-transform ${player.color}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl">{player.icon}</span>
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{player.place}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{player.name}</h4>
                    <p className="text-gradient-primary text-base font-bold mt-1">{player.score}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </section>

        {/* Feature Cards Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Engineered for <span className="text-gradient-primary">Elite Performance</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Enjoy zero lag trivia battles with optimized state query engines and lightning-fast websocket updates.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { 
                icon: <Zap className="h-6 w-6 text-primary" />, 
                title: 'Real-Time WebSockets', 
                desc: 'Instant updates on answer inputs, timers, and lobby counters. Powered by Socket.io engine.' 
              },
              { 
                icon: <Award className="h-6 w-6 text-secondary" />, 
                title: 'Dynamic Score Bonusing', 
                desc: 'Score extra points by submitting correct answers faster than other players.' 
              },
              { 
                icon: <Users className="h-6 w-6 text-accent" />, 
                title: 'Interactive Lobby PIN', 
                desc: 'Start games with a single PIN or auto-generated high resolution QR Code for quick scans.' 
              },
              { 
                icon: <Shield className="h-6 w-6 text-success" />, 
                title: 'Secure JWT Authentication', 
                desc: 'Keep quizzes secure. Complete login profiles, custom dashboards, and protected REST routes.' 
              },
              { 
                icon: <MessageSquare className="h-6 w-6 text-warning" />, 
                title: 'Rich Analytics Reports', 
                desc: 'Deep-dive charts and downloadable performance reports tracking accurate student analytics.' 
              },
              { 
                icon: <Sparkles className="h-6 w-6 text-purple-400" />, 
                title: 'Custom Categories', 
                desc: 'Create personalized quiz structures matching general knowledge, science, programming and more.' 
              },
            ].map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="glass-panel glass-panel-hover rounded-2xl p-6 text-left"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-y border-white/5 bg-[#0c0c0e]/30">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-4 text-center">
            {[
              { label: 'Total Quizzes Hosted', value: '45,892+' },
              { label: 'Active Battle Players', value: '1.2M+' },
              { label: 'Classrooms Connected', value: '12,500+' },
              { label: 'Response Accuracy', value: '94.2%' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 100, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="font-outfit text-3xl font-extrabold text-white md:text-4xl"
                >
                  {stat.value}
                </motion.span>
                <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Timeline */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Launch Your First Battle <span className="text-gradient-primary">in Seconds</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Simple 4-step workflow to get your players excited.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 relative">
            
            {/* Timeline connector line (desktop) */}
            <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

            {[
              { step: '01', title: 'Forge the Questions', desc: 'Use our streamlined custom quiz creator to builder multiple-choice answers, set question timers, and categories.' },
              { step: '02', title: 'Open Host Lobby', desc: 'Generate your instant lobby session. Launch a private room containing a large PIN and auto-generated QR code.' },
              { step: '03', title: 'Gather the Squad', desc: 'Players enter the PIN on their phones to join the lobby room. Watch as avatars pop up on the host screen.' },
              { step: '04', title: 'Ignite the Quiz', desc: 'Advance through questions, submit answers on speed sliders, and see who takes the podium victory trophy.' }
            ].map((timeline, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-4">
                
                {/* Step circle */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 relative z-10">
                  <span className="font-outfit text-lg font-bold text-gradient-primary">{timeline.step}</span>
                </div>
                
                <h3 className="text-md font-bold text-white mb-2">{timeline.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">{timeline.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Slider */}
        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Loved by <span className="text-gradient-primary">Champions</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              See how educators, coordinators, and gamers use <span className="font-bold">Fourise <span className="text-blue-500">Quiz Hub</span></span>.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                text: "My students look forward to Friday trivia matches. The speed bonus algorithm gets the classroom incredibly energetic and focused.",
                author: "Mrs. Sarah Jenkins",
                role: "High School Biology Teacher",
                rating: 5
              },
              {
                text: "We used Fourise Quiz Hub to run our virtual corporate trivia night. Zero lag, beautiful responsive UI, and the analytics reports were extremely helpful.",
                author: "David Vance",
                role: "HR Operations Lead",
                rating: 5
              },
              {
                text: "The glassmorphism design looks amazing on my stream! The animations are clean, fluid, and the gameplay updates instantly.",
                author: "Tyler 'Flex' Ross",
                role: "Twitch Trivia Host",
                rating: 5
              }
            ].map((review, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-6 text-left flex flex-col justify-between">
                <div>
                  <div className="flex gap-0.5 mb-4 text-warning">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic mb-6">"{review.text}"</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs">{review.author}</h4>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </AnimatedPage>
  );
}

// Simple Helper icon because Lucide Plus is standard, but keeping interface clean
function PlusIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
