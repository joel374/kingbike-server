const axios = require('axios');
const fs = require('fs');
const path = require('path');

const images = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Bicycle_mountain_bike.jpg', name: 'xtrada5.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Dahon_Speed_D7.jpg', name: 'noris2.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Left_side_of_Road_bike.jpg', name: 'sterling.jpg' }
];

async function download() {
  for (const img of images) {
    try {
      const response = await axios({
        url: img.url,
        method: 'GET',
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const writer = fs.createWriteStream(path.join(__dirname, 'public', img.name));
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      console.log(`Downloaded ${img.name}`);
    } catch (err) {
      console.error(`Failed to download ${img.name}: ${err.message}`);
    }
  }
}

download();
