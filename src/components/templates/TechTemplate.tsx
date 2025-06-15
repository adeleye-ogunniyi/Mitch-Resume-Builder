import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { Mail, Phone, MapPin, Globe, Linkedin, Code, Database, Server } from 'lucide-react';

const TechTemplate: React.FC = () => {
  const { resumeData } = useResume();
  const { personal, experience, education, skills, customSections } = resumeData;

  const formatDate = (dateString: string): string => {
    if (dateString === 'Present') return 'Present';
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8 font-mono bg-slate-900 text-green-400">
      {/* Terminal-style Header */}
      <header className="mb-8">
        <div className="bg-black rounded-lg p-6 border border-green-500 shadow-lg">
          <div className="flex items-center mb-4">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-green-300 text-sm">terminal@resume:~$</span>
          </div>
          
          <div className="space-y-2">
            <div className="text-green-300">
              <span className="text-green-500">$</span> whoami
            </div>
            <h1 className="text-2xl font-bold text-white">{personal.name}</h1>
            <div className="text-green-300">
              <span className="text-green-500">$</span> cat role.txt
            </div>
            <h2 className="text-lg text-green-400">{personal.title}</h2>
          </div>
          
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-300">email:</span>
              <span className="ml-2 text-white">{personal.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-300">phone:</span>
              <span className="ml-2 text-white">{personal.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-green-300">location:</span>
              <span className="ml-2 text-white">{personal.location}</span>
            </div>
            {personal.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-green-300">website:</span>
                <span className="ml-2 text-white">{personal.website}</span>
              </div>
            )}
            {personal.linkedin && (
              <div className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-green-300">linkedin:</span>
                <span className="ml-2 text-white">{personal.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-green-500">
            <div className="flex items-center mb-3">
              <Code className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="text-lg font-bold text-green-400">// About</h3>
            </div>
            <p className="text-green-300 leading-relaxed">{personal.summary}</p>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Server className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="text-lg font-bold text-green-400">// Experience</h3>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={exp.id} className="bg-slate-800 rounded-lg p-6 border border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-bold">{exp.position}</h4>
                    <div className="text-green-400">{exp.company}</div>
                  </div>
                  <div className="text-green-300 text-sm bg-slate-700 px-3 py-1 rounded">
                    {formatDate(exp.startDate)} - {exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-green-300 mb-3">{exp.description}</p>
                )}
                {exp.highlights.length > 0 && (
                  <div>
                    <div className="text-green-400 mb-2">// Achievements:</div>
                    <ul className="space-y-1">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="text-green-300 pl-4 relative">
                          <span className="absolute left-0 text-green-500"></span>
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
          <div className="flex items-center mb-4">
            <Database className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="text-lg font-bold text-green-400">// Education</h3>
          </div>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="bg-slate-800 rounded-lg p-6 border border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">{edu.degree} in {edu.field}</h4>
                    <div className="text-green-400">{edu.institution}</div>
                    {edu.gpa && <div className="text-green-300 text-sm mt-1">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="text-green-300 text-sm bg-slate-700 px-3 py-1 rounded">
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
          <div className="flex items-center mb-4">
            <Code className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="text-lg font-bold text-green-400">// Skills</h3>
          </div>
          <div className="bg-slate-800 rounded-lg p-6 border border-green-500">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-black text-green-400 text-sm font-medium px-3 py-2 rounded border border-green-600"
                >
                  <span className="text-green-500"></span> {skill}
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
            <div className="flex items-center mb-4">
              <Code className="h-5 w-5 mr-2 text-green-500" />
              <h3 className="text-lg font-bold text-green-400">// {section.title}</h3>
            </div>
            <div className="bg-slate-800 rounded-lg p-6 border border-green-500">
              <div className="text-green-300 leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          </section>
        )
      ))}
    </div>
  );
};

export default TechTemplate;