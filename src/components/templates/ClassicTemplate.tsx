import React from 'react';
import { useResume } from '../../contexts/ResumeContext';

const ClassicTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  const formatDate = (dateString: string): string => {
    if (dateString === 'Present') return 'Present';
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-serif">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl uppercase font-bold text-slate-900 mb-1">{personal.name}</h1>
        <h2 className="text-lg font-medium text-slate-700 mb-2">{personal.title}</h2>
        
        <div className="text-sm text-slate-600">
          {personal.email} | {personal.phone} | {personal.location}
          {(personal.website || personal.linkedin) && (
            <>
              <br />
              {personal.website && <span>{personal.website}</span>}
              {personal.website && personal.linkedin && <span> | </span>}
              {personal.linkedin && <span>{personal.linkedin}</span>}
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase text-slate-900 mb-2 border-b-2 border-slate-300 pb-1">Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase text-slate-900 mb-3 border-b-2 border-slate-300 pb-1">Experience</h3>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-semibold text-slate-800">{exp.position}</h4>
                  <div className="text-sm text-slate-600">
                    {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                <div className="text-base font-medium text-slate-700 mb-2">{exp.company}</div>
                {exp.description && <p className="text-sm text-slate-700 mb-2">{exp.description}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="list-disc ml-5 space-y-1">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-slate-700">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase text-slate-900 mb-3 border-b-2 border-slate-300 pb-1">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold text-slate-800">{edu.institution}</h4>
                    <div className="text-sm text-slate-700">{edu.degree} in {edu.field}</div>
                    {edu.gpa && <div className="text-sm text-slate-600">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-sm text-slate-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold uppercase text-slate-900 mb-2 border-b-2 border-slate-300 pb-1">Skills</h3>
          <p className="text-sm text-slate-700">
            {skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        section.title && section.content && (
          <section key={section.id} className="mb-6">
            <h3 className="text-lg font-bold uppercase text-slate-900 mb-2 border-b-2 border-slate-300 pb-1">{section.title}</h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</div>
          </section>
        )
      ))}
    </div>
  );
};

export default ClassicTemplate;