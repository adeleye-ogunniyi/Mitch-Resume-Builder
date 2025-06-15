import React from 'react';
import { useResume } from '../contexts/ResumeContext';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();

  const renderTemplate = () => {
    switch (resumeData.template) {
      case 'modern':
        return <ModernTemplate />;
      case 'classic':
        return <ClassicTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      case 'executive':
        return <ExecutiveTemplate />;
      case 'tech':
        return <TechTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="bg-white shadow-inner">
      <div className="border-b border-slate-200 py-2 px-4 text-center">
        <h2 className="text-sm font-medium text-slate-600">Preview</h2>
      </div>
      <div className="p-6 overflow-auto max-h-[800px]">
        <div className="bg-white shadow-sm border border-slate-200 mx-auto" style={{ width: '100%', maxWidth: '800px' }}>
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;