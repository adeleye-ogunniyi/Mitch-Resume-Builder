import Stripe from 'npm:stripe@14.17.0';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        const status = subscription.status;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        
        let tier = 'free';
        if (subscription.items.data[0].price.recurring?.interval === 'month') {
          tier = 'monthly';
        } else if (subscription.items.data[0].price.recurring?.interval === 'year') {
          tier = 'annual';
        }

        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_status: status,
            subscription_end_date: currentPeriodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        const deletedUserId = deletedSubscription.metadata.userId;

        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'inactive',
            subscription_end_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', deletedUserId);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});