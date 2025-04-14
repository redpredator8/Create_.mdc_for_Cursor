const fs = require('fs');
const path = require('path');

// Configuration
const sourceDir = process.argv[2] || './'; // Source directory, pass as first argument
const outputFile = process.argv[3] || 'combined.mdc'; // Output file, pass as second argument
const fileExtensions = ['.md', '.mdx', '.txt']; // Extensions to include, modify as needed

// Create a stream to write to the output file
const outputStream = fs.createWriteStream(outputFile);

// Track processed files for logging
let fileCount = 0;

// Function to process directory recursively
function processDirectory(directoryPath) {
  const items = fs.readdirSync(directoryPath);
  
  // Process all items in the directory
  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(itemPath);
    } else if (stats.isFile() && fileExtensions.some(ext => itemPath.endsWith(ext))) {
      // Process file if it has one of the target extensions
      const content = fs.readFileSync(itemPath, 'utf8');
      
      // Add file header and content to the output file
      outputStream.write(`\n\n## File: ${itemPath}\n\n`);
      outputStream.write(content);
      
      fileCount++;
      console.log(`Processed: ${itemPath}`);
    }
  });
}

console.log(`Starting to combine files from ${sourceDir} into ${outputFile}`);
processDirectory(sourceDir);
outputStream.end();

console.log(`Completed! Combined ${fileCount} files into ${outputFile}`);


// Run the script with the source directory and output file
// node create_mdc.js ./source_directory output_file.mdc

