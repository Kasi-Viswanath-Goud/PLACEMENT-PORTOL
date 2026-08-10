import { Jimp } from 'jimp';

async function processImage(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // For a logo with a black background, we want to make the black transparent.
    // A better approach for antialiasing is to use the lightness as alpha
    // but the logo has colors. Let's do a simple threshold with a bit of feathering if possible,
    // or just a threshold.
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate distance from white (255, 255, 255)
      const dist = Math.sqrt(Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2));
      
      if (dist < 40) {
        this.bitmap.data[idx + 3] = 0; // Fully transparent
      } else if (dist < 90) {
        // Semi-transparent for smooth edges
        this.bitmap.data[idx + 3] = Math.floor(((dist - 40) / 50) * 255);
      }
      
      // Ensure the red part is fully opaque
      const isRed = (r > 150 && g < 100 && b < 100);
      if (isRed) {
        this.bitmap.data[idx + 3] = 255;
      }
    });
    
    await image.write(outputPath);
    console.log('Image processed successfully!');
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

const input = process.argv[2];
const output = process.argv[3];
processImage(input, output);
