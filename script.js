document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const markdownInput = document.getElementById('markdown-input');
    const cssInput = document.getElementById('css-input');
    const customCssStyle = document.getElementById('custom-css-style');
    const previewContent = document.getElementById('preview-content');
    const exportPdfButton = document.getElementById('export-pdf');

    // Initialize with sample content
    const sampleMarkdown = `# Welcome to Markdown to PDF Converter

## Features

- **Live Markdown Preview**: See your changes instantly
- **Custom CSS Styling**: Apply your own styles to the output
- **PDF Export**: Convert your styled document to PDF

## Markdown Examples

### Text Formatting

*Italic text* and **bold text**

### Lists

- Item 1
- Item 2
  - Nested item

1. First item
2. Second item

### Code

Inline \`code\` example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Images

Insert images using markdown syntax: 
![alt text](image-url)

### Links

[Visit My GitHub](https://github.com/Ahm-edAshraf)

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
`;

    const sampleCSS = `/* Custom styles for the rendered markdown */

/* Basic typography */
body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

h2 {
  color: #3498db;
}

h3 {
  color: #2980b9;
}

/* Links */
a {
  color: #3498db;
  text-decoration: none;
  border-bottom: 1px dotted #3498db;
}

a:hover {
  color: #2980b9;
  border-bottom: 1px solid #2980b9;
}

/* Code blocks */
code {
  background-color: #f7f7f7;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}

pre {
  background-color: #f7f7f7;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid #3498db;
  padding-left: 15px;
  color: #666;
  font-style: italic;
  margin-left: 0;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
}

th {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Lists */
ul, ol {
  padding-left: 30px;
}

li {
  margin-bottom: 5px;
}`;

    // Set sample content
    markdownInput.value = sampleMarkdown;
    cssInput.value = sampleCSS;

    // Convert markdown to HTML and update the preview
    function updatePreview() {
        try {
            // Convert markdown to HTML using marked
            const html = marked.parse(markdownInput.value);
            
            // Update the preview content
            previewContent.innerHTML = html;
            
            // Update custom CSS
            customCssStyle.textContent = cssInput.value;
        } catch (error) {
            console.error('Error updating preview:', error);
            previewContent.innerHTML = `<p class="error">Error rendering markdown: ${error.message}</p>`;
        }
    }

    // Export content as PDF
    function exportToPdf() {
        // Create a clone of the preview content to avoid modifying the original
        const element = previewContent.cloneNode(true);
        
        // Define options for html2pdf
        const options = {
            margin: [10, 10, 10, 10],
            filename: 'markdown-document.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Create a style element with the custom CSS
        const style = document.createElement('style');
        style.textContent = cssInput.value;
        
        // Add style to the element
        element.prepend(style);
        
        // Show loading state
        exportPdfButton.textContent = 'Generating PDF...';
        exportPdfButton.disabled = true;
        
        // Generate PDF
        html2pdf()
            .set(options)
            .from(element)
            .save()
            .then(() => {
                // Reset button state
                exportPdfButton.textContent = 'Export as PDF';
                exportPdfButton.disabled = false;
            })
            .catch(error => {
                console.error('Error generating PDF:', error);
                exportPdfButton.textContent = 'Export Failed';
                setTimeout(() => {
                    exportPdfButton.textContent = 'Export as PDF';
                    exportPdfButton.disabled = false;
                }, 2000);
            });
    }

    // Set up event listeners
    markdownInput.addEventListener('input', updatePreview);
    cssInput.addEventListener('input', updatePreview);
    exportPdfButton.addEventListener('click', exportToPdf);

    // Initial preview update
    updatePreview();
}); 