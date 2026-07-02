import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, HelpCircle, Layout, ArrowLeft, 
  Settings, CheckCircle, Clock, Eye, AlertCircle, FileSpreadsheet, Play
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import AnimatedPage from '../components/AnimatedPage';
import { createQuiz } from '../services/quizService';
import { createGame } from '../services/gameService';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: 'general knowledge',
      questions: [
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          timeLimit: 20,
        }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchAllFields = watch();

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      reader.onload = (evt) => {
        try {
          const text = evt.target.result;
          const parsed = parseCSV(text);
          if (parsed.length > 0) {
            setValue('questions', parsed);
            toast.success(`Imported ${parsed.length} questions from CSV! 📊`);
          } else {
            toast.error('No valid questions found in CSV file.');
          }
        } catch (err) {
          toast.error('Failed to parse CSV file.');
        }
      };
      reader.readAsText(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const parsed = parseExcelRows(jsonData);
          if (parsed.length > 0) {
            setValue('questions', parsed);
            toast.success(`Imported ${parsed.length} questions from Excel sheet! 📊`);
          } else {
            toast.error('No valid questions found in Excel sheet.');
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to parse Excel file.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('Unsupported file format. Please upload CSV or Excel (.xlsx/.xls).');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const rows = lines.map(line => {
      const cols = [];
      let inQuotes = false;
      let col = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cols.push(col.trim());
          col = '';
        } else {
          col += char;
        }
      }
      cols.push(col.trim());
      return cols.map(c => c.replace(/^["']|["']$/g, '').trim());
    });
    return parseExcelRows(rows);
  };

  const parseExcelRows = (rows) => {
    if (rows.length === 0) return [];
    
    const firstCell = String(rows[0][0] || '').toLowerCase();
    const startIndex = (firstCell.includes('question') || firstCell.includes('title')) ? 1 : 0;
    
    const parsedQuestions = [];
    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      if (row && row.length >= 6) {
        const questionText = String(row[0] || '').trim();
        const options = [
          String(row[1] || '').trim(),
          String(row[2] || '').trim(),
          String(row[3] || '').trim(),
          String(row[4] || '').trim()
        ];
        
        let correctVal = Number(row[5]);
        if (isNaN(correctVal)) {
          const textVal = String(row[5] || '').toLowerCase().trim();
          const optionIndexMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
          correctVal = optionIndexMap[textVal] !== undefined ? optionIndexMap[textVal] : 0;
        } else {
          correctVal = (correctVal >= 1 && correctVal <= 4) ? correctVal - 1 : 0;
        }
        
        const timeLimit = Number(row[6] || 20);
        
        if (questionText && options.every(opt => opt !== '')) {
          parsedQuestions.push({
            questionText,
            options,
            correctAnswer: correctVal,
            timeLimit
          });
        }
      }
    }
    return parsedQuestions;
  };

  const onSubmit = async (data) => {
    // Basic verification
    if (data.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Convert correctAnswer values to numbers just in case
    const payload = {
      ...data,
      questions: data.questions.map(q => ({
        ...q,
        correctAnswer: Number(q.correctAnswer),
        timeLimit: Number(q.timeLimit)
      }))
    };

    try {
      const response = await createQuiz(payload);
      if (response.success) {
        toast.success('Quiz forged successfully! 🏆');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Failed to save quiz');
      }
    } catch (error) {
      console.error('[CREATE QUIZ ERROR]', error);
      toast.error(error.response?.data?.message || 'Error saving quiz');
    }
  };

  const onInvalid = (errors) => {
    console.warn('Form Validation Errors:', errors);
    if (errors.title) {
      toast.error(`Quiz details: ${errors.title.message || 'Quiz Title is required'}`);
      return;
    }
    if (errors.questions) {
      toast.error('Please complete all question title fields and option answers.');
      return;
    }
    toast.error('Please fill out all required fields.');
  };

  return (
    <AnimatedPage>
      <div className="relative min-h-screen bg-background text-gray-200 p-6 sm:p-8">
        
        {/* Glow Spheres */}
        <div className="absolute top-[-5%] left-[10%] h-[350px] w-[350px] bg-glow-primary pointer-events-none opacity-40"></div>
        <div className="absolute bottom-[10%] right-[5%] h-[400px] w-[400px] bg-glow-secondary pointer-events-none opacity-30"></div>

        <div className="mx-auto max-w-5xl relative z-10 space-y-6 text-left">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <h1 className="font-outfit text-3xl font-extrabold text-white">Forge a Quiz</h1>
                <p className="text-xs text-gray-400 mt-1">Design customized questions and timers.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="btn-premium btn-glass px-4 py-2.5 flex items-center gap-1.5 text-xs font-semibold"
              >
                <Eye className="h-4 w-4" />
                <span>{isPreviewMode ? 'Back to Editor' : 'Live Preview'}</span>
              </button>
              
              {!isPreviewMode && (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit(async (data) => {
                      const payload = {
                        ...data,
                        questions: data.questions.map(q => ({
                          ...q,
                          correctAnswer: Number(q.correctAnswer),
                          timeLimit: Number(q.timeLimit)
                        }))
                      };
                      toast.loading('Forging and initializing lobby...', { id: 'forge-host' });
                      try {
                        const response = await createQuiz(payload);
                        if (response.success) {
                          const gameRes = await createGame(response.quiz._id);
                          if (gameRes.success) {
                            toast.success('Lobby active! PIN initialized 🚀', { id: 'forge-host' });
                            navigate(`/host/lobby/${gameRes.game.pin}`);
                          } else {
                            toast.error(gameRes.message || 'Lobby initialization failed', { id: 'forge-host' });
                            navigate('/dashboard');
                          }
                        } else {
                          toast.error(response.message || 'Failed to save quiz', { id: 'forge-host' });
                        }
                      } catch (error) {
                        console.error('[CREATE & HOST ERROR]', error);
                        toast.error(error.response?.data?.message || 'Error saving/hosting quiz', { id: 'forge-host' });
                      }
                    }, onInvalid)}
                    className="btn-premium btn-secondary-gradient px-5 py-2.5 flex items-center gap-1.5 text-xs font-bold shadow-secondary-glow cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Forge & Host Live</span>
                  </button>

                  <button
                    onClick={handleSubmit(onSubmit, onInvalid)}
                    className="btn-premium btn-glass px-5 py-2.5 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    <span>Forge Quiz</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {isPreviewMode ? (
            /* PREVIEW LAYOUT */
            <div className="space-y-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/5">
                <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {watchAllFields.category}
                </span>
                <h2 className="font-outfit text-2xl font-extrabold text-white mt-3">{watchAllFields.title || 'Untitled Quiz'}</h2>
                <p className="text-sm text-gray-400 mt-1.5">{watchAllFields.description || 'No description provided.'}</p>
              </div>

              <div className="space-y-4">
                {watchAllFields.questions.map((q, idx) => (
                  <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 border-b border-white/5 pb-3">
                      <span>QUESTION {idx + 1} OF {watchAllFields.questions.length}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {q.timeLimit} Seconds</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">{q.questionText || 'Enter question text...'}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {q.options.map((opt, optIdx) => (
                        <div 
                          key={optIdx} 
                          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
                            Number(q.correctAnswer) === optIdx 
                              ? 'bg-green-500/10 border-green-500/30 text-green-400 font-semibold' 
                              : 'bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          <span>{opt || `Option ${optIdx + 1}`}</span>
                          {Number(q.correctAnswer) === optIdx && <CheckCircle className="h-4 w-4" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* EDITOR LAYOUT */
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
              
              {/* QUIZ INFORMATION METADATA */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                <h3 className="font-outfit text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Settings className="h-4.5 w-4.5 text-primary" />
                  Quiz Details
                </h3>

                <div className="grid gap-6 sm:grid-cols-3">
                  
                  {/* Title */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Science Bowl Finals"
                      {...register('title', { required: 'Quiz title is required' })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                    {errors.title && (
                      <span className="flex items-center gap-1.5 text-xs text-accent mt-1">
                        <AlertCircle className="h-3.5 w-3.5" /> {errors.title.message}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Category
                    </label>
                    <select
                      {...register('category')}
                      className="w-full rounded-xl bg-[#111115] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="general knowledge">General Knowledge</option>
                      <option value="science">Science</option>
                      <option value="programming">Programming</option>
                      <option value="geography">Geography</option>
                      <option value="history">History</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-3 space-y-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Give users an overview of the battle topics..."
                      {...register('description')}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>

                </div>
              </div>

              {/* QUESTIONS BUILDER LIST */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <h3 className="font-outfit text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-secondary" />
                    Questions List ({fields.length})
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    {/* Hidden File Input for Excel/CSV */}
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      id="excel-file-upload"
                      onChange={handleExcelUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="excel-file-upload"
                      className="btn-premium btn-glass px-4 py-2 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-green-400" />
                      <span>Upload Excel/CSV</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => append({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, timeLimit: 20 })}
                      className="btn-premium btn-secondary-gradient px-4 py-2 flex items-center gap-1.5 text-xs font-bold shadow-secondary-glow"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>
                </div>

                {/* Spreadsheet Formatting Tip Info Box */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 space-y-1.5">
                  <span className="font-bold text-gray-300 uppercase tracking-wider text-[10px] block">Excel/CSV Format Guidelines:</span>
                  <p>
                    Columns must follow: <code className="text-secondary bg-white/5 px-1.5 py-0.5 rounded font-mono">Question Text, Option 1, Option 2, Option 3, Option 4, Correct Option Index (1-4), Time Limit in Seconds</code>.
                  </p>
                  <p className="text-[10px] text-gray-500">
                    *Tip: Row headers (e.g. "Question Text", "Option 1") will be skipped automatically if present in the first row.
                  </p>
                </div>

                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 14 }}
                        className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/5 relative overflow-hidden"
                      >
                        {/* Header bar */}
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-xs font-bold text-gray-400">QUESTION {index + 1}</span>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="p-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>

                        {/* Question Text */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Question Title / Text
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. What is the output of 2 + 2 in JavaScript?"
                            {...register(`questions.${index}.questionText`, { required: 'Question text is required' })}
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1"
                          />
                        </div>

                        {/* Options Input and Correct Selection */}
                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                            Answers Options (Select the correct radio circle)
                          </label>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {[0, 1, 2, 3].map((optIdx) => {
                              const isSelected = Number(watchAllFields.questions?.[index]?.correctAnswer) === optIdx;
                              return (
                                <div 
                                  key={optIdx} 
                                  className={`border rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all ${
                                    isSelected
                                      ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                                      : 'border-white/10 bg-white/5 hover:border-white/20 focus-within:border-primary/50'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    value={optIdx}
                                    {...register(`questions.${index}.correctAnswer`)}
                                    className="h-4.5 w-4.5 border-white/10 bg-white/5 text-primary focus:ring-primary/30"
                                  />
                                  <input
                                    type="text"
                                    placeholder={`Option ${optIdx + 1}`}
                                    {...register(`questions.${index}.options.${optIdx}`, { required: 'This option is required' })}
                                    className="flex-1 bg-transparent border-none p-0 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Duration Slider */}
                        <div className="space-y-3 border-t border-white/5 pt-5">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <span>Question Timer Limit</span>
                            <span className="text-secondary font-mono tracking-normal">{watch(`questions.${index}.timeLimit`) || 20} Seconds</span>
                          </div>
                          <div className="flex gap-4 items-center">
                            <input
                              type="range"
                              min="5"
                              max="120"
                              step="5"
                              {...register(`questions.${index}.timeLimit`)}
                              className="flex-1 accent-secondary bg-white/5 rounded-full h-1.5 cursor-pointer"
                            />
                            <div className="flex h-9 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 font-bold text-xs">
                              {watch(`questions.${index}.timeLimit`)}s
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Add Question Floating CTA */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => append({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, timeLimit: 20 })}
                  className="btn-premium btn-secondary-gradient px-6 py-3.5 flex items-center gap-2 text-xs font-bold shadow-secondary-glow"
                >
                  <Plus className="h-4.5 w-4.5" />
                  <span>Add Another Question</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </AnimatedPage>
  );
}
