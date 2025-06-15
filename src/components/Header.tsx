import React, { useEffect, useState } from 'react';
import { Download, Wand2, Users } from 'lucide-react';
import { useResume } from '../contexts/ResumeContext';
import { generatePDF } from '../utils/pdfGenerator';
import { useToast } from './ui/useToast';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
  const { resumeData } = useResume();
  const { toast } = useToast();
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVisitorCount = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('visitors')
          .select('count')
          .eq('id', '00000000-0000-0000-0000-000000000000')
          .single();

        if (error) throw error;
        
        if (isMounted) {
          setVisitorCount(data.count);
          await incrementVisitorCount();
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching visitor count:', err);
          setError('Failed to load visitor count');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVisitorCount();

    return () => {
      isMounted = false;
    };
  }, []);

  const incrementVisitorCount = async () => {
    try {
      const { error } = await supabase.rpc('increment_visitor_count');
      
      if (error) throw error;

      setVisitorCount(prev => prev + 1);
    } catch (err) {
      console.error('Error incrementing visitor count:', err);
    }
  };

  const handleDownload = async () => {
    try {
      await generatePDF(resumeData);
      toast({
        title: 'Resume downloaded',
        description: 'Your resume has been exported to PDF',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <div className="text-blue-600 mr-2">
            <Wand2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Resume Builder</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md shadow-sm hover:bg-blue-700 transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </button>

          <div className="flex items-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-md min-w-[100px] justify-center">
            <Users className="h-4 w-4 mr-1 text-blue-600" />
            {isLoading ? (
              <div className="h-4 w-8 bg-slate-200 animate-pulse rounded"></div>
            ) : error ? (
              <span className="text-red-600">-</span>
            ) : (
              <>
                <span className="text-blue-600 font-semibold">
                  {visitorCount.toLocaleString()}
                </span>
                <span className="ml-1">visitors</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;