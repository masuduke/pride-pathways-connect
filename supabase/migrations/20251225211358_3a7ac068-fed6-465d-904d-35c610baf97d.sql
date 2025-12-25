-- Create pricing tiers table for flexible session pricing
CREATE TABLE public.pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE,
  duration_minutes integer NOT NULL,
  price numeric NOT NULL,
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view active pricing tiers
CREATE POLICY "Anyone can view active pricing tiers"
ON public.pricing_tiers
FOR SELECT
USING (is_active = true);

-- Admins can manage pricing tiers
CREATE POLICY "Admins can manage pricing tiers"
ON public.pricing_tiers
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create subscriptions table for monthly plans
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  plan_name text NOT NULL,
  monthly_price numeric NOT NULL,
  sessions_per_month integer NOT NULL DEFAULT 4,
  session_duration_minutes integer NOT NULL DEFAULT 60,
  sessions_remaining integer NOT NULL DEFAULT 4,
  priority_scheduling boolean DEFAULT true,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own subscriptions (for session tracking)
CREATE POLICY "Users can update their own subscriptions"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can manage all subscriptions
CREATE POLICY "Admins can manage all subscriptions"
ON public.subscriptions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow insert via service role (for webhook/edge function)
CREATE POLICY "Service role can insert subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_pricing_tiers_updated_at
BEFORE UPDATE ON public.pricing_tiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();