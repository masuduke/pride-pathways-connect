import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated");

    const { planName, amount, sessionsPerMonth, sessionDuration, firstAppointment } = await req.json();

    console.log("Creating subscription for:", user.email, { planName, amount, sessionsPerMonth, sessionDuration });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      customerId = customer.id;
    }

    // Create or get the subscription price/product
    const productName = `${planName} - ${sessionsPerMonth}x ${sessionDuration}min sessions`;
    
    // Search for existing product
    const products = await stripe.products.search({
      query: `name:'${productName}' AND active:'true'`,
    });

    let priceId;
    if (products.data.length > 0) {
      // Get existing price for this product
      const prices = await stripe.prices.list({
        product: products.data[0].id,
        active: true,
        limit: 1
      });
      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      }
    }

    if (!priceId) {
      // Create new product and price
      const product = await stripe.products.create({
        name: productName,
        description: `Monthly therapy subscription: ${sessionsPerMonth} sessions of ${sessionDuration} minutes each with priority scheduling`,
        metadata: {
          sessions_per_month: sessionsPerMonth.toString(),
          session_duration: sessionDuration.toString()
        }
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount * 100, // Convert to cents
        currency: "usd",
        recurring: {
          interval: "month"
        }
      });

      priceId = price.id;
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${req.headers.get("origin")}/services`,
      metadata: {
        userId: user.id,
        planName,
        sessionsPerMonth: sessionsPerMonth.toString(),
        sessionDuration: sessionDuration.toString(),
        firstAppointment: JSON.stringify(firstAppointment)
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planName,
          sessionsPerMonth: sessionsPerMonth.toString(),
          sessionDuration: sessionDuration.toString()
        }
      }
    });

    console.log("Subscription checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});