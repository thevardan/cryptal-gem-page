import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compressJavaScript(code) {
  return code
    // Remove single-line comments
    .replace(/\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace and newlines
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators
    .replace(/\s*([{}();,=+\-*/<>!&|])\s*/g, '$1')
    // Remove whitespace at start/end of lines
    .replace(/^\s+|\s+$/gm, '')
    // Remove empty lines
    .replace(/\n\s*\n/g, '\n')
    // Remove trailing semicolons before closing braces
    .replace(/;}/g, '}')
    // Remove whitespace around colons in objects
    .replace(/\s*:\s*/g, ':')
    // Remove whitespace around commas
    .replace(/\s*,\s*/g, ',')
    // Remove whitespace around parentheses
    .replace(/\s*\(\s*/g, '(')
    .replace(/\s*\)\s*/g, ')')
    // Remove whitespace around brackets
    .replace(/\s*\[\s*/g, '[')
    .replace(/\s*\]\s*/g, ']')
    // Remove whitespace around braces
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // Remove console.log statements for production
    .replace(/console\.log\([^)]*\);?/g, '')
    // Remove console.error statements for production
    .replace(/console\.error\([^)]*\);?/g, '')
    // Clean up any remaining multiple spaces
    .replace(/\s{2,}/g, ' ')
    // Remove leading/trailing whitespace
    .trim();
}

function main() {
  const inputFile = path.join(__dirname, '../src/app.js');
  const outputFile = path.join(__dirname, '../src/app.min.js');
  const distFile = path.join(__dirname, '../dist/app.min.js');
  
  try {
    // Read the source file
    const sourceCode = fs.readFileSync(inputFile, 'utf8');
    
    // Compress the code
    const compressedCode = compressJavaScript(sourceCode);
    
    // Write the compressed file
    fs.writeFileSync(outputFile, compressedCode);
    
    // Update the original file with compressed version
    fs.writeFileSync(inputFile, compressedCode);
    
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
    console.log(`📦 Copied to: ${distFile}`);
    
  } catch (error) {
    console.error('❌ Error during compression:', error.message);
    process.exit(1);
  }
}

main();
