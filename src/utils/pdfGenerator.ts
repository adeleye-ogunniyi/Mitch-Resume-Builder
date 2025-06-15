import { ResumeData } from '../contexts/ResumeContext';

export const generatePDF = async (resumeData: ResumeData): Promise<void> => {
  // In a real application, this would use a PDF generation library
  // For this demo, we'll simulate PDF generation by opening a print dialog
  
  // Create a temporary iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Get the document inside the iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  
  if (!iframeDoc) {
    alert('Unable to generate PDF. Please try again.');
    return;
  }
  
  // Create a simplified HTML representation of the resume
  const createResumeHTML = () => {
    const { personal, experience, education, skills, template } = resumeData;
    
    // Add custom CSS based on template
    const templateStyles = `
      body {
        font-family: ${template === 'classic' ? 'Georgia, serif' : 'Arial, sans-serif'};
        padding: 20px;
        margin: 0;
        color: #333;
        line-height: 1.5;
      }
      h1 { font-size: 24px; margin-bottom: 4px; }
      h2 { font-size: 18px; margin-bottom: 8px; color: ${template === 'modern' ? '#3B82F6' : '#333'}; }
      h3 { font-size: 16px; margin-bottom: 6px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
      .header { ${template === 'classic' ? 'text-align: center;' : ''} margin-bottom: 20px; }
      .section { margin-bottom: 20px; }
      .item { margin-bottom: 12px; }
      .item-header { display: flex; justify-content: space-between; }
      .item-title { font-weight: bold; }
      .item-subtitle { ${template === 'modern' ? 'color: #3B82F6;' : ''} }
      .item-date { font-size: 14px; color: #666; }
      .item-description { margin-top: 4px; font-size: 14px; }
      .highlights { margin-top: 8px; padding-left: 20px; }
      .highlights li { margin-bottom: 4px; font-size: 14px; }
      .skills { display: flex; flex-wrap: wrap; gap: 8px; }
      .skill { ${template === 'modern' ? 'background-color: #EFF6FF; color: #1E40AF;' : ''} 
               padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    `;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${personal.name} - Resume</title>
        <style>${templateStyles}</style>
      </head>
      <body>
        <div class="header">
          <h1>${personal.name}</h1>
          <h2>${personal.title}</h2>
          <div>${personal.email} | ${personal.phone} | ${personal.location}</div>
          ${personal.website || personal.linkedin ? 
            `<div>${personal.website ? personal.website : ''}
                  ${personal.website && personal.linkedin ? ' | ' : ''}
                  ${personal.linkedin ? personal.linkedin : ''}</div>` : ''}
        </div>
        
        ${personal.summary ? `
        <div class="section">
          <h3>Professional Summary</h3>
          <div>${personal.summary}</div>
        </div>` : ''}
        
        ${experience.length > 0 ? `
        <div class="section">
          <h3>Experience</h3>
          ${experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.position}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-date">
                  ${formatDate(exp.startDate)} - ${exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
              ${exp.highlights.length > 0 ? `
                <ul class="highlights">
                  ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>` : ''}
            </div>
          `).join('')}
        </div>` : ''}
        
        ${education.length > 0 ? `
        <div class="section">
          <h3>Education</h3>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree} in ${edu.field}</div>
                  <div class="item-subtitle">${edu.institution}</div>
                  ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
                </div>
                <div class="item-date">
                  ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                </div>
              </div>
            </div>
          `).join('')}
        </div>` : ''}
        
        ${skills.length > 0 ? `
        <div class="section">
          <h3>Skills</h3>
          ${template === 'modern' ? `
          <div class="skills">
            ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
          </div>` : `<div>${skills.join(' • ')}</div>`}
        </div>` : ''}
      </body>
      </html>
    `;
  };
  
  const formatDate = (dateString: string): string => {
    if (dateString === 'Present' || !dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Write the HTML content to the iframe
  iframeDoc.open();
  iframeDoc.write(createResumeHTML());
  iframeDoc.close();
  
  // Wait for the content to load
  setTimeout(() => {
    // Print the iframe content
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    
    // Clean up after printing
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 100);
  }, 500);
};