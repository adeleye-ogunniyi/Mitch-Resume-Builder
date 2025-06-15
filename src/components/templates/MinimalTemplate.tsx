import React from 'react';
import { useResume } from '../../contexts/ResumeContext';

const MinimalTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  const formatDate = (dateString: string): string => {
    if (dateString === 'Present') return 'Present';
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 mb-1">{personal.name}</h1>
        <p className="text-sm text-slate-600">
          {personal.email} • {personal.phone} • {personal.location}
          {(personal.website || personal.linkedin) && (
            <>
              <br />
              {personal.website && <span>{personal.website}</span>}
              {personal.website && personal.linkedin && <span> • </span>}
              {personal.linkedin && <span>{personal.linkedin}</span>}
            </>
          )}
        </p>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Professional Summary</h2>
          <p className="text-sm text-slate-700">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-slate-800">{exp.position}, <span className="font-normal">{exp.company}</span></h3>
                  <span className="text-xs text-slate-500">
                    {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-slate-700 mb-1">{exp.description}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="text-xs text-slate-700 pl-5 space-y-1 list-disc">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-semibold text-slate-800">{edu.degree} in {edu.field}</h3>
                  <span className="text-xs text-slate-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  {edu.institution}{edu.gpa ? `, GPA: ${edu.gpa}` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</h2>
          <p className="text-xs text-slate-700">
            {skills.join(' • ')}
          </p>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        section.title && section.content && (
          <section key={section.id} className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">{section.title}</h2>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</div>
          </section>
        )
      ))}
    </div>
  );
};

export default MinimalTemplate;