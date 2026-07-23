import React, { useState } from 'react';
import { Image, Upload, Sparkles, Monitor, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

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

const parseBgConfig = (bgStr) => {
  if (!bgStr) {
    return {
      url: '',
      blur: 0,
      brightness: 100,
      overlayOpacity: 30,
      gradientOverlay: 'none',
      gradientColor1: '#7c3aed',
      gradientColor2: '#06b6d4',
      position: 'center',
      fit: 'cover',
      darkOverlay: true
    };
  }
  try {
    let config = bgStr;
    // Recursively parse string if it's double serialized or nested JSON
    while (typeof config === 'string' && (config.trim().startsWith('{') || config.trim().startsWith('"'))) {
      const parsed = JSON.parse(config);
      if (typeof parsed === 'string' && parsed === config) {
        break; // Prevent infinite loop
      }
      config = parsed;
    }

    if (config && typeof config === 'object') {
      return {
        url: config.url || '',
        blur: typeof config.blur === 'number' ? config.blur : 0,
        brightness: typeof config.brightness === 'number' ? config.brightness : 100,
        overlayOpacity: typeof config.overlayOpacity === 'number' ? config.overlayOpacity : 30,
        gradientOverlay: config.gradientOverlay || 'none',
        gradientColor1: config.gradientColor1 || '#7c3aed',
        gradientColor2: config.gradientColor2 || '#06b6d4',
        position: config.position || 'center',
        fit: config.fit || 'cover',
        darkOverlay: config.darkOverlay !== undefined ? !!config.darkOverlay : true
      };
    }
  } catch (e) { }
  return {
    url: typeof bgStr === 'string' ? bgStr : (bgStr?.url || ''),
    blur: 0,
    brightness: 100,
    overlayOpacity: 30,
    gradientOverlay: 'none',
    gradientColor1: '#7c3aed',
    gradientColor2: '#06b6d4',
    position: 'center',
    fit: 'cover',
    darkOverlay: true
  };
};

const compressAndResizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1000;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG with 0.6 quality (looks great for blurred backgrounds, extremely small size)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedBase64);
      };
      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression'));
      };
      img.src = ev.target.result;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

export default function BackgroundPicker({ value, onChange, showPreview = true, previewData }) {
  const config = parseBgConfig(value);

  const defaultPreviewData = {
    category: 'Preview Category',
    timeLimit: 15,
    questionText: 'What organelle generates chemical energy for the cell?',
    options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'],
    correctAnswer: 1
  };
  const pd = previewData || defaultPreviewData;
  const displayCategory = pd.category || 'Preview Category';
  const displayTime = pd.timeLimit || 20;
  const displayQuestion = pd.questionText || 'Question text...';
  const displayOptions = pd.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const displayCorrectAnswer = pd.correctAnswer || 0;

  const optionShapes = [
    <svg className="h-2.5 w-2.5 fill-white stroke-transparent shrink-0" viewBox="0 0 24 24" key="triangle"><path d="M12 3l10 17H2L12 3z" /></svg>,
    <svg className="h-2.5 w-2.5 fill-white stroke-transparent shrink-0 rotate-45" viewBox="0 0 24 24" key="diamond"><rect x="5" y="5" width="14" height="14" /></svg>,
    <div className="h-2.5 w-2.5 rounded-full bg-white shrink-0 shadow-sm" key="circle" />,
    <div className="h-2.5 w-2.5 rounded bg-white shrink-0 shadow-sm" key="square" />
  ];

  // Picker local UI states
  const [activeBgTab, setActiveBgTab] = useState('gallery'); // 'upload' | 'gallery' | 'ai'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [searchQuery, setSearchQuery] = useState('');
  const [bgCategory, setBgCategory] = useState('Education');
  const [dragActive, setDragActive] = useState(false);

  const updateField = (field, val) => {
    const newConfig = { ...config, [field]: val };
    onChange(JSON.stringify(newConfig));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left Column: Editor controls */}
      <div className={`${showPreview ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-6 text-left`}>
        
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
            <span className="flex items-center justify-center gap-1.5">
              <Image className="h-3.5 w-3.5" />
              Built-in Gallery
            </span>
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
            <span className="flex items-center justify-center gap-1.5">
              <Upload className="h-3.5 w-3.5" />
              Upload Background
            </span>
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
            <span className="flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI Art Library
            </span>
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
                      onClick={() => updateField('url', img.url)}
                      onDoubleClick={() => {
                        updateField('url', img.url);
                        toast.success(`Applied "${img.label}" background!`);
                      }}
                      className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        config.url === img.url
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
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    const toastId = toast.loading('Processing and compressing background image...');
                    try {
                      const compressedUrl = await compressAndResizeImage(file);
                      updateField('url', compressedUrl);
                      toast.success(`Custom image "${file.name}" uploaded successfully!`, { id: toastId });
                    } catch (error) {
                      console.error('[IMAGE COMPRESSION ERROR]', error);
                      toast.error('Failed to compress image. Using raw upload.', { id: toastId });
                      // Fallback
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        updateField('url', ev.target.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  } else {
                    toast.error('Please drop a valid JPG, PNG or WebP image file.');
                  }
                }}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive
                    ? 'border-primary bg-primary/5 scale-[0.99]'
                    : config.url.startsWith('data:')
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const toastId = toast.loading('Processing and compressing background image...');
                          try {
                            const compressedUrl = await compressAndResizeImage(file);
                            updateField('url', compressedUrl);
                            toast.success(`Custom image "${file.name}" uploaded!`, { id: toastId });
                          } catch (error) {
                            console.error('[IMAGE COMPRESSION ERROR]', error);
                            toast.error('Failed to compress image. Using raw upload.', { id: toastId });
                            // Fallback
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              updateField('url', ev.target.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                  </label>
                  {config.url && (
                    <button
                      type="button"
                      onClick={() => updateField('url', '')}
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
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400" />
                  Premium Curated Illustration Artworks
                </span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {AI_LIBRARY.map(img => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      updateField('url', img.url);
                      toast.success(`Applied AI artwork: "${img.label}"`);
                    }}
                    className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      config.url === img.url
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
                <span className="text-primary">{config.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={config.blur}
                onChange={(e) => updateField('blur', Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>Brightness</span>
                <span className="text-primary">{config.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={config.brightness}
                onChange={(e) => updateField('brightness', Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-xs font-bold text-gray-400">
                <span>Overlay Opacity</span>
                <span className="text-primary">{config.overlayOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={config.overlayOpacity}
                onChange={(e) => updateField('overlayOpacity', Number(e.target.value))}
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
                  value={config.fit}
                  onChange={(e) => updateField('fit', e.target.value)}
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
                  value={config.position}
                  onChange={(e) => updateField('position', e.target.value)}
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
                  checked={config.darkOverlay}
                  onChange={(e) => updateField('darkOverlay', e.target.checked)}
                  className="w-4.5 h-4.5 rounded text-primary focus:ring-primary focus:ring-opacity-20 cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-1">
                <select
                  value={config.gradientOverlay}
                  onChange={(e) => updateField('gradientOverlay', e.target.value)}
                  className="w-full rounded-lg bg-[#111115] border border-white/10 px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="none">No Gradient Overlay</option>
                  <option value="linear">Linear Gradient</option>
                  <option value="radial">Radial Gradient</option>
                </select>
              </div>
            </div>

            {config.gradientOverlay !== 'none' && (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Color 1</span>
                  <input
                    type="color"
                    value={config.gradientColor1}
                    onChange={(e) => updateField('gradientColor1', e.target.value)}
                    className="h-6 w-10 border border-white/10 rounded cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex-1 flex items-center gap-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Color 2</span>
                  <input
                    type="color"
                    value={config.gradientColor2}
                    onChange={(e) => updateField('gradientColor2', e.target.value)}
                    className="h-6 w-10 border border-white/10 rounded cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Right Column: Live Preview Area */}
      {showPreview && (
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
                <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />Desktop</span>
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
                <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" />Mobile</span>
              </button>
            </div>
          </div>

          {/* Preview Screen Frame */}
          <div className="flex-1 flex items-center justify-center bg-black/30 border border-white/10 rounded-2xl p-4 overflow-hidden min-h-[300px] relative">
            <div
              className={`transition-all duration-500 overflow-hidden relative shadow-2xl rounded-xl border border-white/10 ${
                previewDevice === 'mobile' ? 'w-[200px] h-[340px]' : 'w-full h-[340px]'
              }`}
            >
              {/* Background representation */}
              <div
                className="absolute inset-0 bg-gray-900 transition-all duration-300"
                style={
                  config.url
                    ? {
                        backgroundImage: `url(${config.url})`,
                        backgroundPosition: config.position,
                        backgroundSize: config.fit,
                        filter: `blur(${config.blur}px) brightness(${config.brightness}%)`,
                      }
                    : {
                        background: 'linear-gradient(135deg, #1e1b4b, #111827)'
                      }
                }
              />

              {/* Dark Overlay Layer */}
              {config.url && config.darkOverlay && (
                <div
                  className="absolute inset-0 z-1 pointer-events-none transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(0,0,0,${config.overlayOpacity / 100})`,
                  }}
                />
              )}

              {/* Gradient Overlay Layer */}
              {config.url && config.gradientOverlay !== 'none' && (
                <div
                  className="absolute inset-0 z-2 pointer-events-none transition-all duration-300"
                  style={{
                    background:
                      config.gradientOverlay === 'linear'
                        ? `linear-gradient(135deg, ${config.gradientColor1}44, ${config.gradientColor2}44)`
                        : `radial-gradient(circle, ${config.gradientColor1}44 0%, ${config.gradientColor2}44 100%)`,
                  }}
                />
              )}

              {/* Mock Quiz UI Container */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 relative z-10 select-none">
                <div className="flex justify-between items-center text-[8px] text-gray-300 font-bold border-b border-white/10 pb-1.5">
                  <span className="bg-primary/25 border border-primary/30 px-1.5 py-0.5 rounded uppercase tracking-wider text-primary truncate max-w-[100px]">
                    {displayCategory}
                  </span>
                  <span className="shrink-0">⏱️ {displayTime}s</span>
                </div>

                {/* Mock Card */}
                <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm text-center my-auto mx-2">
                  <p className="text-[10px] leading-snug tracking-tight text-gray-900 font-black line-clamp-3">
                    {displayQuestion}
                  </p>
                </div>

                {/* Options grid */}
                <div className={`grid gap-1.5 ${previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {displayOptions.map((optText, optIdx) => {
                    const isCorrect = Number(displayCorrectAnswer) === optIdx;
                    const optionBgClasses = [
                      'bg-[#e21b3c] border-[#e21b3c]',
                      'bg-[#1368ce] border-[#1368ce]',
                      'bg-[#d89e00] border-[#d89e00]',
                      'bg-[#26890c] border-[#26890c]'
                    ];
                    
                    return (
                      <div 
                        key={optIdx} 
                        className={`rounded-md p-1.5 text-[7px] flex items-center justify-between gap-1 border text-white shadow-sm ${optionBgClasses[optIdx]} ${
                          isCorrect ? 'ring-2 ring-white/50 scale-[1.01]' : 'opacity-90'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {optionShapes[optIdx]}
                          <span className="font-extrabold truncate">{optText || `Option ${optIdx + 1}`}</span>
                        </div>
                        <div className="h-3 w-3 rounded-full border border-white/70 flex items-center justify-center shrink-0">
                          {isCorrect && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
