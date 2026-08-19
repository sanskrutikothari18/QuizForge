/**
 * Comprehensive pre-built reference questions organized by category.
 * Each question follows the QuizForge quiz schema: 
 * { questionText, options: [str1, str2, str3, str4], correctAnswer: number (0-indexed), timeLimit: number }
 */

export const prebuiltQuestions = {
  'general knowledge': [
    {
      questionText: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'How many continents are there on Earth?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the largest ocean on Earth?',
      options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
      correctAnswer: 3,
      timeLimit: 15
    },
    {
      questionText: 'Who painted the Mona Lisa?',
      options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Rembrandt'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the smallest country in the world?',
      options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'How many sides does a hexagon have?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the chemical symbol for Gold?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which language has the most native speakers in the world?',
      options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What year did World War II end?',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  science: [
    {
      questionText: 'What is the powerhouse of the cell?',
      options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Apparatus'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What gas do plants absorb during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the approximate speed of light in a vacuum?',
      options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '1,000,000 km/s'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which element has the chemical symbol "O"?',
      options: ['Osmium', 'Oxygen', 'Oganesson', 'Gold'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the chemical formula for pure water?',
      options: ['H2O', 'CO2', 'NaCl', 'O2'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Who developed the general theory of relativity?',
      options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Stephen Hawking'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What force keeps human beings grounded on Earth?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Tension'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'How many chambers are inside the human heart?',
      options: ['2', '3', '4', '5'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What subatomic particle carries a positive electric charge?',
      options: ['Electron', 'Neutron', 'Proton', 'Photon'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the boiling point of water at sea level?',
      options: ['90°C', '100°C', '110°C', '120°C'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  technology: [
    {
      questionText: 'What does HTML stand for in web development?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which language is primarily used to format web page layout & styling?',
      options: ['Python', 'JavaScript', 'HTML', 'CSS'],
      correctAnswer: 3,
      timeLimit: 15
    },
    {
      questionText: 'What symbol is used for single-line comments in JavaScript?',
      options: ['<!-- -->', '//', '#', '/* */'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which keyword declares a constant variable in JavaScript?',
      options: ['var', 'let', 'const', 'static'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What does API stand for in software engineering?',
      options: ['Application Programming Interface', 'Advanced Program Integration', 'Automated Process Interface', 'Application Process Integration'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which technology is known as the standard programming language of the web browsers?',
      options: ['Python', 'Java', 'JavaScript', 'C++'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What does DOM stand for in JavaScript?',
      options: ['Document Object Model', 'Data Object Management', 'Digital Order Model', 'Document Orientation Method'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which of the following is a popular JavaScript UI library?',
      options: ['Django', 'Flask', 'React', 'Laravel'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which symbol is used for strict value and type equality in JavaScript?',
      options: ['=', '==', '===', '!='],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What does SQL stand for in database management?',
      options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'],
      correctAnswer: 0,
      timeLimit: 15
    }
  ],

  programming: [
    {
      questionText: 'What does HTML stand for in web development?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which keyword declares a block-scoped variable in modern JavaScript?',
      options: ['var', 'let', 'def', 'val'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which data structure follows the FIFO (First In First Out) principle?',
      options: ['Stack', 'Queue', 'Array', 'Binary Tree'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the standard file extension for Python scripts?',
      options: ['.js', '.py', '.java', '.cpp'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Linked List', 'Heap'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which HTTP method is typically used to update an existing resource?',
      options: ['GET', 'POST', 'PUT', 'DELETE'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What does JSON stand for?',
      options: ['JavaScript Object Notation', 'Java Standard Output Network', 'JavaScript Online Native', 'Java Server Object Naming'],
      correctAnswer: 0,
      timeLimit: 15
    }
  ],

  geography: [
    {
      questionText: 'Which is the largest continent on Earth by land area?',
      options: ['Africa', 'North America', 'Asia', 'Europe'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the longest river in Africa?',
      options: ['Congo River', 'Niger River', 'Zambezi River', 'Nile River'],
      correctAnswer: 3,
      timeLimit: 15
    },
    {
      questionText: 'Mount Everest is situated in which major mountain range?',
      options: ['Andes', 'Alps', 'Himalayas', 'Rockies'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which country has the greatest number of natural lakes?',
      options: ['USA', 'Russia', 'Canada', 'India'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the official capital city of Japan?',
      options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which desert is the largest hot desert in the world?',
      options: ['Gobi Desert', 'Sahara Desert', 'Arabian Desert', 'Kalahari Desert'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the largest island in the world?',
      options: ['Borneo', 'Madagascar', 'Greenland', 'New Guinea'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which country has the longest coastline in the world?',
      options: ['Australia', 'Indonesia', 'Canada', 'Russia'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  history: [
    {
      questionText: 'In which year did World War I break out?',
      options: ['1912', '1914', '1916', '1918'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which empire was established and led by Genghis Khan?',
      options: ['Ottoman Empire', 'Roman Empire', 'Mongol Empire', 'Persian Empire'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In which year did the Berlin Wall fall, signaling the end of the Cold War?',
      options: ['1987', '1988', '1989', '1990'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which ancient civilization built the famous mountain citadel Machu Picchu?',
      options: ['Aztecs', 'Mayans', 'Incas', 'Olmecs'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Who was the first human astronaut to walk on the Moon?',
      options: ['Buzz Aldrin', 'Yuri Gagarin', 'Neil Armstrong', 'Michael Collins'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In which country did the Industrial Revolution originate?',
      options: ['France', 'Germany', 'United States', 'Great Britain'],
      correctAnswer: 3,
      timeLimit: 15
    },
    {
      questionText: 'In which year did the luxury liner Titanic sink?',
      options: ['1905', '1912', '1920', '1927'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  space: [
    {
      questionText: 'Which planet in our solar system is the largest in physical size?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What object lies at the center of the Milky Way galaxy?',
      options: ['Neutron Star', 'Supermassive Black Hole', 'White Dwarf', 'Quasar'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the closest star to planet Earth?',
      options: ['Alpha Centauri', 'Proxima Centauri', 'The Sun', 'Sirius'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which planet is known for its prominent, wide ring system?',
      options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'How long does light from the Sun take to reach Earth?',
      options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is a comet predominantly composed of?',
      options: ['Rock & Iron', 'Ice, Dust & Gas', 'Liquid Hydrogen', 'Plasma'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  gaming: [
    {
      questionText: 'What is the best-selling video game of all time?',
      options: ['Tetris', 'Grand Theft Auto V', 'Minecraft', 'Wii Sports'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which company created the Mario and Zelda franchises?',
      options: ['Sony', 'Sega', 'Nintendo', 'Capcom'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In battle royale games like Fortnite, what term refers to the safe playable area?',
      options: ['The Zone / Storm Circle', 'The Arena', 'The Safe House', 'The Fortress'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'What year was the original PlayStation released in Japan?',
      options: ['1992', '1994', '1996', '1998'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the main character name in The Legend of Zelda series?',
      options: ['Zelda', 'Link', 'Ganon', 'Epona'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which gaming console pioneered the motion controller Wiimote?',
      options: ['Xbox 360', 'PlayStation 3', 'Nintendo Wii', 'GameCube'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  education: [
    {
      questionText: 'What is the primary study of word origins and historical meanings?',
      options: ['Etymology', 'Entomology', 'Epistemology', 'Ecology'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Which system classifies library books by subject numbers?',
      options: ['Dewey Decimal System', 'Library of Congress', 'ISBN System', 'Standard Index'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'Who wrote the play "Romeo and Juliet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What figure of speech directly compares two things using "like" or "as"?',
      options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the longest word type that names a person, place, thing, or idea?',
      options: ['Verb', 'Adjective', 'Noun', 'Adverb'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  mathematics: [
    {
      questionText: 'What is the value of Pi (π) rounded to two decimal places?',
      options: ['3.12', '3.14', '3.16', '3.18'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the square root of 144?',
      options: ['10', '11', '12', '14'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What is the sum of interior angles in a triangle?',
      options: ['90°', '180°', '270°', '360°'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the only even prime number?',
      options: ['0', '1', '2', '4'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In algebra, what theorem relates the sides of a right triangle (a² + b² = c²)?',
      options: ['Fermat\'s Last Theorem', 'Pythagorean Theorem', 'Binomial Theorem', 'Euler\'s Identity'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  nature: [
    {
      questionText: 'What is the largest living species of land mammal?',
      options: ['Rhinoceros', 'Hippopotamus', 'African Elephant', 'Giraffe'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What process enables green plants to make food from sunlight?',
      options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Osmosis'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which animal is known to be the fastest land swimmer/runner on Earth?',
      options: ['Cheetah', 'Falcon', 'Antelope', 'Leopard'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'What is the largest living structure on Earth, visible from space?',
      options: ['Amazon Rainforest', 'Great Barrier Reef', 'Grand Canyon', 'Redwood National Park'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What type of tree retains its leaves green all year round?',
      options: ['Deciduous', 'Evergreen / Conifer', 'Oak', 'Maple'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  sports: [
    {
      questionText: 'How many players are on the field for one team in a standard football (soccer) match?',
      options: ['9', '10', '11', '12'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In tennis, what term represents a score of zero points?',
      options: ['Love', 'Nil', 'Zero', 'Blank'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'How often are the Olympic Games held (Summer or Winter cycles)?',
      options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In basketball, how many points is a shot made from beyond the arc worth?',
      options: ['1 point', '2 points', '3 points', '4 points'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which sport is played at Wimbledon?',
      options: ['Golf', 'Cricket', 'Tennis', 'Polo'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  music: [
    {
      questionText: 'How many strings does a standard acoustic or electric guitar have?',
      options: ['4', '5', '6', '8'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Who is known as the "King of Pop"?',
      options: ['Elvis Presley', 'Michael Jackson', 'Prince', 'Freddie Mercury'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which classical composer was deaf when he composed his Ninth Symphony?',
      options: ['Mozart', 'Beethoven', 'Bach', 'Chopin'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What musical symbol at the start of a stave indicates higher pitch ranges?',
      options: ['Bass Clef', 'Treble Clef', 'Alto Clef', 'Sharp'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which British band released the hit album "Abbey Road"?',
      options: ['The Rolling Stones', 'Queen', 'The Beatles', 'Led Zeppelin'],
      correctAnswer: 2,
      timeLimit: 15
    }
  ],

  food: [
    {
      questionText: 'What primary ingredient is used to make traditional Italian guacamole?',
      options: ['Tomato', 'Avocado', 'Olive Oil', 'Mozzarella'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which spice is known as the most expensive spice in the world by weight?',
      options: ['Vanilla', 'Saffron', 'Cardamom', 'Cinnamon'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What type of food is sourdough?',
      options: ['Cheese', 'Bread', 'Pasta', 'Soup'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which country is famous for inventing Sushi?',
      options: ['China', 'Korea', 'Japan', 'Thailand'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'What basic ingredient causes bread dough to rise?',
      options: ['Baking Soda', 'Yeast', 'Sugar', 'Butter'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  movies: [
    {
      questionText: 'Which film won the first-ever Academy Award for Best Animated Feature?',
      options: ['Toy Story', 'Shrek', 'Finding Nemo', 'The Lion King'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Who directed the sci-fi epic movie "Inception" and "Interstellar"?',
      options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'Quentin Tarantino'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'What is the highest-grossing film of all time (unadjusted for inflation)?',
      options: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars: The Force Awakens'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'In Star Wars, what color is Luke Skywalker\'s lightsaber in Return of the Jedi?',
      options: ['Blue', 'Red', 'Green', 'Purple'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which actor played Tony Stark / Iron Man in the Marvel Cinematic Universe?',
      options: ['Chris Evans', 'Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  birds: [
    {
      questionText: 'What is the fastest bird in the world in a hunting dive?',
      options: ['Golden Eagle', 'Peregrine Falcon', 'Hummingbird', 'Ostrich'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which is the largest flightless bird on Earth?',
      options: ['Emu', 'Penguin', 'Ostrich', 'Cassowary'],
      correctAnswer: 2,
      timeLimit: 15
    },
    {
      questionText: 'Which tiny bird is capable of flying backwards?',
      options: ['Hummingbird', 'Sparrow', 'Robin', 'Kingfisher'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'What bird is globally recognized as a universal symbol of peace?',
      options: ['Eagle', 'White Dove', 'Swan', 'Peacock'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ],

  business: [
    {
      questionText: 'What does ROI stand for in business and finance?',
      options: ['Return on Investment', 'Rate of Income', 'Risk of Inflation', 'Real Operating Income'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'What term describes a newly founded business valued at over $1 billion?',
      options: ['Decacorn', 'Unicorn', 'Blue Chip', 'Venture'],
      correctAnswer: 1,
      timeLimit: 15
    },
    {
      questionText: 'Which organization regulates global financial markets and monetary policies?',
      options: ['IMF (International Monetary Fund)', 'UNESCO', 'WHO', 'UNICEF'],
      correctAnswer: 0,
      timeLimit: 15
    },
    {
      questionText: 'What document summarizes a company\'s revenues, costs, and expenses over time?',
      options: ['Balance Sheet', 'Income Statement (P&L)', 'Cash Flow', 'Audit Report'],
      correctAnswer: 1,
      timeLimit: 15
    }
  ]
};

/**
 * Normalizes category names to help with matching
 */

const CATEGORY_ALIAS_MAP = {
  'general': 'general knowledge',
  'gk': 'general knowledge',
  'tech': 'programming',
  'technology': 'programming',
  'code': 'programming',
  'coding': 'programming',
  'programming & technology': 'programming',
  'math': 'mathematics',
  'space astronomy': 'space',
  'astronomy': 'space',
  'space & astronomy': 'space',
  'flora & fauna': 'nature',
  'environment': 'nature',
  'nature & environment': 'nature',
  'literature': 'education',
  'books': 'education',
  'education & literature': 'education',
  'esports': 'gaming',
  'games': 'gaming',
  'gaming & esports': 'gaming',
  'cinema': 'movies',
  'film': 'movies',
  'entertainment': 'movies',
  'movies & entertainment': 'movies',
  'cooking': 'food',
  'cuisine': 'food',
  'food & cooking': 'food',
  'food & culinary': 'food',
  'animals': 'birds',
  'animals & birds': 'birds',
  'wildlife & birds': 'birds',
  'wildlife': 'birds',
  'finance': 'business',
  'economics': 'business',
  'business & economics': 'business',
  'business & finance': 'business',
  'sports & fitness': 'sports',
  'music & arts': 'music'
};

export const getQuestionsForCategory = (category, searchFilter = '') => {
  if (!category && !searchFilter) return prebuiltQuestions['general knowledge'];

  let key = (category || '').toLowerCase().trim();
  key = CATEGORY_ALIAS_MAP[key] || key;

  let pool = [];

  // Direct match or merged programming + technology
  if (key === 'programming') {
    pool = [...(prebuiltQuestions['programming'] || []), ...(prebuiltQuestions['technology'] || [])];
  } else if (prebuiltQuestions[key]) {
    pool = prebuiltQuestions[key];
  } else {
    // Partial match across category names
    const matchedCategoryKey = Object.keys(prebuiltQuestions).find(cKey => 
      cKey.includes(key) || key.includes(cKey)
    );
    if (matchedCategoryKey) {
      if (matchedCategoryKey === 'programming' || matchedCategoryKey === 'technology') {
        pool = [...(prebuiltQuestions['programming'] || []), ...(prebuiltQuestions['technology'] || [])];
      } else {
        pool = prebuiltQuestions[matchedCategoryKey];
      }
    } else {
      // Aggregate matching questions across all categories if key matches question text
      const allQs = Object.values(prebuiltQuestions).flat();
      const matched = allQs.filter(q => 
        q.questionText.toLowerCase().includes(key) || 
        q.options.some(opt => opt.toLowerCase().includes(key))
      );
      pool = matched.length > 0 ? matched : prebuiltQuestions['general knowledge'];
    }
  }

  // Further filter if a specific searchFilter keyword was passed
  if (searchFilter && searchFilter.trim().length > 0) {
    const term = searchFilter.toLowerCase().trim();
    const filtered = pool.filter(q => 
      q.questionText.toLowerCase().includes(term) ||
      q.options.some(opt => opt.toLowerCase().includes(term))
    );
    return filtered.length > 0 ? filtered : pool;
  }

  return pool;
};

export const getRecommendedThemeForCategory = (category) => {
  if (!category) return 'science';
  
  const key = category.toLowerCase().trim();
  
  if (key.includes('science') || key.includes('math')) {
    return 'science';
  }
  if (key.includes('space') || key.includes('astronomy')) {
    return 'space';
  }
  if (key.includes('programming') || key.includes('technology') || key.includes('coding') || key.includes('tech') || key.includes('code')) {
    return 'ai';
  }
  if (key.includes('business') || key.includes('economics') || key.includes('finance')) {
    return 'cyberpunk';
  }
  if (key.includes('history') || key.includes('heritage') || key.includes('education') || key.includes('literature') || key.includes('book')) {
    return 'heritage';
  }
  if (key.includes('sports') || key.includes('fitness')) {
    return 'sports';
  }
  if (key.includes('nature') || key.includes('environment') || key.includes('jungle') || key.includes('animal') || key.includes('bird') || key.includes('wildlife')) {
    return 'jungle';
  }
  if (key.includes('ocean') || key.includes('sea') || key.includes('water')) {
    return 'ocean';
  }
  if (key.includes('music') || key.includes('art') || key.includes('song')) {
    return 'music';
  }
  if (key.includes('movie') || key.includes('film') || key.includes('cinema') || key.includes('entertainment')) {
    return 'movie';
  }
  if (key.includes('geography') || key.includes('travel') || key.includes('food') || key.includes('cooking') || key.includes('culinary')) {
    return 'travel';
  }
  
  return 'science';
};

export const getAllCategories = () => {
  return [
    { key: 'general knowledge', label: 'General Knowledge', icon: 'HelpCircle', count: prebuiltQuestions['general knowledge'].length },
    { key: 'science', label: 'Science', icon: 'Sparkles', count: prebuiltQuestions['science'].length },
    { key: 'programming', label: 'Programming & Technology', icon: 'Code', count: (prebuiltQuestions['programming'] || []).length + (prebuiltQuestions['technology'] || []).length },
    { key: 'geography', label: 'Geography', icon: 'Globe', count: prebuiltQuestions['geography'].length },
    { key: 'history', label: 'History', icon: 'BookOpen', count: prebuiltQuestions['history'].length },
    { key: 'education', label: 'Education & Literature', icon: 'GraduationCap', count: prebuiltQuestions['education'].length },
    { key: 'space', label: 'Space & Astronomy', icon: 'Rocket', count: prebuiltQuestions['space'].length },
    { key: 'gaming', label: 'Gaming & Esports', icon: 'Gamepad2', count: prebuiltQuestions['gaming'].length },
    { key: 'mathematics', label: 'Mathematics', icon: 'Calculator', count: prebuiltQuestions['mathematics'].length },
    { key: 'nature', label: 'Nature & Environment', icon: 'Trees', count: prebuiltQuestions['nature'].length },
    { key: 'sports', label: 'Sports & Fitness', icon: 'Trophy', count: prebuiltQuestions['sports'].length },
    { key: 'music', label: 'Music & Arts', icon: 'Music', count: prebuiltQuestions['music'].length },
    { key: 'food', label: 'Food & Cooking', icon: 'Utensils', count: prebuiltQuestions['food'].length },
    { key: 'movies', label: 'Movies & Entertainment', icon: 'Film', count: prebuiltQuestions['movies'].length },
    { key: 'birds', label: 'Animals & Birds', icon: 'Feather', count: prebuiltQuestions['birds'].length },
    { key: 'business', label: 'Business & Economics', icon: 'Briefcase', count: prebuiltQuestions['business'].length }
  ];
};

export default prebuiltQuestions;
