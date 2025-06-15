import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wand2, FileText, Download, Sparkles } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/builder');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
              Create Professional Resumes in Minutes
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Build beautiful, ATS-friendly resumes with our easy-to-use builder. Stand out from the crowd and land your dream job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <Link
                to="/pricing"
                className="bg-white text-slate-800 px-8 py-3 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why Choose Our Resume Builder?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Wand2 className="h-6 w-6" />}
              title="AI-Powered"
              description="Get smart suggestions to enhance your resume content and stand out."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Multiple Formats"
              description="Export your resume in PDF, Word, or PNG formats."
            />
            <FeatureCard
              icon={<Download className="h-6 w-6" />}
              title="Easy Export"
              description="Download your resume in multiple formats with one click."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Premium Templates"
              description="Access beautiful, professionally designed templates."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

export default Landing;