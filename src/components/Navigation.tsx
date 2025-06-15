import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wand2, LogIn, User, ChevronDown, Crown, Settings, LogOut, Shield } from 'lucide-react';
import AuthModal from './AuthModal';

const Navigation = () => {
  const { user, signOut, isAdmin, isSuperAdmin } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  if (location.pathname === '/builder') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserRole = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isAdmin) return 'Admin';
    return 'Free Plan';
  };

  const getRoleColor = () => {
    if (isSuperAdmin) return 'text-red-600 bg-red-50 border-red-200';
    if (isAdmin) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getRoleIcon = () => {
    if (isSuperAdmin) return <Shield className="h-4 w-4 text-red-500" />;
    if (isAdmin) return <Crown className="h-4 w-4 text-yellow-500" />;
    return <User className="h-4 w-4 text-slate-500" />;
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <div className="text-blue-600 mr-2">
                <Wand2 className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Resume Builder</h1>
            </Link>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {getUserInitials()}
                    </div>
                    <span className="hidden sm:block font-medium">{getUserDisplayName()}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                            {getUserInitials()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{getUserDisplayName()}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                        
                        {/* Role Status */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getRoleIcon()}
                            <span className="text-sm font-medium text-slate-700">{getUserRole()}</span>
                          </div>
                          {!isAdmin && !isSuperAdmin && (
                            <Link
                              to="/pricing"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full hover:from-blue-600 hover:to-purple-700 transition-colors"
                            >
                              Upgrade
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Premium Features Preview (only for non-admin users) */}
                      {!isAdmin && !isSuperAdmin && (
                        <div className="px-4 py-3 border-b border-slate-100">
                          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Premium Features
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">AI Enhancement</span>
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Unlimited Exports</span>
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Premium Templates</span>
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Admin Features (only for admin users) */}
                      {(isAdmin || isSuperAdmin) && (
                        <div className="px-4 py-3 border-b border-slate-100">
                          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Admin Features
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Token Management</span>
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">User Analytics</span>
                              <Crown className="h-3 w-3 text-yellow-500" />
                            </div>
                            {isSuperAdmin && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">User Management</span>
                                <Shield className="h-3 w-3 text-red-500" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Account Settings
                        </Link>
                        
                        {(isAdmin || isSuperAdmin) && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            {isSuperAdmin ? (
                              <Shield className="h-4 w-4 mr-3 text-red-500" />
                            ) : (
                              <Crown className="h-4 w-4 mr-3 text-yellow-500" />
                            )}
                            {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
                          </Link>
                        )}
                        
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Click outside to close menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;