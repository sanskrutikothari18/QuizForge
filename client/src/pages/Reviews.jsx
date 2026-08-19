import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Quote, MessageSquare } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

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

export default function Reviews() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="relative min-h-screen bg-background text-gray-200 p-4 sm:p-6 md:p-8 overflow-x-hidden">
        
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
                <h1 className="font-outfit text-3xl font-extrabold text-white">Reviews</h1>
                <p className="text-xs text-gray-400 mt-1">See what our community says about QuizForge.</p>
              </div>
            </div>
          </div>

          {/* REVIEWS GRID */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5 hover:border-primary/20 transition-all relative"
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

          {/* EMPTY STATE FALLBACK */}
          {reviews.length === 0 && (
            <div className="glass-panel rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto">
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto" />
              <h3 className="font-outfit text-xl font-bold text-white">No Reviews Yet</h3>
              <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-relaxed">
                Be the first to share your experience with QuizForge!
              </p>
              <Link to="/dashboard" className="inline-flex btn-premium btn-primary-gradient px-4 py-2.5 text-xs font-bold">
                Back to Dashboard
              </Link>
            </div>
          )}

        </div>
      </div>
    </AnimatedPage>
  );
}