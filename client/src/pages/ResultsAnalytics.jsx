import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  // Calculate Metrics
  const totalPlayers = players.length;
  const winnerName = result?.winner || 'No winner registered';
  
  const avgCorrect = totalPlayers 
    ? Math.round((players.reduce((sum, p) => sum + (p.correctAnswers || 0), 0) / totalPlayers) * 10) / 10
    : 0;

  const totalQuestions = players[0]?.answers?.length || 0;
  const accuracy = totalPlayers && totalQuestions
    ? Math.round((players.reduce((sum, p) => sum + (p.correctAnswers || 0), 0) / (totalPlayers * totalQuestions)) * 100)
    : 0;

  // Calculate fastest solver / highlights for each question
  const questionHighlights = [];
  for (let qIdx = 0; qIdx < totalQuestions; qIdx++) {
    let fastestPlayer = null;
    let minTime = Infinity;
    
    players.forEach(p => {
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
    if (players.length === 0) {
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
      players.forEach(p => {
        const playerNotAnswered = Math.max(0, totalQuestions - (p.correctAnswers || 0) - (p.wrongAnswers || 0));
        const playerAccuracy = totalQuestions ? Math.round((p.correctAnswers / totalQuestions) * 100) + '%' : '0%';
        lines.push([
          p.rank,
          p.name,
          p.correctAnswers,
          p.wrongAnswers,
          playerNotAnswered,
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
    if (players.length === 0) {
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
        <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-xs text-gray-400">Compiling analytics report...</p>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error || !result) {
    return (
      <AnimatedPage>
        <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-background text-center px-4">
          <BarChart3 className="h-12 w-12 text-accent mb-4" />
          <h2 className="font-outfit text-xl font-bold text-white">Report Not Found</h2>
          <p className="text-sm text-gray-400 mt-1 max-w-[280px]">
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
      <div className="relative min-h-screen bg-background text-gray-200 p-6 sm:p-8">
        
        {/* Glow Spheres */}
        <div className="absolute top-[-5%] left-[10%] h-[350px] w-[350px] bg-glow-primary pointer-events-none opacity-40"></div>
        <div className="absolute bottom-[10%] right-[5%] h-[400px] w-[400px] bg-glow-secondary pointer-events-none opacity-30"></div>

        <div className="mx-auto max-w-6xl relative z-10 space-y-6 text-left">
          
          {/* Header Actions */}
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
                <h1 className="font-outfit text-3xl font-extrabold text-white">Battle Report</h1>
                <p className="text-xs text-gray-400 mt-1">{result.quizTitle || 'Quiz Forge Match'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="btn-premium btn-secondary-gradient px-5 py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-secondary-glow"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="btn-premium px-5 py-2.5 flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-red-600 to-rose-500 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                <FileText className="h-4 w-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS GRID */}
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { label: 'Winner Crown', value: winnerName, icon: <Trophy className="h-5 w-5 text-warning" />, desc: 'Highest overall points' },
              { label: 'Connected Players', value: totalPlayers, icon: <Users className="h-5 w-5 text-primary" />, desc: 'Active players joined' },
              { label: 'Avg Correct Answers', value: `${avgCorrect} / ${totalQuestions}`, icon: <CheckCircle className="h-5 w-5 text-secondary" />, desc: 'Mean correct responses' },
              { label: 'Lobby Accuracy', value: `${accuracy}%`, icon: <Percent className="h-5 w-5 text-accent" />, desc: 'Total success percentage' },
            ].map((card, idx) => (
              <div key={idx} className="glass-panel rounded-2xl p-5 flex justify-between items-start border border-white/5">
                <div className="space-y-3 min-w-0">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{card.label}</span>
                  <div className="font-outfit text-xl sm:text-2xl font-black text-white truncate">{card.value}</div>
                  <p className="text-[10px] text-gray-400">{card.desc}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
              </div>
            ))}
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
                </div>
              ))}
            </div>
          </div>

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

        </div>
      </div>
    </AnimatedPage>
  );
}
