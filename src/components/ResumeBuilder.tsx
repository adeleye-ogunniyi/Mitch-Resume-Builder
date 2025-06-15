import React from 'react';
import { useResume } from '../contexts/ResumeContext';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';

const ResumeBuilder: React.FC = () => {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8">
      <div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <TemplateSelector />
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ResumeForm />
        </div>
      </div>
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ResumePreview />
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;