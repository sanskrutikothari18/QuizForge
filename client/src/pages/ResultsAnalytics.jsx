import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart3, ArrowLeft, Loader2, Download, Trophy, 
  Users, CheckCircle, Percent, Calendar, FileSpreadsheet, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedPage from '../components/AnimatedPage';
import { getResultBySession } from '../services/resultService';

const isUnansweredAnswer = (answer) => {
  const value = answer?.answerIndex;
  return value === null || value === undefined || value === '' || value === -1 || Number.isNaN(Number(value));
};

const getSubmittedAnswers = (answers = []) => (answers || []).filter((answer) => !isUnansweredAnswer(answer));

export default function ResultsAnalytics() {
  const { sessionId } = useParams();
  const id = sessionId;
  const navigate = useNavigate();

  // Fetch Session Results
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['result-details', id],
    queryFn: () => getResultBySession(id),
    refetchOnWindowFocus: false,
  });

  const result = data?.result;
  const players = result?.players || [];
  const { themeMode, toggleThemeMode } = useTheme();
  const isDark = themeMode !== 'light';
  const playerSummaries = players.map((player) => {
    const submittedAnswers = getSubmittedAnswers(player.answers || []);
    const correct = submittedAnswers.filter((answer) => answer.isCorrect).length;
    const wrong = submittedAnswers.filter((answer) => !answer.isCorrect).length;
    const unanswered = Math.max(0, (result?.totalQuestions || 0) - submittedAnswers.length);
    const percentage = result?.totalQuestions ? Math.round((correct / result.totalQuestions) * 100) : 0;

    return {
      ...player,
      correct,
      wrong,
      unanswered,
      percentage,
      totalScore: player.totalScore || 0,
    };
  });

  // Calculate Metrics
  const totalPlayers = playerSummaries.length;
  const winnerName = result?.winner || 'No winner registered';
  const totalQuestions = result?.totalQuestions || 0;
  const avgCorrect = totalPlayers
    ? Math.round((playerSummaries.reduce((sum, p) => sum + (p.correct || 0), 0) / totalPlayers) * 10) / 10
    : 0;

  const accuracy = totalPlayers && totalQuestions
    ? Math.round((playerSummaries.reduce((sum, p) => sum + (p.correct || 0), 0) / (totalPlayers * totalQuestions)) * 100)
    : 0;

  const completionPercentage = totalQuestions ? Math.round(((totalQuestions - playerSummaries.reduce((sum, player) => sum + player.unanswered, 0)) / totalQuestions) * 100) : 0;

  // Calculate fastest solver / highlights for each question
  const questionHighlights = [];
  for (let qIdx = 0; qIdx < totalQuestions; qIdx++) {
    let fastestPlayer = null;
    let minTime = Infinity;
    
    playerSummaries.forEach((p) => {
      const ans = p.answers?.find(a => a.questionIndex === qIdx);
      if (ans && ans.isCorrect) {
        if (ans.timeTaken < minTime) {
          minTime = ans.timeTaken;
          fastestPlayer = {
            name: p.name,
            timeTaken: (ans.timeTaken / 1000).toFixed(2)
          };
        }
      }
    });
    
    questionHighlights.push({
      questionNumber: qIdx + 1,
      fastestPlayer: fastestPlayer
    });
  }

  // Export Standings to CSV file
  const handleExportCSV = () => {
      if (playerSummaries.length === 0) {
      toast.error('No player data to export');
      return;
    }

    try {
      const escapeCSV = (val) => {
        if (val === undefined || val === null) return '';
        let str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const lines = [];
      
      // Metadata Header Block
      lines.push('=== FOURISE QUIZ HUB REPORT ===');
      lines.push(`Quiz Title,${escapeCSV(result.quizTitle || 'Fourise Quiz Hub Match')}`);
      lines.push(`Played At,${escapeCSV(result.playedAt ? new Date(result.playedAt).toLocaleString() : new Date().toLocaleString())}`);
      lines.push(`Session ID,${escapeCSV(id)}`);
      lines.push(`Total Questions,${escapeCSV(totalQuestions)}`);
      lines.push(`Total Challengers,${escapeCSV(totalPlayers)}`);
      lines.push(`Lobby Accuracy,${escapeCSV(accuracy + '%')}`);
      lines.push(`Winner Crown,${escapeCSV(winnerName)}`);
      lines.push(`Average Correct,${escapeCSV(`${avgCorrect} / ${totalQuestions}`)}`);
      lines.push(''); // blank line divider
      
      // Standings Header
      lines.push('=== PLAYER STANDINGS ===');
      lines.push(['Rank', 'Player Nickname', 'Correct Answers', 'Wrong Answers', 'Not Answered', 'Accuracy (%)', 'Total Score'].map(escapeCSV).join(','));
      
      // Standings Rows
      playerSummaries.forEach((p) => {
        const playerAccuracy = totalQuestions ? Math.round((p.correct / totalQuestions) * 100) + '%' : '0%';
        lines.push([
          p.rank,
          p.name,
          p.correct,
          p.wrong,
          p.unanswered,
          playerAccuracy,
          p.totalScore
        ].map(escapeCSV).join(','));
      });
      
      lines.push(''); // blank line divider
      
      // Highlights Header
      lines.push('=== QUESTION HIGHLIGHTS (FASTEST CORRECT SOLVERS) ===');
      lines.push(['Question', 'Fastest Solver', 'Time Taken'].map(escapeCSV).join(','));
      
      // Highlights Rows
      questionHighlights.forEach(hl => {
        lines.push([
          `Question ${hl.questionNumber}`,
          hl.fastestPlayer ? hl.fastestPlayer.name : 'No correct answers',
          hl.fastestPlayer ? `${hl.fastestPlayer.timeTaken}s` : 'N/A'
        ].map(escapeCSV).join(','));
      });

      // Prepare UTF-8 CSV blob to support Excel compatibility
      const csvString = lines.join('\n');
      const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Fourise_Quiz_Hub_Report_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully! 📊');
    } catch (err) {
      toast.error('Error generating CSV export');
    }
  };

  // ── PDF Export ────────────────────────────────────────────────────────────
  const handleExportPDF = () => {
    if (playerSummaries.length === 0) {
      toast.error('No player data to export');
      return;
    }

    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 14;

      // ── Brand Header (Simple) ────────────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.text('Fourise Quiz Hub', margin, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Battle Report', margin, 27);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(result.quizTitle || 'Quiz Match', margin, 35);

      const dateStr = result.playedAt
        ? new Date(result.playedAt).toLocaleString()
        : new Date().toLocaleString();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(dateStr, pageW - margin, 35, { align: 'right' });

      // Add a simple line separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(margin, 40, pageW - margin, 40);

      let cursorY = 50;

      // ── Summary Cards (Simple) ───────────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text('MATCH SUMMARY', margin, cursorY);
      cursorY += 8;

      const summaryItems = [
        ['Winner', winnerName],
        ['Total Players', String(totalPlayers)],
        ['Total Questions', String(totalQuestions)],
        ['Avg Correct', `${avgCorrect} / ${totalQuestions}`],
        ['Lobby Accuracy', `${accuracy}%`],
      ];

      const cardW = (pageW - margin * 2 - 12) / summaryItems.length;
      summaryItems.forEach(([label, val], i) => {
        const x = margin + i * (cardW + 3);
        
        // Simple border
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(x, cursorY, cardW, 18, 1, 1, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(30, 30, 30);
        const maxValWidth = cardW - 4;
        const valLines = doc.splitTextToSize(val, maxValWidth);
        doc.text(valLines[0], x + cardW / 2, cursorY + 8, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(label.toUpperCase(), x + cardW / 2, cursorY + 14, { align: 'center' });
      });
      cursorY += 28;

      // ── Player Rankings Table (Simple) ────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text('PLAYER RANKINGS', margin, cursorY);
      cursorY += 4;

      const rankMedals = ['1st', '2nd', '3rd'];
      autoTable(doc, {
        startY: cursorY,
        head: [['Rank', 'Player Nickname', 'Correct', 'Wrong', 'Not Answered', 'Final Score']],
        body: players.map(p => {
          const notAnswered = Math.max(0, totalQuestions - (p.correctAnswers || 0) - (p.wrongAnswers || 0));
          const medal = p.rank <= 3 ? rankMedals[p.rank - 1] : `#${p.rank}`;
          return [
            medal,
            p.name,
            String(p.correctAnswers || 0),
            String(p.wrongAnswers || 0),
            String(notAnswered),
            String(p.totalScore || 0),
          ];
        }),
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 4,
          textColor: [50, 50, 50],
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [40, 40, 40],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center', fontStyle: 'bold' },
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        rowPageBreak: 'auto',
        margin: { left: margin, right: margin },
      });
      cursorY = doc.lastAutoTable.finalY + 10;

      // ── Fastest Solvers (Simple) ─────────────────────────────────────────
      if (questionHighlights.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        doc.text('FASTEST CORRECT SOLVERS', margin, cursorY);
        cursorY += 4;

        autoTable(doc, {
          startY: cursorY,
          head: [['Question', 'Fastest Solver', 'Time Taken']],
          body: questionHighlights.map(hl => [
            `Q${hl.questionNumber}`,
            hl.fastestPlayer ? hl.fastestPlayer.name : '—',
            hl.fastestPlayer ? `${hl.fastestPlayer.timeTaken}s` : 'N/A',
          ]),
          theme: 'grid',
          styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 4,
            textColor: [50, 50, 50],
            lineColor: [220, 220, 220],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [240, 240, 240],
            textColor: [40, 40, 40],
            fontStyle: 'bold',
          },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          margin: { left: margin, right: margin },
        });
        cursorY = doc.lastAutoTable.finalY + 10;
      }

<<<<<<< HEAD
=======
      // ── Player Rankings Table (Simple) ────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      doc.text('PLAYER RANKINGS', margin, cursorY);
      cursorY += 4;

      const rankMedals = ['1st', '2nd', '3rd'];
      autoTable(doc, {
        startY: cursorY,
        head: [['Rank', 'Player Nickname', 'Correct', 'Wrong', 'Not Answered', 'Final Score']],
        body: playerSummaries.map((p) => {
          const notAnswered = p.unanswered;
          const medal = p.rank <= 3 ? rankMedals[p.rank - 1] : `#${p.rank}`;
          return [
            medal,
            p.name,
            String(p.correct || 0),
            String(p.wrong || 0),
            String(notAnswered),
            `${p.totalScore || 0} pts`,
          ];
        }),
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 4,
          textColor: [50, 50, 50],
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [40, 40, 40],
          fontStyle: 'bold',
        },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'right', fontStyle: 'bold' },
        },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        rowPageBreak: 'auto',
        margin: { left: margin, right: margin },
      });

>>>>>>> dd29739 (Update quiz app UI and controller fixes)
      // ── Footer (Simple) ──────────────────────────────────────────────────
      const totalPages = doc.internal.getNumberOfPages();
      for (let pg = 1; pg <= totalPages; pg++) {
        doc.setPage(pg);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        
        // Simple line above footer
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(margin, doc.internal.pageSize.getHeight() - 15, pageW - margin, doc.internal.pageSize.getHeight() - 15);
        
        doc.text(
          `Fourise Quiz Hub  •  Generated ${new Date().toLocaleString()}  •  Page ${pg} of ${totalPages}`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      }

      doc.save(`Fourise_Quiz_Hub_Report_${id}.pdf`);
      toast.success('PDF report downloaded! 📄');
    } catch (err) {
      console.error(err);
      toast.error('Error generating PDF report');
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className={`flex-1 flex items-center justify-center min-h-[70vh] ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
          <div className="text-center space-y-4">
            <Loader2 className={`h-10 w-10 animate-spin mx-auto ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Compiling analytics report...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error || !result) {
    return (
      <AnimatedPage>
        <div className={`flex-1 flex flex-col items-center justify-center min-h-[70vh] text-center px-4 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
          <BarChart3 className={`h-12 w-12 mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className="font-outfit text-xl font-bold">Report Not Found</h2>
          <p className={`text-sm mt-1 max-w-[280px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            The requested battle logs could not be loaded. Please return to the dashboard.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-premium btn-primary-gradient px-4 py-2.5 text-xs font-bold mt-5">
            Go to Dashboard
          </button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className={`relative min-h-screen p-6 sm:p-8 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%)]' : 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_35%)]'}`} />

        <div className="mx-auto max-w-7xl relative z-10 space-y-6 text-left">
          <div className={`rounded-[28px] border p-6 sm:p-8 shadow-xl ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/dashboard')} className={`rounded-xl p-2 transition ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}`} aria-label="Back">
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] ${isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
                    {result.quizTitle ? 'Performance Report' : 'Battle Report'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className={`font-outfit text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{result.quizTitle || 'Quiz Forge Match'}</h1>
                  <div className={`flex flex-wrap gap-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span className={`rounded-full px-3 py-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>Category: {result.quizCategory || result.quiz?.category || 'General'}</span>
                    <span className={`rounded-full px-3 py-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>Player: {winnerName}</span>
                    <span className={`rounded-full px-3 py-1 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>Date: {result.playedAt ? new Date(result.playedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={toggleThemeMode} className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  {isDark ? '☀ Light' : '🌙 Dark'}
                </button>
                <button onClick={handleExportCSV} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">
                  <FileText className="h-4 w-4" />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
              <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quiz Summary</p>
                    <h2 className={`mt-1 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance Snapshot</h2>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-sm font-semibold ${isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                    {accuracy}% accuracy
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Completion</span>
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{completionPercentage}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                      <div className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${completionPercentage}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className={`rounded-xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                      <p className={`text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Final Score</p>
                      <p className={`mt-1 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{playerSummaries[0]?.totalScore || 0} pts</p>
                    </div>
                    <div className={`rounded-xl border p-3 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                      <p className={`text-[10px] uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Rank</p>
                      <p className={`mt-1 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>#{playerSummaries[0]?.rank || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl border p-5 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quick Facts</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Quiz Date</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{result.playedAt ? new Date(result.playedAt).toLocaleDateString() : 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Quiz Time</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{result.playedAt ? new Date(result.playedAt).toLocaleTimeString() : 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Questions</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{totalQuestions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Players</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{totalPlayers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Correct Answers', value: `${avgCorrect} / ${totalQuestions}`, icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, accent: isDark ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700' },
              { label: 'Incorrect Answers', value: playerSummaries.reduce((sum, player) => sum + player.wrong, 0), icon: <XCircle className="h-5 w-5 text-rose-500" />, accent: isDark ? 'border-rose-500/20 bg-rose-500/10 text-rose-300' : 'border-rose-200 bg-rose-50 text-rose-700' },
              { label: 'Not Submitted', value: playerSummaries.reduce((sum, player) => sum + player.unanswered, 0), icon: <AlertCircle className="h-5 w-5 text-amber-500" />, accent: isDark ? 'border-amber-500/20 bg-amber-500/10 text-amber-300' : 'border-amber-200 bg-amber-50 text-amber-700' },
              { label: 'Average Score', value: `${Math.round(playerSummaries.reduce((sum, player) => sum + player.totalScore, 0) / Math.max(totalPlayers, 1))} pts`, icon: <Trophy className="h-5 w-5 text-blue-500" />, accent: isDark ? 'border-blue-500/20 bg-blue-500/10 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-700' },
            ].map((card, idx) => (
              <div key={idx} className={`rounded-2xl border p-5 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
                <div className="flex items-center justify-between">
                  <div className={`rounded-xl p-2 ${card.accent}`}>{card.icon}</div>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{card.label}</span>
                </div>
                <p className={`mt-5 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.value}</p>
              </div>
            ))}
          </div>

<<<<<<< HEAD
          {/* PLAYER STANDINGS DETAILED TABLE */}
          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
            
            <div className="p-6 border-b border-white/5 flex items-center gap-2">
              <FileSpreadsheet className="h-4.5 w-4.5 text-primary" />
              <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wider">Player Rankings</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                
                <thead>
                  <tr className="border-b border-white/5 text-gray-500 font-bold uppercase tracking-wider bg-white/2">
                    <th className="px-6 py-4 w-20">Rank</th>
                    <th className="px-6 py-4">Player Nickname</th>
                    <th className="px-6 py-4 text-center">Correct</th>
                    <th className="px-6 py-4 text-center">Wrong</th>
                    <th className="px-6 py-4 text-center">Not Answered</th>
                    <th className="px-6 py-4 text-right">Final Score</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5 font-semibold">
                  {players.map((player) => {
                    const notAnswered = Math.max(0, result?.totalQuestions - (player.correctAnswers || 0) - (player.wrongAnswers || 0));
                    return (
                      <tr
                        key={player.rank}
                        className="hover:bg-white/2 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-gray-400 font-bold">
                          {player.rank === 1 ? '🥇 #1' : player.rank === 2 ? '🥈 #2' : player.rank === 3 ? '🥉 #3' : `#${player.rank}`}
                        </td>
                        <td className="px-6 py-4 text-white font-bold">{player.name}</td>
                        <td className="px-6 py-4 text-center text-green-400">{player.correctAnswers}</td>
                        <td className="px-6 py-4 text-center text-accent">{player.wrongAnswers}</td>
                        <td className="px-6 py-4 text-center text-gray-500">{notAnswered}</td>
                        <td className="px-6 py-4 text-right font-outfit text-secondary font-black">{player.totalScore} pts</td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

            {players.length === 0 && (
              <div className="p-12 text-center text-gray-500 italic">No player records found.</div>
            )}
          </div>

          {/* QUESTION HIGHLIGHTS (FASTEST CORRECT SOLVERS) */}
          <div className="glass-panel rounded-3xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Trophy className="h-4.5 w-4.5 text-warning" />
              <h3 className="font-outfit text-sm font-bold text-white uppercase tracking-wider">Fastest Correct Solvers (First to Answer Correctly)</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {questionHighlights.map((hl, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Question {hl.questionNumber}</span>
                    <h4 className="font-bold text-white text-xs">
                      {hl.fastestPlayer ? hl.fastestPlayer.name : <span className="text-gray-500 italic">No correct answers</span>}
                    </h4>
                  </div>
                  {hl.fastestPlayer && (
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Time Taken</span>
                      <span className="text-xs font-mono font-bold text-secondary">{hl.fastestPlayer.timeTaken}s ⚡</span>
                    </div>
                  )}
=======
          <div className={`rounded-[28px] border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-sm font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Player Rankings</h3>
              </div>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Live score breakdown</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-[0.24em] ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                    <th className="px-3 py-3">Rank</th>
                    <th className="px-3 py-3">Player</th>
                    <th className="px-3 py-3 text-center">Correct</th>
                    <th className="px-3 py-3 text-center">Incorrect</th>
                    <th className="px-3 py-3 text-center">Not Submitted</th>
                    <th className="px-3 py-3 text-center">Score</th>
                    <th className="px-3 py-3 text-center">%</th>
                  </tr>
                </thead>
                <tbody>
                  {playerSummaries.map((player) => (
                    <tr key={player.rank} className={`border-b transition hover:opacity-90 ${isDark ? 'border-slate-800 hover:bg-slate-800/60' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <td className={`px-3 py-3 font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}</td>
                      <td className={`px-3 py-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{player.name}</td>
                      <td className={`px-3 py-3 text-center ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{player.correct}</td>
                      <td className={`px-3 py-3 text-center ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{player.wrong}</td>
                      <td className={`px-3 py-3 text-center ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{player.unanswered}</td>
                      <td className={`px-3 py-3 text-center font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{player.totalScore} pts</td>
                      <td className={`px-3 py-3 text-center font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{player.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`rounded-[28px] border p-6 shadow-sm ${isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'}`}>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className={`h-5 w-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <h3 className={`text-sm font-semibold uppercase tracking-[0.28em] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fastest Correct Solvers</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {questionHighlights.map((hl, idx) => (
                <div key={idx} className={`rounded-2xl border p-4 ${isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50'}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Question {hl.questionNumber}</p>
                  <p className={`mt-2 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{hl.fastestPlayer ? hl.fastestPlayer.name : 'No correct answers'}</p>
                  {hl.fastestPlayer && <p className={`mt-1 text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{hl.fastestPlayer.timeTaken}s</p>}
>>>>>>> dd29739 (Update quiz app UI and controller fixes)
                </div>
              ))}
            </div>
          </div>
<<<<<<< HEAD

=======
>>>>>>> dd29739 (Update quiz app UI and controller fixes)
        </div>
      </div>
    </AnimatedPage>
  );
}
