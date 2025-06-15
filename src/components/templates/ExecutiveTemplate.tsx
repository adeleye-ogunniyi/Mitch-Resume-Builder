import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

const ExecutiveTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  const formatDate = (dateString: string): string => {
    if (dateString === 'Present') return 'Present';
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-serif bg-slate-50">
      {/* Executive Header */}
      <header className="text-center mb-8 pb-6 border-b-2 border-slate-800">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-wide">{personal.name}</h1>
        <h2 className="text-xl text-slate-700 mb-4 font-medium">{personal.title}</h2>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            {personal.email}
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            {personal.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {personal.location}
          </div>
          {personal.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {personal.website}
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-2" />
              {personal.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Executive Summary */}
      {personal.summary && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wider border-b border-slate-300 pb-2">
            Executive Summary
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-slate-800">
            <p className="text-slate-700 leading-relaxed text-lg">{personal.summary}</p>
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-300 pb-2">
            Professional Experience
          </h3>
          <div className="space-y-8">
            {experience.map((exp) => (
              <div key={exp.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{exp.position}</h4>
                    <div className="text-lg font-semibold text-slate-700">{exp.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                      {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-slate-700 mb-4 text-base leading-relaxed">{exp.description}</p>
                )}
                {exp.highlights.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-slate-800 mb-2">Key Achievements:</h5>
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-slate-700 pl-6 relative">
                          <span className="absolute left-0 top-2 w-2 h-2 bg-slate-800 rounded-full"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-300 pb-2">
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{edu.degree} in {edu.field}</h4>
                    <div className="text-base font-semibold text-slate-700">{edu.institution}</div>
                    {edu.gpa && <div className="text-slate-600 mt-1">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-300 pb-2">
            Core Competencies
          </h3>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="text-slate-700 font-medium py-2 px-4 bg-slate-50 rounded border-l-4 border-slate-800"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        section.title && section.content && (
          <section key={section.id} className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider border-b border-slate-300 pb-2">
              {section.title}
            </h3>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base">{section.content}</div>
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default ExecutiveTemplate;