# Mitch Resume Builder (MRB)

A modern, feature-rich resume builder application built with React, TypeScript, and Supabase. Create professional resumes with AI-powered enhancements, multiple templates, and custom sections.

## 🚀 Features

### Core Features
- **Multiple Templates**: Modern, Classic, and Minimal designs
- **Real-time Preview**: See changes instantly as you edit
- **Auto-save**: Your work is automatically saved to local storage
- **PDF Export**: Download your resume as a PDF
- **Responsive Design**: Works perfectly on desktop and mobile

### Advanced Features
- **AI-Powered Enhancements**: Improve your content with AI suggestions (Premium)
- **Custom Sections**: Add unlimited custom sections (Certifications, Projects, etc.)
- **User Authentication**: Save and manage multiple resumes
- **Admin Panel**: Token management and analytics
- **Visitor Analytics**: Track site usage

### Section Management
- **Personal Information**: Name, contact details, professional summary
- **Experience**: Work history with descriptions and key highlights
- **Education**: Academic background with GPA support
- **Skills**: Tag-based skill management with popular suggestions
- **Custom Sections**: Unlimited additional sections for any content

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** database with Row Level Security
- **Edge Functions** for serverless operations

### Key Libraries
- `@supabase/supabase-js` - Database and auth client
- `@dnd-kit/*` - Drag and drop functionality
- `date-fns` - Date manipulation
- `uuid` - Unique ID generation
- `zod` - Schema validation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── templates/       # Resume templates
│   ├── ui/             # Base UI components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Header.tsx      # App header with actions
│   ├── Navigation.tsx  # Main navigation
│   ├── ProtectedRoute.tsx # Route protection
│   ├── ResumeBuilder.tsx # Main builder component
│   ├── ResumeForm.tsx  # Form for editing resume
│   ├── ResumePreview.tsx # Live preview component
│   └── TemplateSelector.tsx # Template selection
├── contexts/            # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ResumeContext.tsx # Resume data management
├── pages/              # Page components
│   ├── Account.tsx     # User account management
│   ├── Admin.tsx       # Admin panel
│   ├── Builder.tsx     # Resume builder page
│   ├── Landing.tsx     # Landing page
│   └── Pricing.tsx     # Pricing page
├── utils/              # Utility functions
│   ├── aiHelpers.ts    # AI enhancement functions
│   └── pdfGenerator.ts # PDF export functionality
├── data/               # Static data
│   └── initialData.ts  # Default resume data
└── lib/                # External library configs
    └── supabase.ts     # Supabase client
```

## 🗄 Database Schema

### Tables

#### `profiles`
User profile information and subscription details
```sql
- id (uuid, PK, references auth.users)
- full_name (text)
- subscription_tier (text, default: 'free')
- subscription_status (text, default: 'active')
- subscription_end_date (timestamptz)
- is_admin (boolean, default: false)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `resumes`
User resume data storage
```sql
- id (uuid, PK)
- user_id (uuid, FK to auth.users)
- title (text)
- data (jsonb)
- last_modified (timestamptz)
- created_at (timestamptz)
```

#### `tokens`
Premium access tokens for subscription management
```sql
- id (uuid, PK)
- code (text, unique)
- user_id (uuid, FK to auth.users)
- type (text) -- 'single', 'monthly', 'annual', 'lifetime'
- used (boolean, default: false)
- created_at (timestamptz)
- used_at (timestamptz)
- expires_at (timestamptz)
```

#### `visitors`
Site visitor analytics
```sql
- id (uuid, PK)
- count (bigint, default: 0)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `downloads`
Download analytics tracking
```sql
- id (uuid, PK)
- count (bigint, default: 0)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Admins have elevated permissions for token management
- Public read access for analytics counters

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd mitch-resume-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
Run the migrations in your Supabase dashboard:
- Execute all SQL files in `supabase/migrations/` in order
- Ensure RLS policies are properly configured

5. **Start Development Server**
```bash
npm run dev
```

### Production Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy to your hosting platform**
- The build output will be in the `dist/` directory
- Configure environment variables on your hosting platform
- Ensure proper redirects for SPA routing

## 🎨 Templates

### Modern Template
- Clean, contemporary design
- Blue accent colors
- Icon-enhanced contact information
- Skill tags with colored backgrounds
- Professional layout with clear sections

### Classic Template
- Traditional, formal appearance
- Serif typography
- Centered header layout
- Bullet-point highlights
- Conservative styling for traditional industries

### Minimal Template
- Ultra-clean, space-efficient design
- Sans-serif typography
- Compact layout
- Subtle section dividers
- Perfect for modern, tech-focused roles

## 🔐 Authentication & Authorization

### User Roles
- **Public**: Can use basic resume builder features
- **Authenticated**: Can save resumes, access AI features
- **Premium**: Enhanced AI features, unlimited exports
- **Admin**: Token management, analytics access

### Authentication Methods
- Email/password authentication
- Google OAuth integration
- Automatic profile creation on signup

## 🤖 AI Features

### Content Enhancement
- Professional summary optimization
- Job description improvements
- Highlight bullet point enhancement
- Custom section content suggestions

### Implementation
- Mock AI service for demonstration
- Configurable enhancement rules
- Premium feature gating
- Real-time processing indicators

## 📊 Analytics

### Visitor Tracking
- Real-time visitor count display
- Automatic increment on page load
- Persistent storage in database

### Download Analytics
- PDF download tracking
- Usage statistics for admins
- Performance metrics

## 🔒 Security Features

### Data Protection
- Row Level Security on all tables
- User data isolation
- Secure token management
- Input validation and sanitization

### Authentication Security
- JWT-based authentication
- Secure session management
- Protected routes and API endpoints

## 🚀 Performance Optimizations

### Frontend
- Code splitting with React.lazy
- Optimized bundle size
- Efficient re-rendering with React.memo
- Local storage caching

### Backend
- Database indexing
- Efficient queries with proper joins
- Edge function optimization

## 🧪 Testing

### Manual Testing Checklist
- [ ] Resume creation and editing
- [ ] Template switching
- [ ] PDF export functionality
- [ ] User authentication flow
- [ ] Custom section management
- [ ] AI enhancement features
- [ ] Mobile responsiveness

## 📝 Contributing

### Development Workflow
1. Create feature branch from main
2. Implement changes with proper TypeScript types
3. Test functionality thoroughly
4. Submit pull request with detailed description

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration enforced
- Consistent component structure
- Proper error handling

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
- Ensure all dependencies are installed
- Check TypeScript configuration
- Verify environment variables

**Database Connection Issues**
- Verify Supabase credentials
- Check RLS policies
- Ensure proper table permissions

**Authentication Problems**
- Confirm OAuth provider setup
- Check redirect URLs
- Verify JWT configuration

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting guide

---

Built with ❤️ using React, TypeScript, and Supabase