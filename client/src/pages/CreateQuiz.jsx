import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Save, HelpCircle, Layout, ArrowLeft, 
  Settings, CheckCircle, Clock, Eye, AlertCircle, FileSpreadsheet, Play,
  Image, Upload, X, ChevronDown, ChevronUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import AnimatedPage from '../components/AnimatedPage';
import { createQuiz } from '../services/quizService';
import { createGame } from '../services/gameService';

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Advanced customization states
  const [bgImage, setBgImage] = useState('');
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [gradientOverlay, setGradientOverlay] = useState('none');
  const [gradientColor1, setGradientColor1] = useState('#7c3aed');
  const [gradientColor2, setGradientColor2] = useState('#06b6d4');
  const [position, setPosition] = useState('center');
  const [fit, setFit] = useState('cover');
  const [darkOverlay, setDarkOverlay] = useState(true);
  const [activeBgTab, setActiveBgTab] = useState('gallery'); // 'upload' | 'gallery' | 'ai'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [searchQuery, setSearchQuery] = useState('');
  const [bgCategory, setBgCategory] = useState('Education');
  const [showBgPicker, setShowBgPicker] = useState(true); // default open
  const [dragActive, setDragActive] = useState(false);

  // 12-category rich background presets
  const BG_PRESETS = {
    Education: [
      { id: 'edu1', url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=60', label: 'Blackboard' },
      { id: 'edu2', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=60', label: 'Library Books' },
      { id: 'edu3', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60', label: 'Stack of Books' },
      { id: 'edu4', url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60', label: 'Class Study' },
      { id: 'edu5', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60', label: 'Digital Learning' },
      { id: 'edu6', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60', label: 'Study Desk' }
    ],
    Space: [
      { id: 'sp1', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60', label: 'Deep Cosmos' },
      { id: 'sp2', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&auto=format&fit=crop&q=60', label: 'Starry Sky' },
      { id: 'sp3', url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&auto=format&fit=crop&q=60', label: 'Nebula Space' },
      { id: 'sp4', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=60', label: 'Orion Nebula' },
      { id: 'sp5', url: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?w=800&auto=format&fit=crop&q=60', label: 'Galaxy Glow' },
      { id: 'sp6', url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&auto=format&fit=crop&q=60', label: 'Astronaut View' }
    ],
    Nature: [
      { id: 'nat1', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60', label: 'Forest Path' },
      { id: 'nat2', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60', label: 'Tropical Beach' },
      { id: 'nat3', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=60', label: 'Misty Mountains' },
      { id: 'nat4', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60', label: 'Green Meadows' },
      { id: 'nat5', url: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=800&auto=format&fit=crop&q=60', label: 'Misty Lake' },
      { id: 'nat6', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=60', label: 'Sunset Desert' }
    ],
    Technology: [
      { id: 'tech1', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60', label: 'Microchip' },
      { id: 'tech2', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60', label: 'Matrix Code' },
      { id: 'tech3', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60', label: 'Cyber Security' },
      { id: 'tech4', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', label: 'Digital Grid' },
      { id: 'tech5', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=60', label: 'Abstract Tech' },
      { id: 'tech6', url: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60', label: 'Coding Screen' }
    ],
    Gaming: [
      { id: 'game1', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=60', label: 'Neon Setup' },
      { id: 'game2', url: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=800&auto=format&fit=crop&q=60', label: 'Game Console' },
      { id: 'game3', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60', label: 'Retro Toys' },
      { id: 'game4', url: 'https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?w=800&auto=format&fit=crop&q=60', label: 'RGB Keyboard' },
      { id: 'game5', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60', label: 'Esports Arena' },
      { id: 'game6', url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop&q=60', label: 'Pixel Joystick' }
    ],
    Neon: [
      { id: 'neon1', url: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=800&auto=format&fit=crop&q=60', label: 'Tokyo Night' },
      { id: 'neon2', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60', label: 'Cyber City' },
      { id: 'neon3', url: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=800&auto=format&fit=crop&q=60', label: 'Neon Lines' },
      { id: 'neon4', url: 'https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?w=800&auto=format&fit=crop&q=60', label: 'Fluorescent Tunnel' },
      { id: 'neon5', url: 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&auto=format&fit=crop&q=60', label: 'Neon Abstract' },
      { id: 'neon6', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60', label: 'Pink Neon Tube' }
    ],
    Minimal: [
      { id: 'min1', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=60', label: 'Soft Pastel' },
      { id: 'min2', url: 'https://images.unsplash.com/photo-1506220926022-cc5c12acdb35?w=800&auto=format&fit=crop&q=60', label: 'Grid Paper' },
      { id: 'min3', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=60', label: 'Smooth Gradient' },
      { id: 'min4', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60', label: 'Grey Concrete' },
      { id: 'min5', url: 'https://images.unsplash.com/photo-1518655061766-48f53a57b6f6?w=800&auto=format&fit=crop&q=60', label: 'Simple Lines' },
      { id: 'min6', url: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=800&auto=format&fit=crop&q=60', label: 'Subtle Shadow' }
    ],
    Abstract: [
      { id: 'abs1', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=60', label: 'Fluid Ink' },
      { id: 'abs2', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&auto=format&fit=crop&q=60', label: 'Colorful Paint' },
      { id: 'abs3', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', label: '3D Waves' },
      { id: 'abs4', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=60', label: 'Creative Shapes' },
      { id: 'abs5', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60', label: 'Abstract Smoke' },
      { id: 'abs6', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=60', label: 'Warm Swirls' }
    ],
    Gradient: [
      { id: 'grad1', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', label: 'Aurora Sky' },
      { id: 'grad2', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=60', label: 'Deep Blue' },
      { id: 'grad3', url: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800&auto=format&fit=crop&q=60', label: 'Sunset Red' },
      { id: 'grad4', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=60', label: 'Dreamy Pastel' },
      { id: 'grad5', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60', label: 'Rainbow Mesh' },
      { id: 'grad6', url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=800&auto=format&fit=crop&q=60', label: 'Techno Neon' }
    ],
    Festival: [
      { id: 'fest1', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=60', label: 'Fireworks' },
      { id: 'fest2', url: 'https://images.unsplash.com/photo-1507504038482-76210f6ecddb?w=800&auto=format&fit=crop&q=60', label: 'Party Confetti' },
      { id: 'fest3', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=60', label: 'Balloons' },
      { id: 'fest4', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60', label: 'Concert Lights' },
      { id: 'fest5', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=60', label: 'Dance Floor' },
      { id: 'fest6', url: 'https://images.unsplash.com/photo-1481162854517-d9e353af153d?w=800&auto=format&fit=crop&q=60', label: 'Carnival Fair' }
    ],
    Cartoon: [
      { id: 'cart1', url: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&auto=format&fit=crop&q=60', label: 'Kawaii Doodle' },
      { id: 'cart2', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60', label: 'Fantasy Clouds' },
      { id: 'cart3', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=60', label: 'Anime Sunset' },
      { id: 'cart4', url: 'https://images.unsplash.com/photo-1518887570146-0612132dd618?w=800&auto=format&fit=crop&q=60', label: 'Cute Pattern' },
      { id: 'cart5', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=60', label: 'Fairytale House' },
      { id: 'cart6', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60', label: 'Forest Cartoon' }
    ],
    Science: [
      { id: 'sci1', url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&auto=format&fit=crop&q=60', label: 'Chemistry Lab' },
      { id: 'sci2', url: 'https://images.unsplash.com/photo-1617155093730-a8bf47be792d?w=800&auto=format&fit=crop&q=60', label: 'Molecular Bonds' },
      { id: 'sci3', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=60', label: 'DNA Double Helix' },
      { id: 'sci4', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60', label: 'Physics Formulas' },
      { id: 'sci5', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60', label: 'Physics Study' },
      { id: 'sci6', url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60', label: 'Biotech Data' }
    ]
  };

  const AI_LIBRARY = [
    { id: 'ai1', url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60', label: 'Quiz Abstract Patterns' },
    { id: 'ai2', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60', label: 'Futuristic Grid Room' },
    { id: 'ai3', url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&auto=format&fit=crop&q=60', label: 'Premium Book Pattern' },
    { id: 'ai4', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60', label: 'Retro Gaming Isometric' },
    { id: 'ai5', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60', label: 'Classroom Isometric Art' },
    { id: 'ai6', url: 'https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=800&auto=format&fit=crop&q=60', label: 'Iridescent Abstract Glow' }
  ];

  // Helper to package customization settings into a single stringified payload
  const getCustomBgSerialized = () => {
    return JSON.stringify({
      url: bgImage,
      blur,
      brightness,
      overlayOpacity,
      gradientOverlay,
      gradientColor1,
      gradientColor2,
      position,
      fit,
      darkOverlay
    });
  };

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
      backgroundImage: getCustomBgSerialized(),
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
                className="btn-premium px-4 py-2.5 flex items-center gap-1.5 text-sm font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none' }}
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
                        backgroundImage: getCustomBgSerialized(),
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
                    className="btn-premium px-5 py-2.5 flex items-center gap-1.5 text-sm font-bold text-white shadow-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: 'none' }}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Forge & Host Live</span>
                  </button>

                  <button
                    onClick={handleSubmit(onSubmit, onInvalid)}
                    className="btn-premium px-5 py-2.5 flex items-center gap-1.5 text-sm font-bold text-white shadow-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none' }}
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

              {/* ── ADVANCED QUIZ BACKGROUND CUSTOMIZATION ── */}
              <div className="glass-panel rounded-3xl overflow-hidden relative border border-white/5 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="font-outfit text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Image className="h-4.5 w-4.5 text-primary" />
                    Quiz Background Customization
                  </h3>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Premium Visual Editor
                  </span>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                  
                  {/* Left Column: Editor controls (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    
                    {/* Tab Navigation */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setActiveBgTab('gallery')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          activeBgTab === 'gallery'
                            ? 'bg-primary text-white shadow-premium-glow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🖼️ Built-in Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBgTab('upload')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          activeBgTab === 'upload'
                            ? 'bg-primary text-white shadow-premium-glow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        📤 Upload Background
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveBgTab('ai')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          activeBgTab === 'ai'
                            ? 'bg-primary text-white shadow-premium-glow'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        🤖 AI Art Library
                      </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="min-h-[220px] bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 relative">
                      
                      {/* TAB 1: BUILT-IN GALLERY */}
                      {activeBgTab === 'gallery' && (
                        <div className="space-y-4">
                          {/* Search and Category Filters */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            <input
                              type="text"
                              placeholder="Search backgrounds..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                            />
                            <select
                              value={bgCategory}
                              onChange={(e) => setBgCategory(e.target.value)}
                              className="rounded-xl bg-[#111115] border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary"
                            >
                              {Object.keys(BG_PRESETS).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Gallery Grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 max-h-[240px] overflow-y-auto pr-1">
                            {BG_PRESETS[bgCategory]
                              ?.filter(img => img.label.toLowerCase().includes(searchQuery.toLowerCase()))
                              .map(img => (
                                <div
                                  key={img.id}
                                  onClick={() => setBgImage(img.url)}
                                  onDoubleClick={() => {
                                    setBgImage(img.url);
                                    toast.success(`Applied "${img.label}" background! 🌟`);
                                  }}
                                  className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                    bgImage === img.url
                                      ? 'border-primary scale-[1.03] shadow-premium-glow'
                                      : 'border-transparent hover:border-white/20'
                                  }`}
                                  title="Click once to preview, Double-click to Apply"
                                >
                                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] text-white font-bold bg-primary/80 px-2 py-0.5 rounded-full">Apply</span>
                                  </div>
                                  <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[9px] font-bold text-white leading-tight">
                                    {img.label}
                                  </div>
                                </div>
                              ))}
                          </div>
                          <p className="text-[10px] text-gray-500 italic text-center">Tip: Click once to preview instantly, double-click to lock selection.</p>
                        </div>
                      )}

                      {/* TAB 2: UPLOAD BACKGROUND */}
                      {activeBgTab === 'upload' && (
                        <div className="space-y-4">
                          <div
                            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragActive(false);
                              const file = e.dataTransfer.files?.[0];
                              if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  setBgImage(ev.target.result);
                                  toast.success(`Custom image "${file.name}" uploaded successfully! 🚀`);
                                };
                                reader.readAsDataURL(file);
                              } else {
                                toast.error('Please drop a valid JPG, PNG or WebP image file.');
                              }
                            }}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                              dragActive
                                ? 'border-primary bg-primary/5 scale-[0.99]'
                                : bgImage.startsWith('data:')
                                ? 'border-green-500/35 bg-green-500/5'
                                : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                            }`}
                          >
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-xs font-bold text-gray-300">Drag and drop your image here</p>
                            <p className="text-[10px] text-gray-500 mt-1">Supports JPG, PNG, or WebP formats</p>
                            <div className="mt-4 flex items-center justify-center gap-3">
                              <label className="btn-premium px-4 py-2 text-xs font-bold text-white cursor-pointer shadow-md"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', border: 'none' }}
                              >
                                Choose File
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        setBgImage(ev.target.result);
                                        toast.success(`Custom image "${file.name}" uploaded!`);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              {bgImage && (
                                <button
                                  type="button"
                                  onClick={() => setBgImage('')}
                                  className="btn-premium px-4 py-2 text-xs font-bold text-white"
                                  style={{ background: '#dc2626', border: 'none' }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: AI BACKGROUND LIBRARY */}
                      {activeBgTab === 'ai' && (
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-primary flex items-center gap-1">
                            <span>✨ Premium Curated Illustration Artworks</span>
                          </p>
                          <div className="grid grid-cols-3 gap-3">
                            {AI_LIBRARY.map(img => (
                              <button
                                key={img.id}
                                type="button"
                                onClick={() => {
                                  setBgImage(img.url);
                                  toast.success(`Applied AI artwork: "${img.label}"`);
                                }}
                                className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                                  bgImage === img.url
                                    ? 'border-primary scale-[1.03] shadow-premium-glow'
                                    : 'border-transparent hover:border-white/20'
                                }`}
                              >
                                <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold bg-primary px-2 py-0.5 rounded-full">Apply</span>
                                </div>
                                <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 text-center text-[9px] font-bold text-white leading-tight">
                                  {img.label}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Background Adjustment Controls */}
                    <div className="grid gap-5 sm:grid-cols-2 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                      
                      {/* Sliders */}
                      <div className="space-y-4">
                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Blur Intensity</span>
                            <span className="text-primary">{blur}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={blur}
                            onChange={(e) => setBlur(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Brightness</span>
                            <span className="text-primary">{brightness}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="150"
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between text-xs font-bold text-gray-400">
                            <span>Overlay Opacity</span>
                            <span className="text-primary">{overlayOpacity}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={overlayOpacity}
                            onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </div>
                      </div>

                      {/* Dropdowns and Toggles */}
                      <div className="space-y-4 text-left">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Fit</label>
                            <select
                              value={fit}
                              onChange={(e) => setFit(e.target.value)}
                              className="w-full rounded-lg bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="cover">Cover (Default)</option>
                              <option value="contain">Contain</option>
                              <option value="fill">Fill</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Position</label>
                            <select
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                              className="w-full rounded-lg bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="center">Center</option>
                              <option value="top">Top</option>
                              <option value="bottom">Bottom</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div className="flex items-center justify-between bg-[#111115] border border-white/10 px-3 py-2 rounded-xl">
                            <span className="text-[11px] font-bold text-gray-400">Dark Overlay</span>
                            <input
                              type="checkbox"
                              checked={darkOverlay}
                              onChange={(e) => setDarkOverlay(e.target.checked)}
                              className="w-4.5 h-4.5 rounded text-primary focus:ring-primary focus:ring-opacity-20 cursor-pointer accent-primary"
                            />
                          </div>

                          <div className="space-y-1">
                            <select
                              value={gradientOverlay}
                              onChange={(e) => setGradientOverlay(e.target.value)}
                              className="w-full rounded-lg bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            >
                              <option value="none">No Gradient Overlay</option>
                              <option value="linear">Linear Gradient</option>
                              <option value="radial">Radial Gradient</option>
                            </select>
                          </div>
                        </div>

                        {gradientOverlay !== 'none' && (
                          <div className="flex items-center gap-3 animate-fade-in">
                            <div className="flex-1 flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-500 font-bold uppercase">Color 1</span>
                              <input
                                type="color"
                                value={gradientColor1}
                                onChange={(e) => setGradientColor1(e.target.value)}
                                className="h-6 w-10 border border-white/10 rounded cursor-pointer bg-transparent"
                              />
                            </div>
                            <div className="flex-1 flex items-center gap-1.5">
                              <span className="text-[10px] text-gray-500 font-bold uppercase">Color 2</span>
                              <input
                                type="color"
                                value={gradientColor2}
                                onChange={(e) => setGradientColor2(e.target.value)}
                                className="h-6 w-10 border border-white/10 rounded cursor-pointer bg-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>


                  </div>

                  {/* Right Column: Live Preview Area (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    
                    {/* Device Selector */}
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-xl mb-4">
                      <span className="text-xs font-bold text-gray-400 pl-2">Live Quiz Preview</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('desktop')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            previewDevice === 'desktop'
                              ? 'bg-primary text-white'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          💻 Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewDevice('mobile')}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                            previewDevice === 'mobile'
                              ? 'bg-primary text-white'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          📱 Mobile
                        </button>
                      </div>
                    </div>

                    {/* Preview Screen Frame */}
                    <div className="flex-1 flex items-center justify-center bg-black/30 border border-white/10 rounded-2xl p-4 overflow-hidden min-h-[300px] relative">
                      
                      {/* Responsive container wrapper */}
                      <div
                        className={`transition-all duration-500 overflow-hidden relative shadow-2xl rounded-xl border border-white/10 ${
                          previewDevice === 'mobile' ? 'w-[200px] h-[340px]' : 'w-full h-[340px]'
                        }`}
                      >
                        {/* Background representation */}
                        <div
                          className="absolute inset-0 bg-gray-900 transition-all duration-300"
                          style={
                            bgImage
                              ? {
                                  backgroundImage: `url(${bgImage})`,
                                  backgroundPosition: position,
                                  backgroundSize: fit,
                                  filter: `blur(${blur}px) brightness(${brightness}%)`,
                                }
                              : {
                                  background: 'linear-gradient(135deg, #1e1b4b, #111827)'
                                }
                          }
                        />

                        {/* Dark Overlay Layer */}
                        {bgImage && darkOverlay && (
                          <div
                            className="absolute inset-0 z-1 pointer-events-none transition-all duration-300"
                            style={{
                              backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})`,
                            }}
                          />
                        )}

                        {/* Gradient Overlay Layer */}
                        {bgImage && gradientOverlay !== 'none' && (
                          <div
                            className="absolute inset-0 z-2 pointer-events-none transition-all duration-300"
                            style={{
                              background:
                                gradientOverlay === 'linear'
                                  ? `linear-gradient(135deg, ${gradientColor1}44, ${gradientColor2}44)`
                                  : `radial-gradient(circle, ${gradientColor1}44 0%, ${gradientColor2}44 100%)`,
                            }}
                          />
                        )}

                        {/* Mock Quiz UI Container */}
                        <div className="absolute inset-0 flex flex-col justify-between p-3 relative z-10 select-none">
                          <div className="flex justify-between items-center text-[8px] text-gray-300 font-bold border-b border-white/10 pb-1.5">
                            <span className="bg-primary/25 border border-primary/30 px-1.5 py-0.5 rounded uppercase tracking-wider text-primary">
                              Science
                            </span>
                            <span>⏱️ 15s</span>
                          </div>

                          {/* Mock Card */}
                          <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm text-center my-auto">
                            <p className="text-[10px] leading-snug tracking-tight text-gray-900 font-black">
                              What organelle generates chemical energy for the cell?
                            </p>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-2 gap-1.5">
                            {['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'].map((optText, optIdx) => {
                              const isCorrect = optIdx === 1;
                              
                              const optionBgClasses = [
                                'bg-[#e21b3c] border-[#e21b3c]',
                                'bg-[#1368ce] border-[#1368ce]',
                                'bg-[#d89e00] border-[#d89e00]',
                                'bg-[#26890c] border-[#26890c]'
                              ];
                              
                              const optionShapes = [
                                <svg className="h-3 w-3 fill-white stroke-transparent shrink-0" viewBox="0 0 24 24" key="tri">
                                  <path d="M12 3l10 17H2L12 3z" />
                                </svg>,
                                <svg className="h-2.5 w-2.5 fill-white stroke-transparent shrink-0 rotate-45" viewBox="0 0 24 24" key="diam">
                                  <rect x="5" y="5" width="14" height="14" />
                                </svg>,
                                <div className="h-2.5 w-2.5 rounded-full bg-white shrink-0 shadow-sm" key="circ" />,
                                <div className="h-2.5 w-2.5 rounded bg-white shrink-0 shadow-sm" key="sq" />
                              ];
                              
                              return (
                                <div 
                                  key={optIdx} 
                                  className={`rounded-md p-1.5 text-[7px] flex items-center justify-between gap-1.5 border text-white shadow-sm ${optionBgClasses[optIdx]} ${
                                    isCorrect ? 'ring-2 ring-white/50 scale-[1.01]' : 'opacity-90'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    {optionShapes[optIdx]}
                                    <span className="font-extrabold">{optText}</span>
                                  </div>
                                  
                                  <div className="h-3 w-3 rounded-full border border-white/70 flex items-center justify-center shrink-0">
                                    {isCorrect && (
                                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                    </div>

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
                      className="btn-premium px-4 py-2 flex items-center gap-1.5 text-sm font-bold text-white cursor-pointer shadow-md"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', border: 'none' }}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
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
                                    placeholder={`Option ${['A', 'B', 'C', 'D'][optIdx]}`}
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
