import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, CreditCard, User, Clock, Crown, Mail, Calendar, Shield, Zap, Download, FileText } from 'lucide-react';

interface Profile {
  full_name: string;
  subscription_tier: string;
  subscription_status: string;
  subscription_end_date: string | null;
}

const Account = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      // Handle successful subscription
      console.log('Subscription successful:', sessionId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, subscription_tier, subscription_status, subscription_end_date')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'lifetime': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'annual': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'monthly': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getSubscriptionIcon = (tier: string) => {
    switch (tier) {
      case 'lifetime': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'annual': 
      case 'monthly': return <Crown className="h-4 w-4 text-blue-500" />;
      default: return <User className="h-4 w-4 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-bold">
                {getUserInitials()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{getUserDisplayName()}</h1>
                <p className="text-blue-100">{user?.email}</p>
                <div className="flex items-center mt-2">
                  {getSubscriptionIcon(profile?.subscription_tier || 'free')}
                  <span className="ml-2 text-sm font-medium">
                    {profile?.subscription_tier?.charAt(0).toUpperCase() + profile?.subscription_tier?.slice(1) || 'Free'} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
              </div>
              <div className="pl-9 grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Email Address</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">{user?.email}</span>
                      {user?.email_confirmed_at && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Full Name</label>
                    <div className="mt-1 text-slate-900">{getUserDisplayName()}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Member Since</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        }) : 'Unknown'}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Role</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-slate-900 font-medium">Administrator</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CreditCard className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-900">Subscription & Features</h2>
              </div>
              <div className="pl-9">
                <div className={`rounded-lg p-6 border ${getSubscriptionColor(profile?.subscription_tier || 'free')}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getSubscriptionIcon(profile?.subscription_tier || 'free')}
                      <div>
                        <div className="font-semibold text-lg">
                          {profile?.subscription_tier?.charAt(0).toUpperCase() + profile?.subscription_tier?.slice(1) || 'Free'} Plan
                        </div>
                        <div className="text-sm opacity-75">
                          Status: {profile?.subscription_status?.charAt(0).toUpperCase() + profile?.subscription_status?.slice(1) || 'Active'}
                        </div>
                      </div>
                    </div>
                    {profile?.subscription_tier === 'free' ? (
                      <button
                        onClick={() => navigate('/pricing')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium"
                      >
                        Upgrade Now
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/pricing')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Manage Subscription
                      </button>
                    )}
                  </div>
                  
                  {profile?.subscription_end_date && profile?.subscription_tier !== 'lifetime' && (
                    <div className="flex items-center text-sm opacity-75 mb-4">
                      <Clock className="h-4 w-4 mr-2" />
                      {profile?.subscription_tier === 'free' ? 'No expiration' : 
                       `Renews on ${new Date(profile.subscription_end_date).toLocaleDateString()}`}
                    </div>
                  )}

                  {/* Feature List */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm uppercase tracking-wide opacity-75">Available Features</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Resume Builder</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">
                          {profile?.subscription_tier === 'free' ? 'Limited PDF Export' : 'Unlimited PDF Export'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {profile?.subscription_tier === 'free' ? (
                          <>
                            <Zap className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-500">AI Enhancement (Premium)</span>
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">AI Enhancement</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {profile?.subscription_tier === 'free' ? (
                          <>
                            <Crown className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-500">Premium Templates (Premium)</span>
                          </>
                        ) : (
                          <>
                            <Crown className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">Premium Templates</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {profile?.subscription_tier === 'free' && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <div>
                          <h3 className="font-medium text-slate-900">Unlock Premium Features</h3>
                          <p className="text-sm text-slate-600">Get AI enhancement, unlimited exports, and premium templates</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/pricing')}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        View Plans
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => navigate('/builder')}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  <span>Build Resume</span>
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-colors"
                >
                  <Crown className="h-5 w-5" />
                  <span>Upgrade Plan</span>
                </button>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleSignOut}
                className="flex items-center text-red-600 hover:text-red-800 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;