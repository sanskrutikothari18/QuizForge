const fs = require('fs');

function chooseTheirs(code) {
  // Regex to match git conflict markers
  const conflictRegex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> [^\r\n]+\r?\n/g;
  
  return code.replace(conflictRegex, (match, ours, theirs) => {
    return theirs;
  });
}

let code = fs.readFileSync('src/App.jsx', 'utf8');
code = chooseTheirs(code);
fs.writeFileSync('src/App.jsx', code);
console.log('Fixed src/App.jsx');
