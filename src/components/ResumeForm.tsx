import React, { useState } from 'react';
import { useResume } from '../contexts/ResumeContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, Star, Zap, BriefcaseIcon, GraduationCapIcon, UserIcon, TagIcon, FileTextIcon, X, Crown, Lock } from 'lucide-react';
import { getAIImprovement } from '../utils/aiHelpers';
import { useToast } from './ui/useToast';
import AuthModal from './AuthModal';

const ResumeForm: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { 
    resumeData, 
    updatePersonalInfo, 
    addExperienceItem,
    updateExperienceItem,
    removeExperienceItem,
    addEducationItem,
    updateEducationItem,
    removeEducationItem,
    addSkill,
    removeSkill,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    activeSection,
    setActiveSection
  } = useResume();

  const [newSkill, setNewSkill] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [improvingField, setImprovingField] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePremiumFeature = async (callback: () => void) => {
    if (!user) {
      toast({
        title: 'Premium Feature',
        description: 'Please sign in to use AI enhancement features',
        variant: 'destructive',
      });
      setIsAuthModalOpen(true);
      return;
    }
    
    // Show premium upgrade prompt for free users
    toast({
      title: 'Premium Feature',
      description: 'AI enhancement is available with Premium plans. Upgrade to unlock this feature!',
      variant: 'destructive',
    });
    return;
  };

  const handleImproveField = async (
    section: string, 
    field: string, 
    value: string,
    index?: number
  ) => {
    handlePremiumFeature(async () => {
      setImprovingField(`${section}-${field}-${index ?? 'personal'}`);
      
      try {
        const improvedText = await getAIImprovement(value, field);
        
        if (section === 'personal') {
          updatePersonalInfo(field, improvedText);
        } else if (section === 'experience' && typeof index === 'number') {
          updateExperienceItem(index, field, improvedText);
        } else if (section === 'education' && typeof index === 'number') {
          updateEducationItem(index, field, improvedText);
        } else if (section === 'custom' && typeof index === 'number') {
          updateCustomSection(index, field as 'title' | 'content', improvedText);
        }

        toast({
          title: 'AI Improvement Applied',
          description: 'Your content has been enhanced by AI',
        });
      } catch (error) {
        toast({
          title: 'AI Improvement Failed',
          description: 'Unable to improve the content at this time',
          variant: 'destructive',
        });
      } finally {
        setImprovingField(null);
      }
    });
  };

  const handleAddCustomSection = () => {
    if (newSectionTitle.trim() === '') {
      toast({
        title: 'Section title required',
        description: 'Please enter a title for the new section',
        variant: 'destructive',
      });
      return;
    }
    
    addCustomSection(newSectionTitle.trim());
    setNewSectionTitle('');
    toast({
      title: 'Section added',
      description: `"${newSectionTitle}" section has been added to your resume`,
    });
  };

  const PremiumFeatureButton = ({ onClick, isImproving, fieldId }: { 
    onClick: () => void; 
    isImproving: boolean; 
    fieldId: string;
  }) => (
    <button 
      onClick={onClick}
      className="text-xs flex items-center text-amber-600 hover:text-amber-800 transition-colors bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-full border border-amber-200"
      disabled={isImproving}
    >
      {isImproving ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Improving...
        </span>
      ) : (
        <>
          <Crown className="h-3 w-3 mr-1" />
          <Zap className="h-3 w-3 mr-1" />
          AI Enhance
        </>
      )}
    </button>
  );

  const renderPersonalSection = () => (
    <div className="space-y-4">
      {/* Premium Features Banner */}
      {user && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              <div>
                <h3 className="font-medium text-slate-900">Unlock Premium Features</h3>
                <p className="text-sm text-slate-600">AI enhancement, unlimited exports, and more!</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={resumeData.personal.name}
            onChange={(e) => updatePersonalInfo('name', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input
            type="text"
            value={resumeData.personal.title}
            onChange={(e) => updatePersonalInfo('title', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={resumeData.personal.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="tel"
            value={resumeData.personal.phone}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            value={resumeData.personal.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website (optional)</label>
          <input
            type="url"
            value={resumeData.personal.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn (optional)</label>
        <input
          type="url"
          value={resumeData.personal.linkedin || ''}
          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-700">Professional Summary</label>
          <PremiumFeatureButton
            onClick={() => handleImproveField('personal', 'summary', resumeData.personal.summary)}
            isImproving={improvingField === 'personal-summary-personal'}
            fieldId="personal-summary"
          />
        </div>
        <textarea
          value={resumeData.personal.summary}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          rows={4}
          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderExperienceSection = () => (
    <div className="space-y-6">
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="border border-slate-200 rounded-md p-4 relative">
          <div className="absolute right-2 top-2">
            <button
              onClick={() => removeExperienceItem(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Remove experience"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperienceItem(index, 'company', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperienceItem(index, 'position', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperienceItem(index, 'startDate', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperienceItem(index, 'endDate', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Present"
              />
            </div>
          </div>

          <div className="mb-4 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <PremiumFeatureButton
                onClick={() => handleImproveField('experience', 'description', exp.description, index)}
                isImproving={improvingField === `experience-description-${index}`}
                fieldId={`experience-description-${index}`}
              />
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperienceItem(index, 'description', e.target.value)}
              rows={2}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Key Highlights (one per line)</label>
              <PremiumFeatureButton
                onClick={() => handleImproveField('experience', 'highlights', exp.highlights.join('\n'), index)}
                isImproving={improvingField === `experience-highlights-${index}`}
                fieldId={`experience-highlights-${index}`}
              />
            </div>
            <textarea
              value={exp.highlights.join('\n')}
              onChange={(e) => updateExperienceItem(index, 'highlights', e.target.value)}
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="• Implemented feature X resulting in Y outcome"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addExperienceItem}
        className="flex items-center justify-center w-full py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors mt-4"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Experience
      </button>
    </div>
  );

  const renderEducationSection = () => (
    <div className="space-y-6">
      {resumeData.education.map((edu, index) => (
        <div key={edu.id} className="border border-slate-200 rounded-md p-4 relative">
          <div className="absolute right-2 top-2">
            <button
              onClick={() => removeEducationItem(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Remove education"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducationItem(index, 'institution', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducationItem(index, 'degree', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducationItem(index, 'field', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">GPA (optional)</label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducationItem(index, 'gpa', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducationItem(index, 'startDate', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducationItem(index, 'endDate', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducationItem}
        className="flex items-center justify-center w-full py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors mt-4"
      >
        <Plus className="h-4 w-4 mr-1" /> Add Education
      </button>
    </div>
  );

  const renderSkillsSection = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {resumeData.skills.map((skill, index) => (
          <div 
            key={index}
            className="flex items-center bg-slate-100 px-3 py-1 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => removeSkill(index)}
              className="ml-2 text-slate-500 hover:text-red-500 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 p-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a skill (e.g., JavaScript, Project Management)"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addSkill(newSkill);
              setNewSkill('');
            }
          }}
        />
        <button
          onClick={() => {
            addSkill(newSkill);
            setNewSkill('');
          }}
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Popular Skills</h3>
        <div className="flex flex-wrap gap-2">
          {['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'Project Management', 'UI/UX Design', 'Agile', 'Communication'].map((skill) => (
            !resumeData.skills.includes(skill) && (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="flex items-center bg-white border border-slate-300 px-3 py-1 rounded-full text-sm hover:bg-slate-50 transition-colors"
              >
                <Plus className="h-3 w-3 mr-1" /> {skill}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomSections = () => (
    <div className="space-y-6">
      {resumeData.customSections.map((section, index) => (
        <div key={section.id} className="border border-slate-200 rounded-md p-4 relative">
          <div className="absolute right-2 top-2">
            <button
              onClick={() => removeCustomSection(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Remove section"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Section Title</label>
              <PremiumFeatureButton
                onClick={() => handleImproveField('custom', 'title', section.title, index)}
                isImproving={improvingField === `custom-title-${index}`}
                fieldId={`custom-title-${index}`}
              />
            </div>
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Certifications, Projects, Awards"
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Content</label>
              <PremiumFeatureButton
                onClick={() => handleImproveField('custom', 'content', section.content, index)}
                isImproving={improvingField === `custom-content-${index}`}
                fieldId={`custom-content-${index}`}
              />
            </div>
            <textarea
              value={section.content}
              onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
              rows={4}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add content for this section..."
            />
          </div>
        </div>
      ))}

      <div className="border border-dashed border-slate-300 rounded-md p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Add New Section</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1 p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Section title (e.g., Certifications, Projects, Awards)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCustomSection();
              }
            }}
          />
          <button
            onClick={handleAddCustomSection}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </button>
        </div>
        
        <div className="mt-3">
          <p className="text-xs text-slate-500 mb-2">Quick add popular sections:</p>
          <div className="flex flex-wrap gap-2">
            {['Certifications', 'Projects', 'Awards', 'Publications', 'Languages', 'Volunteer Work', 'Hobbies'].map((title) => (
              <button
                key={title}
                onClick={() => {
                  setNewSectionTitle(title);
                  addCustomSection(title);
                  setNewSectionTitle('');
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition-colors"
              >
                + {title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabClasses = "flex items-center px-4 py-3 text-sm font-medium focus:outline-none";
  const activeTabClasses = "border-b-2 border-blue-600 text-blue-600";
  const inactiveTabClasses = "text-slate-600 hover:text-slate-800 hover:bg-slate-50";

  return (
    <>
      <div>
        <div className="flex border-b overflow-x-auto">
          <button
            className={`${tabClasses} ${activeSection === 'personal' ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveSection('personal')}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Personal
          </button>
          <button
            className={`${tabClasses} ${activeSection === 'experience' ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveSection('experience')}
          >
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Experience
          </button>
          <button
            className={`${tabClasses} ${activeSection === 'education' ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveSection('education')}
          >
            <GraduationCapIcon className="h-4 w-4 mr-2" />
            Education
          </button>
          <button
            className={`${tabClasses} ${activeSection === 'skills' ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveSection('skills')}
          >
            <TagIcon className="h-4 w-4 mr-2" />
            Skills
          </button>
          <button
            className={`${tabClasses} ${activeSection === 'custom' ? activeTabClasses : inactiveTabClasses}`}
            onClick={() => setActiveSection('custom')}
          >
            <FileTextIcon className="h-4 w-4 mr-2" />
            Custom Sections
            {resumeData.customSections.length > 0 && (
              <span className="ml-1 bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full">
                {resumeData.customSections.length}
              </span>
            )}
          </button>
        </div>
        
        <div className="p-6">
          {activeSection === 'personal' && renderPersonalSection()}
          {activeSection === 'experience' && renderExperienceSection()}
          {activeSection === 'education' && renderEducationSection()}
          {activeSection === 'skills' && renderSkillsSection()}
          {activeSection === 'custom' && renderCustomSections()}
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default ResumeForm;