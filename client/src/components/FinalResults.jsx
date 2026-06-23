import React from 'react';
import { motion } from 'framer-motion';
import './final-results.css';

function gradeFromPercent(pct) {
  if (pct >= 90) return { label: 'Legendary', color: '#f59e0b' };
  if (pct >= 75) return { label: 'Excellent', color: '#60a5fa' };
  if (pct >= 60) return { label: 'Great Job', color: '#34d399' };
  if (pct >= 40) return { label: 'Good Effort', color: '#f97316' };
  return { label: 'Keep Trying', color: '#ef4444' };
}

export default function FinalResults({ finalRanking = [], username = '', totalQuestions = 0 }) {
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;
  const height = typeof window !== 'undefined' ? window.innerHeight : 600;

  // Find player entry
  const me = finalRanking.find((p) => p.username === username) || finalRanking[0] || { score: 0, rank: 0 };
  const maxScore = (totalQuestions || 1) * 10;
  const pct = Math.round(((me.score || 0) / maxScore) * 100);
  const grade = gradeFromPercent(pct);

  return (
    <div className="final-screen">
      <motion.div className="final-container" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 90 }}>
        <div className="final-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <div className="trophy">🏆</div>
            </motion.div>
            <h2>Quiz Completed! 🎉</h2>
          </div>
          <div className="grade-badge" style={{ borderColor: grade.color }}>
            <strong style={{ color: grade.color }}>{grade.label}</strong>
            <small>{pct}% accuracy</small>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card big">
            <div className="stat-value">#{me.rank || '—'}</div>
            <div className="stat-label">Final Rank</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{me.score}</div>
            <div className="stat-label">Total Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pct}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{me.correctAnswers || 0}/{totalQuestions}</div>
            <div className="stat-label">Correct Answers</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{me.fastestResponse == null ? '—' : `${me.fastestResponse}s`}</div>
            <div className="stat-label">Fastest Response</div>
          </div>
        </div>

        <div className="leaderboard-final">
          <h3>Final Leaderboard</h3>
          <div className="leaderboard-list">
            {finalRanking.map((p) => (
              <motion.div key={p.username} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }} className={`leaderboard-item ${p.username === username ? 'me' : ''}`}>
                <div className="rank">{p.rank}</div>
                <div className="meta">
                  <div className="name">{p.username}</div>
                  <div className="score">{p.score} pts</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="confetti-root">
        {[...Array(24)].map((_, i) => (
          <span key={i} className={`confetti confetti-${i % 6}`} />
        ))}
      </div>
    </div>
  );
}
