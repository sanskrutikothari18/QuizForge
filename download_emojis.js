const fs = require('fs');
const https = require('https');
const path = require('path');

const emojis = [
  { name: 'dog', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Dog%20face/Color/dog_face_color.svg' },
  { name: 'cat', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cat%20face/Color/cat_face_color.svg' },
  { name: 'mouse', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Mouse%20face/Color/mouse_face_color.svg' },
  { name: 'hamster', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Hamster/Color/hamster_color.svg' },
  { name: 'rabbit', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Rabbit%20face/Color/rabbit_face_color.svg' },
  { name: 'fox', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fox/Color/fox_color.svg' },
  { name: 'bear', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Bear/Color/bear_color.svg' },
  { name: 'panda', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Panda/Color/panda_color.svg' },
  { name: 'koala', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Koala/Color/koala_color.svg' },
  { name: 'tiger', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Tiger%20face/Color/tiger_face_color.svg' },
  { name: 'lion', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Lion/Color/lion_color.svg' },
  { name: 'cow', url: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Cow%20face/Color/cow_face_color.svg' }
];

const destFolder = path.join(__dirname, 'client/public/avatars');

if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder, { recursive: true });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        console.error(`Failed to download ${url}: ${response.statusCode}`);
        resolve();
      }
    }).on('error', err => {
      fs.unlink(dest, () => {});
      console.error(`Error downloading ${url}: ${err.message}`);
      resolve();
    });
  });
}

async function run() {
  for (const emoji of emojis) {
    const dest = path.join(destFolder, `${emoji.name}.svg`);
    console.log(`Downloading ${emoji.name}...`);
    await download(emoji.url, dest);
  }
  console.log('Done!');
}

run();
