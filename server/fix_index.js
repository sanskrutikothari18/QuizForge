const fs = require('fs');
let code = fs.readFileSync('./index.js', 'utf8');

// 1. Remove merge conflict markers
code = code.replace(/<<<<<<< HEAD\r?\n<<<<<<< HEAD\r?\n/g, '');
code = code.replace(/=======\r?\napp\.listen\(PORT, '0\.0\.0\.0', \(\) => {\r?\n=======\r?\nserver\.listen\(PORT, '0\.0\.0\.0', \(\) => {\r?\n>>>>>>> [^\n]+\r?\n    console\.log\([^)]+\);\r?\n}\);\r?\n>>>>>>> [^\n]+\r?\n/g, '');

code = code.replace(/server\.listen\(PORT, \(\) => {\r?\n  console\.log\(`QuizForge server listening on port \${PORT}`\);\r?\n}\);\r?\n=======\r?\napp\.listen\(PORT, '0\.0\.0\.0', \(\) => {\r?\n=======\r?\nserver\.listen\(PORT, '0\.0\.0\.0', \(\) => {\r?\n>>>>>>> [^\n]+\r?\n    console\.log\(`QuizForge server listening on port \${PORT}`\);\r?\n}\);\r?\n>>>>>>> [^\n]+\r?\n/g, 'server.listen(PORT, \'0.0.0.0\', () => {\n  console.log(`QuizForge server listening on port ${PORT}`);\n});\n');

// 2. Remove QUESTIONS

code = code.replace(/const QUESTIONS = \[\s*\{[\s\S]*?\}\s*\];\s*/, '');

// 3. Remove BOT_NAMES
code = code.replace(/const BOT_NAMES = \[[^\]]+\];\s*/, '');

// 4. In clearRoomTimers
code = code.replace(/  if \(room\.botFillTimeout\) {[\s\S]*?}\r?\n/g, '');
code = code.replace(/  if \(room\.botAnswerTimers\) {[\s\S]*?}\r?\n/g, '');

// 5. Remove addDemoBots
code = code.replace(/function addDemoBots\(room\) {[\s\S]*?}\s*(?=function scheduleBotFill)/, '');

// 6. Remove scheduleBotFill
code = code.replace(/function scheduleBotFill\(room\) {[\s\S]*?}\s*(?=function scheduleBotAnswers)/, '');

// 7. Remove scheduleBotAnswers
code = code.replace(/function scheduleBotAnswers\(room\) {[\s\S]*?}\s*(?=function getRoomForSocket)/, '');

// 8. In endQuestion
code = code.replace(/  if \(room\.botAnswerTimers\) {[\s\S]*?}\r?\n/g, '');

// 9. In startQuestion
code = code.replace(/  scheduleBotAnswers\(room\);\r?\n/g, '');

// 10. In create_room
code = code.replace(/socket\.on\('create_room', \(\{ username, title \}, callback\) => {/g, "socket.on('create_room', ({ username, title, questions }, callback) => {");
code = code.replace(/questions: QUESTIONS,/g, 'questions: questions || [],');
code = code.replace(/botFillTimeout: null,\r?\n      botAnswerTimers: \[\],/g, '');
code = code.replace(/    scheduleBotFill\(room\);\r?\n/g, '');

fs.writeFileSync('./index.js', code);
