import { ResumeData } from "../contexts/ResumeContext";

export const initialResumeData: ResumeData = {
  personal: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    location: 'San Francisco, CA',
    title: 'Senior Software Engineer',
    summary: 'Experienced software engineer with a passion for building user-friendly applications. Skilled in React, TypeScript, and Node.js with 5+ years of professional experience.',
    website: 'johndoe.com',
    linkedin: 'linkedin.com/in/johndoe',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Solutions Inc.',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Led a team of 5 developers in building a new e-commerce platform.',
      highlights: [
        'Architected and implemented a React-based frontend with TypeScript',
        'Improved site performance by 40% through code optimization',
        'Implemented CI/CD pipeline using GitHub Actions',
        'Mentored junior developers on best practices and coding standards'
      ]
    },
    {
      id: '2',
      company: 'Web Innovators',
      position: 'Frontend Developer',
      startDate: '2018-03',
      endDate: '2019-12',
      description: 'Worked on various client projects as part of an agile development team.',
      highlights: [
        'Developed responsive web applications using React and Redux',
        'Collaborated with designers to implement UI/UX improvements',
        'Reduced bundle size by 30% through code splitting and lazy loading',
        'Participated in code reviews and technical planning sessions'
      ]
    }
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2014-09',
      endDate: '2018-05',
      gpa: '3.8'
    }
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'HTML/CSS',
    'Redux',
    'Git',
    'Jest',
    'Webpack',
    'Responsive Design'
  ],
  template: 'modern'
};