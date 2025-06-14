# Technical Documentation - Mitch Resume Builder

## Architecture Overview

The Mitch Resume Builder is a modern single-page application (SPA) built with React and TypeScript, leveraging Supabase for backend services. The application follows a component-based architecture with clear separation of concerns.

## Core Architecture Patterns

### 1. Context-Based State Management
The application uses React Context for global state management:

```typescript
// ResumeContext.tsx - Manages resume data and operations
interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  addExperienceItem: () => void;
  // ... other operations
}

// AuthContext.tsx - Manages authentication state
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  // ... other auth operations
}
```

### 2. Component Composition
Components are designed for reusability and maintainability:

```typescript
// Template pattern for resume layouts
interface TemplateProps {
  resumeData: ResumeData;
}

// Higher-order component for route protection
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}
```

## Data Flow Architecture

### 1. Resume Data Management
```
User Input → ResumeForm → ResumeContext → Local Storage
                ↓
            ResumePreview ← Template Components
```

### 2. Authentication Flow
```
User Action → AuthModal → Supabase Auth → AuthContext → Protected Routes
```

### 3. Database Operations
```
Frontend → Supabase Client → PostgreSQL → Row Level Security → Response
```

## Component Architecture

### 1. Page Components
Located in `src/pages/`, these are top-level route components:
- `Landing.tsx` - Marketing and feature showcase
- `Builder.tsx` - Main resume building interface
- `Account.tsx` - User profile and subscription management
- `Admin.tsx` - Administrative interface
- `Pricing.tsx` - Subscription plans and payment

### 2. Feature Components
Located in `src/components/`, these handle specific functionality:
- `ResumeBuilder.tsx` - Orchestrates the building experience
- `ResumeForm.tsx` - Form interface for editing resume data
- `ResumePreview.tsx` - Real-time preview of resume
- `TemplateSelector.tsx` - Template selection interface

### 3. Template Components
Located in `src/components/templates/`, these render resume layouts:
- `ModernTemplate.tsx` - Contemporary design with icons
- `ClassicTemplate.tsx` - Traditional formal layout
- `MinimalTemplate.tsx` - Clean, space-efficient design

### 4. UI Components
Located in `src/components/ui/`, these are reusable interface elements:
- `Toaster.tsx` - Notification system
- `useToast.tsx` - Toast notification hook

## Data Models

### 1. Resume Data Structure
```typescript
interface ResumeData {
  personal: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  customSections: CustomSection[];
  template: 'modern' | 'classic' | 'minimal';
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  website?: string;
  linkedin?: string;
}

interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  highlights: string[];
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}
```

### 2. Database Schema Design

#### Profiles Table
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  subscription_end_date timestamptz,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Resumes Table
```sql
CREATE TABLE resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  data jsonb NOT NULL,
  last_modified timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

## Security Implementation

### 1. Row Level Security (RLS)
All tables implement RLS policies:

```sql
-- Users can only access their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can manage all tokens
CREATE POLICY "Admins can manage all tokens"
  ON tokens
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
```

### 2. Route Protection
```typescript
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireAuth = false
}) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (requireAuth && !user) return <Navigate to="/" />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};
```

## State Management Patterns

### 1. Resume Context Implementation
```typescript
export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Load from localStorage with fallback to initial data
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : initialResumeData;
  });

  // Auto-save with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  // Provide context value
  return (
    <ResumeContext.Provider value={{
      resumeData,
      updatePersonalInfo,
      addExperienceItem,
      // ... other operations
    }}>
      {children}
    </ResumeContext.Provider>
  );
};
```

### 2. Authentication Context
```typescript
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) checkAdminStatus(session.user.id);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
```

## Performance Optimizations

### 1. Component Optimization
```typescript
// Memoized template components
const ModernTemplate = React.memo(() => {
  const { resumeData } = useResume();
  // Template rendering logic
});

// Optimized form updates
const updateExperienceItem = useCallback((index: number, field: string, value: string) => {
  setResumeData(prev => {
    const updatedExperience = [...prev.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    return { ...prev, experience: updatedExperience };
  });
}, []);
```

### 2. Bundle Optimization
```typescript
// Vite configuration for optimal bundling
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // Prevent pre-bundling of icon library
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

## API Integration Patterns

### 1. Supabase Client Configuration
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 2. Database Operations
```typescript
// Type-safe database operations
const fetchUserResumes = async (userId: string): Promise<Resume[]> => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('last_modified', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Real-time subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('resume_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'resumes' },
      (payload) => {
        // Handle real-time updates
      }
    )
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

## Error Handling Strategy

### 1. Global Error Boundaries
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. API Error Handling
```typescript
const handleApiError = (error: any): string => {
  if (error?.message) return error.message;
  if (error?.error_description) return error.error_description;
  return 'An unexpected error occurred';
};

// Usage in components
try {
  await apiOperation();
  toast({ title: 'Success', description: 'Operation completed' });
} catch (error) {
  toast({
    title: 'Error',
    description: handleApiError(error),
    variant: 'destructive'
  });
}
```

## Testing Strategy

### 1. Component Testing
```typescript
// Example test structure
describe('ResumeForm', () => {
  it('should update personal information', () => {
    render(<ResumeForm />);
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should add new experience item', () => {
    render(<ResumeForm />);
    const addButton = screen.getByText('Add Experience');
    fireEvent.click(addButton);
    expect(screen.getByText('Company')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing
```typescript
// Database integration tests
describe('Resume Operations', () => {
  it('should save resume to database', async () => {
    const resume = createMockResume();
    const result = await saveResume(resume);
    expect(result.id).toBeDefined();
    expect(result.title).toBe(resume.title);
  });
});
```

## Deployment Architecture

### 1. Build Process
```bash
# Production build
npm run build

# Build output structure
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── vite.svg
```

### 2. Environment Configuration
```typescript
// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
  },
};

export default config[import.meta.env.MODE];
```

## Monitoring and Analytics

### 1. Performance Monitoring
```typescript
// Performance tracking
const trackPageLoad = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
  
  // Send to analytics service
  analytics.track('page_load', { loadTime });
};
```

### 2. User Analytics
```typescript
// User interaction tracking
const trackResumeAction = (action: string, metadata?: object) => {
  analytics.track('resume_action', {
    action,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
```

## Maintenance and Updates

### 1. Dependency Management
```json
{
  "scripts": {
    "audit": "npm audit",
    "update-deps": "npm update",
    "check-outdated": "npm outdated"
  }
}
```

### 2. Database Migrations
```sql
-- Migration naming convention: YYYYMMDDHHMMSS_description.sql
-- Example: 20240101120000_add_custom_sections.sql

-- Always include rollback instructions
-- Use IF EXISTS/IF NOT EXISTS for safety
-- Test migrations on staging first
```

This technical documentation provides a comprehensive overview of the application's architecture, patterns, and implementation details for developers working on the project.