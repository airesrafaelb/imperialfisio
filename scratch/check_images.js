const fs = require('fs');
const path = require('path');

function getJpegDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) {
    throw new Error('Not a valid JPEG file');
  }
  i += 2;
  while (i < buffer.length) {
    if (buffer[i] !== 0xFF) {
      throw new Error('Invalid JPEG marker');
    }
    const marker = buffer[i + 1];
    if (marker === 0xC0 || marker === 0xC2) {
      // SOF0 or SOF2
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    const length = buffer.readUInt16BE(i + 2);
    i += length + 2;
  }
  throw new Error('SOF marker not found');
}

try {
  const oldPath1 = path.join(__dirname, '../assets/facade-pacajus.jpg');
  const oldPath2 = path.join(__dirname, '../imperialfisio/assets/facade-pacajus.jpg');
  const newPath = 'C:\\Users\\rafae\\Downloads\\pacajus.jpeg';

  console.log('Old Facade 1 (Root):', getJpegDimensions(oldPath1));
  console.log('Old Facade 2 (Nested):', getJpegDimensions(oldPath2));
  console.log('New Facade:', getJpegDimensions(newPath));
} catch (err) {
  console.error(err);
}
