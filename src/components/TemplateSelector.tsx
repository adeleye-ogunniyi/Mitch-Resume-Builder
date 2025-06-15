import React from 'react';
import { useResume } from '../contexts/ResumeContext';
import { Check, Palette, Briefcase, Code, Crown, Zap } from 'lucide-react';

const TemplateSelector: React.FC = () => {
  const { resumeData, changeTemplate } = useResume();

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and professional with a touch of color',
      icon: <Zap className="h-5 w-5" />,
      color: 'blue',
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional layout that recruiters are familiar with',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'slate',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and straightforward design',
      icon: <Crown className="h-5 w-5" />,
      color: 'gray',
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Vibrant design perfect for creative professionals',
      icon: <Palette className="h-5 w-5" />,
      color: 'purple',
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated layout for senior-level positions',
      icon: <Crown className="h-5 w-5" />,
      color: 'slate',
    },
    {
      id: 'tech',
      name: 'Tech',
      description: 'Terminal-inspired design for developers',
      icon: <Code className="h-5 w-5" />,
      color: 'green',
    },
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = 'border rounded-md p-4 cursor-pointer transition-all duration-200';
    
    if (isSelected) {
      switch (color) {
        case 'blue':
          return `${baseClasses} border-blue-600 bg-blue-50 ring-2 ring-blue-200`;
        case 'purple':
          return `${baseClasses} border-purple-600 bg-purple-50 ring-2 ring-purple-200`;
        case 'green':
          return `${baseClasses} border-green-600 bg-green-50 ring-2 ring-green-200`;
        case 'slate':
          return `${baseClasses} border-slate-600 bg-slate-50 ring-2 ring-slate-200`;
        default:
          return `${baseClasses} border-gray-600 bg-gray-50 ring-2 ring-gray-200`;
      }
    }
    
    return `${baseClasses} border-slate-200 hover:border-slate-300 hover:bg-slate-50`;
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'green': return 'text-green-600';
      case 'slate': return 'text-slate-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-slate-800 mb-4">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isSelected = resumeData.template === template.id;
          return (
            <div
              key={template.id}
              className={getColorClasses(template.color, isSelected)}
              onClick={() => changeTemplate(template.id as any)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`${getIconColor(template.color)} ${isSelected ? '' : 'opacity-70'}`}>
                  {template.icon}
                </div>
                {isSelected && (
                  <div className="bg-blue-600 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-1">{template.name}</h3>
                <p className="text-xs text-slate-500">{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center text-sm text-blue-800">
          <Crown className="h-4 w-4 mr-2 text-blue-600" />
          <span className="font-medium">Pro Tip:</span>
          <span className="ml-1">Different templates work better for different industries. Choose one that matches your field!</span>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;