import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Crown, Download, Check, Sparkles } from 'lucide-react';

const PRICE_IDS = {
  monthly: 'price_monthly',
  annual: 'price_annual',
  lifetime: 'price_lifetime',
  token: 'price_token'
};

const Pricing = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      // Redirect to auth if not logged in
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/pricing`
        }
      });
      
      if (error) {
        console.error('Auth error:', error);
        return;
      }
    } else {
      try {
        // TODO: Implement new subscription handling logic here
        console.log('Handling subscription for price:', priceId);
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Single Token */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Single Token</h3>
              <Download className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$5</span>
              <span className="text-slate-500">/token</span>
            </div>
            <ul className="space-y-3 mb-6">
              <Feature text="One-time Word export" />
              <Feature text="Basic templates" />
              <Feature text="24-hour support" />
            </ul>
            <button
              onClick={() => handleSubscribe(PRICE_IDS.token)}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              Buy Token
            </button>
          </div>

          {/* Monthly Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly</h3>
              <Crown className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$10</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-6">
              <Feature text="Unlimited exports" />
              <Feature text="Premium templates" />
              <Feature text="AI enhancement tools" />
              <Feature text="Priority support" />
            </ul>
            <button
              onClick={() => handleSubscribe(PRICE_IDS.monthly)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Subscribe Monthly
            </button>
          </div>

          {/* Annual Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6 relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
              Best Value
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Annual</h3>
              <Crown className="h-5 w-5 text-blue-500" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$60</span>
              <span className="text-slate-500">/year</span>
              <div className="text-sm text-green-600 font-medium">Save 50%</div>
            </div>
            <ul className="space-y-3 mb-6">
              <Feature text="Everything in Monthly" />
              <Feature text="Advanced customization" />
              <Feature text="Premium support" />
              <Feature text="Early access to features" />
            </ul>
            <button
              onClick={() => handleSubscribe(PRICE_IDS.annual)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Subscribe Yearly
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Lifetime</h3>
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold">$120</span>
              <span className="text-slate-500">/lifetime</span>
            </div>
            <ul className="space-y-3 mb-6">
              <Feature text="Everything in Annual" />
              <Feature text="Lifetime updates" />
              <Feature text="VIP support" />
              <Feature text="Custom branding" />
            </ul>
            <button
              onClick={() => handleSubscribe(PRICE_IDS.lifetime)}
              className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white rounded-lg transition-colors"
            >
              Get Lifetime Access
            </button>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          All plans include our core features. Upgrade, downgrade, or cancel anytime.
        </div>
      </div>
    </div>
  );
};

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-center text-sm text-slate-600">
    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
    {text}
  </li>
);

export default Pricing;