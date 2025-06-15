import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

const ModernTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">{personal.name}</h1>
        <h2 className="text-lg font-medium text-blue-600 mb-3">{personal.title}</h2>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-600">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1 text-slate-400" />
            {personal.email}
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-1 text-slate-400" />
            {personal.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-slate-400" />
            {personal.location}
          </div>
          {personal.website && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1 text-slate-400" />
              {personal.website}
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center">
              <Linkedin className="h-4 w-4 mr-1 text-slate-400" />
              {personal.linkedin}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h3 className="text-md font-semibold text-slate-800 border-b border-slate-200 pb-1 mb-2">Professional Summary</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-md font-semibold text-slate-800 border-b border-slate-200 pb-1 mb-3">Professional Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-slate-800">{exp.position}</h4>
                  <div className="text-xs text-slate-600">
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                    {exp.endDate === 'Present' ? ' Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium">{exp.company}</div>
                {exp.description && <p className="text-sm text-slate-700 mt-1">{exp.description}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-slate-700 pl-4 relative">
                        <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
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
          <h3 className="text-md font-semibold text-slate-800 border-b border-slate-200 pb-1 mb-3">Education</h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-slate-800">{edu.degree} in {edu.field}</h4>
                  <div className="text-xs text-slate-600">
                    {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                    {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium">{edu.institution}</div>
                {edu.gpa && <div className="text-sm text-slate-700 mt-1">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h3 className="text-md font-semibold text-slate-800 border-b border-slate-200 pb-1 mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        section.title && section.content && (
          <section key={section.id} className="mb-6">
            <h3 className="text-md font-semibold text-slate-800 border-b border-slate-200 pb-1 mb-3">{section.title}</h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</div>
          </section>
        )
      ))}
    </div>
  );
};

export default ModernTemplate;