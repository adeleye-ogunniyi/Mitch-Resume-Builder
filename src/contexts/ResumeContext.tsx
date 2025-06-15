import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialResumeData } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

export type Section = 'personal' | 'experience' | 'education' | 'skills' | 'custom';

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
    website?: string;
    linkedin?: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  customSections: CustomSection[];
  template: 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'tech';
}

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  addExperienceItem: () => void;
  updateExperienceItem: (index: number, field: string, value: string) => void;
  removeExperienceItem: (index: number) => void;
  addEducationItem: () => void;
  updateEducationItem: (index: number, field: string, value: string) => void;
  removeEducationItem: (index: number) => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  addCustomSection: (title: string) => void;
  updateCustomSection: (index: number, field: 'title' | 'content', value: string) => void;
  removeCustomSection: (index: number) => void;
  changeTemplate: (template: 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'tech') => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const STORAGE_KEY = 'resumeData';

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Add customSections if it doesn't exist in saved data
        if (!parsed.customSections) {
          parsed.customSections = [];
        }
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved resume data', error);
        return { ...initialResumeData, customSections: [] };
      }
    }
    return { ...initialResumeData, customSections: [] };
  });
  
  const [activeSection, setActiveSection] = useState<Section>('personal');

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const addExperienceItem = () => {
    const newItem: ExperienceItem = {
      id: uuidv4(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      highlights: ['']
    };

    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newItem]
    }));
  };

  const updateExperienceItem = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const updatedExperience = [...prev.experience];
      if (field === 'highlights') {
        updatedExperience[index] = {
          ...updatedExperience[index],
          highlights: value.split('\n').filter(h => h.trim() !== '')
        };
      } else {
        updatedExperience[index] = {
          ...updatedExperience[index],
          [field]: value
        };
      }
      return {
        ...prev,
        experience: updatedExperience
      };
    });
  };

  const removeExperienceItem = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducationItem = () => {
    const newItem: EducationItem = {
      id: uuidv4(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };

    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newItem]
    }));
  };

  const updateEducationItem = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const updatedEducation = [...prev.education];
      updatedEducation[index] = {
        ...updatedEducation[index],
        [field]: value
      };
      return {
        ...prev,
        education: updatedEducation
      };
    });
  };

  const removeEducationItem = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() === '' || resumeData.skills.includes(skill.trim())) return;
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, skill.trim()]
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCustomSection = (title: string) => {
    const newSection: CustomSection = {
      id: uuidv4(),
      title,
      content: ''
    };

    setResumeData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
  };

  const updateCustomSection = (index: number, field: 'title' | 'content', value: string) => {
    setResumeData(prev => {
      const updatedSections = [...prev.customSections];
      updatedSections[index] = {
        ...updatedSections[index],
        [field]: value
      };
      return {
        ...prev,
        customSections: updatedSections
      };
    });
  };

  const removeCustomSection = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== index)
    }));
  };

  const changeTemplate = (template: 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'tech') => {
    setResumeData(prev => ({
      ...prev,
      template
    }));
  };

  // Auto-save whenever resumeData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  return (
    <ResumeContext.Provider
      value={{
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
        changeTemplate,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};