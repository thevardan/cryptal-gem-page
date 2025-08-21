import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compressJavaScript(code) {
  return code
    // Remove single-line comments (but preserve URLs)
    .replace(/\/\/(?![^\r\n]*https?:).*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove console.log statements
    .replace(/console\.log\([^)]*\);?/g, '')
    // Remove console.error statements
    .replace(/console\.error\([^)]*\);?/g, '')
    // Remove console.warn statements
    .replace(/console\.warn\([^)]*\);?/g, '')
    // Remove console.info statements
    .replace(/console\.info\([^)]*\);?/g, '')
    // Remove console.debug statements
    .replace(/console\.debug\([^)]*\);?/g, '')
    // Remove extra whitespace and newlines (but preserve single spaces)
    .replace(/\s+/g, ' ')
    // Remove leading/trailing whitespace
    .trim();
}

function main() {
  const inputFile = path.join(__dirname, '../src/app.js');
  const outputFile = path.join(__dirname, '../src/app.min.js');
  const publicFile = path.join(__dirname, '../public/app.min.js');
  const distFile = path.join(__dirname, '../dist/app.min.js');
  
  try {
    // Read the source file
    const sourceCode = fs.readFileSync(inputFile, 'utf8');
    
    // Compress the code
    const compressedCode = compressJavaScript(sourceCode);
    
    // Write the compressed file
    fs.writeFileSync(outputFile, compressedCode);
    
    // Copy to public folder for Vite to serve as static asset
    const publicDir = path.dirname(publicFile);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(publicFile, compressedCode);
    
    // Ensure dist directory exists
    const distDir = path.dirname(distFile);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy compressed file to dist folder
    fs.writeFileSync(distFile, compressedCode);
    
    console.log('✅ JavaScript compression completed!');
    console.log(`📁 Original size: ${sourceCode.length} characters`);
    console.log(`📁 Compressed size: ${compressedCode.length} characters`);
    console.log(`📊 Compression ratio: ${((1 - compressedCode.length / sourceCode.length) * 100).toFixed(1)}%`);
    console.log(`📦 Copied to: ${publicFile} and ${distFile}`);
    
  } catch (error) {
    console.error('❌ Error during compression:', error.message);
    process.exit(1);
  }
}

main();
