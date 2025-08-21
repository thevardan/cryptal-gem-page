import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compressJavaScript(code) {
  // For now, just return the code without compression to avoid breaking URLs and template literals
  // The current compression is breaking URLs in template literals
  return code;
}

function transpileToES5(code) {
  try {
    // Create a temporary file for Babel to process
    const tempInputFile = path.join(__dirname, '../temp-input.js');
    const tempOutputFile = path.join(__dirname, '../temp-output.js');
    
    // Write the code to temp file
    fs.writeFileSync(tempInputFile, code);
    
    // Run Babel transpilation
    execSync(`npx babel ${tempInputFile} --out-file ${tempOutputFile} --config-file ${path.join(__dirname, '../babel.config.json')}`, { stdio: 'pipe' });
    
    // Read the transpiled code
    const transpiledCode = fs.readFileSync(tempOutputFile, 'utf8');
    
    // Clean up temp files
    fs.unlinkSync(tempInputFile);
    fs.unlinkSync(tempOutputFile);
    
    return transpiledCode;
  } catch (error) {
    console.error('❌ Babel transpilation failed:', error.message);
    // Return original code if transpilation fails
    return code;
  }
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
    
    // Transpile to ES5
    const es5Code = transpileToES5(compressedCode);
    
    // Write the ES5 file
    fs.writeFileSync(outputFile, es5Code);
    
    // Copy to public folder for Vite to serve as static asset
    const publicDir = path.dirname(publicFile);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(publicFile, es5Code);
    
    // Ensure dist directory exists
    const distDir = path.dirname(distFile);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy ES5 file to dist folder
    fs.writeFileSync(distFile, es5Code);
    
    console.log('✅ JavaScript ES5 transpilation completed!');
    console.log(`📁 Original size: ${sourceCode.length} characters`);
    console.log(`📁 ES5 size: ${es5Code.length} characters`);
    console.log(`📊 Size change: ${((es5Code.length - sourceCode.length) / sourceCode.length * 100).toFixed(1)}%`);
    console.log(`📦 Copied to: ${publicFile} and ${distFile}`);
    
  } catch (error) {
    console.error('❌ Error during compression:', error.message);
    process.exit(1);
  }
}

main();
