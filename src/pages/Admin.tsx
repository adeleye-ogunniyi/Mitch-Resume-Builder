import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Copy, Trash2, Plus, Check, Users, Shield, Crown, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from '../components/ui/useToast';

interface Token {
  id: string;
  code: string;
  type: string;
  used: boolean;
  created_at: string;
  used_at: string | null;
  expires_at: string;
  user_id: string | null;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
  is_super_admin: boolean;
  subscription_tier: string;
  created_at: string;
}

const Admin = () => {
  const { user, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [tokenType, setTokenType] = useState('single');
  const [quantity, setQuantity] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tokens' | 'users'>('tokens');

  useEffect(() => {
    checkAdminStatus();
    fetchTokens();
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [user, isSuperAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin, is_super_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (!data?.is_admin && !data?.is_super_admin) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tokens',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isSuperAdmin) return;
    
    setUsersLoading(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, is_admin, is_super_admin, subscription_tier, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      const usersWithEmails = profiles?.map(profile => {
        const authUser = authUsers.users.find(u => u.id === profile.id);
        return {
          ...profile,
          email: authUser?.email || 'Unknown',
        };
      }) || [];

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const generateTokens = async () => {
    if (generating) return;
    
    setGenerating(true);
    try {
      const { data, error } = await supabase
        .rpc('generate_tokens', {
          token_type: tokenType,
          token_quantity: quantity,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Generated ${quantity} ${tokenType} token${quantity > 1 ? 's' : ''}`,
      });

      fetchTokens();
    } catch (error) {
      console.error('Error generating tokens:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate tokens',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const deleteToken = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tokens')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTokens(tokens.filter(token => token.id !== id));
      toast({
        title: 'Success',
        description: 'Token deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting token:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete token',
        variant: 'destructive',
      });
    }
  };

  const toggleUserAdmin = async (userId: string, currentAdminStatus: boolean) => {
    if (!isSuperAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only super admins can manage admin privileges',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .rpc('manage_admin_privileges', {
          target_user_id: userId,
          make_admin: !currentAdminStatus,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User ${!currentAdminStatus ? 'promoted to' : 'removed from'} admin`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error managing admin privileges:', error);
      toast({
        title: 'Error',
        description: 'Failed to update admin privileges',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: 'Copied',
        description: 'Token code copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy token code',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isSuperAdmin ? (
                  <Shield className="h-6 w-6 text-red-500" />
                ) : (
                  <Crown className="h-6 w-6 text-yellow-500" />
                )}
                <h1 className="text-2xl font-bold text-slate-900">
                  {isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
                </h1>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'tokens'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Token Management
                </button>
                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'users'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    User Management
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'tokens' && (
              <>
                <div className="mb-8 bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Generate New Tokens</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Token Type
                      </label>
                      <select
                        value={tokenType}
                        onChange={(e) => setTokenType(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="single">Single Use</option>
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                        <option value="lifetime">Lifetime</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        onClick={generateTokens}
                        disabled={generating}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        {generating ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </span>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Generate Tokens
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Code</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Created</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Expires</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-sm text-slate-500">
                            Loading tokens...
                          </td>
                        </tr>
                      ) : tokens.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-sm text-slate-500">
                            No tokens found
                          </td>
                        </tr>
                      ) : (
                        tokens.map((token) => (
                          <tr key={token.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              <div className="flex items-center space-x-2">
                                <code className="bg-slate-100 px-2 py-1 rounded">{token.code}</code>
                                <button
                                  onClick={() => copyToClipboard(token.code, token.id)}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  {copiedId === token.id ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {token.type.charAt(0).toUpperCase() + token.type.slice(1)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {token.used ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  Used
                                </span>
                              ) : new Date(token.expires_at) < new Date() ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Expired
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {new Date(token.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {new Date(token.expires_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {!token.used && (
                                <button
                                  onClick={() => deleteToken(token.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === 'users' && isSuperAdmin && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </h2>
                  <button
                    onClick={fetchUsers}
                    disabled={usersLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    {usersLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">User</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Subscription</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Joined</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {usersLoading ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-sm text-slate-500">
                            Loading users...
                          </td>
                        </tr>
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-3 text-center text-sm text-slate-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((userProfile) => (
                          <tr key={userProfile.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                  {(userProfile.full_name || userProfile.email).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900">
                                    {userProfile.full_name || 'Unknown'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {userProfile.email}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center space-x-2">
                                {userProfile.is_super_admin ? (
                                  <>
                                    <Shield className="h-4 w-4 text-red-500" />
                                    <span className="text-red-600 font-medium">Super Admin</span>
                                  </>
                                ) : userProfile.is_admin ? (
                                  <>
                                    <Crown className="h-4 w-4 text-yellow-500" />
                                    <span className="text-yellow-600 font-medium">Admin</span>
                                  </>
                                ) : (
                                  <>
                                    <Users className="h-4 w-4 text-slate-400" />
                                    <span className="text-slate-600">User</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                userProfile.subscription_tier === 'lifetime' ? 'bg-yellow-100 text-yellow-800' :
                                userProfile.subscription_tier === 'annual' ? 'bg-purple-100 text-purple-800' :
                                userProfile.subscription_tier === 'monthly' ? 'bg-blue-100 text-blue-800' :
                                'bg-slate-100 text-slate-800'
                              }`}>
                                {userProfile.subscription_tier?.charAt(0).toUpperCase() + userProfile.subscription_tier?.slice(1) || 'Free'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {new Date(userProfile.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {!userProfile.is_super_admin && userProfile.id !== user?.id && (
                                <button
                                  onClick={() => toggleUserAdmin(userProfile.id, userProfile.is_admin)}
                                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                    userProfile.is_admin
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {userProfile.is_admin ? (
                                    <>
                                      <UserMinus className="h-3 w-3" />
                                      <span>Remove Admin</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserPlus className="h-3 w-3" />
                                      <span>Make Admin</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;