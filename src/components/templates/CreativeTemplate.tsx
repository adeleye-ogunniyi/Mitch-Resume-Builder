import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { Mail, Phone, MapPin, Globe, Linkedin, Star } from 'lucide-react';

const CreativeTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  const formatDate = (dateString: string): string => {
    if (dateString === 'Present') return 'Present';
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-sans bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header with Creative Design */}
      <header className="relative mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
              {personal.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{personal.name}</h1>
              <h2 className="text-xl font-light opacity-90">{personal.title}</h2>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{personal.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>{personal.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{personal.location}</span>
            </div>
            {personal.website && (
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>{personal.website}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <h3 className="text-lg font-bold text-purple-700 mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              About Me
            </h3>
            <p className="text-slate-700 leading-relaxed">{personal.summary}</p>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              E
            </div>
            Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={exp.id} className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">{exp.position}</h4>
                    <div className="text-purple-600 font-medium">{exp.company}</div>
                  </div>
                  <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && <p className="text-slate-700 mb-3">{exp.description}</p>}
                {exp.highlights.length > 0 && (
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-slate-700 pl-6 relative">
                        <span className="absolute left-0 top-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
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
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              E
            </div>
            Education
          </h3>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">{edu.degree} in {edu.field}</h4>
                    <div className="text-purple-600 font-medium">{edu.institution}</div>
                    {edu.gpa && <div className="text-slate-600 text-sm mt-1">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
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
        <section className="mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              S
            </div>
            Skills
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-full border border-purple-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {customSections.map((section) => (
        section.title && section.content && (
          <section key={section.id} className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                {section.title[0].toUpperCase()}
              </div>
              {section.title}
            </h3>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-slate-700 leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default CreativeTemplate;