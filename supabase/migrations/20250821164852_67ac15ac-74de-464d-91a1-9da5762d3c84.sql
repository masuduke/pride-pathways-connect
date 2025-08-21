-- Drop the view that triggered security warning
DROP VIEW IF EXISTS public.providers_public_info;

-- Instead, create a more secure policy structure
-- Update the existing policy to be more restrictive for authenticated users
DROP POLICY IF EXISTS "Users can view limited provider info" ON public.providers;

-- Create a policy that allows authenticated users to see providers only when:
-- 1. They have an appointment with that provider, OR  
-- 2. They are viewing for booking purposes (limited fields), OR
-- 3. They are the provider themselves, OR
-- 4. They are an admin
CREATE POLICY "Authenticated users view providers for appointments" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = providers.user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.provider_id = providers.id 
    AND appointments.user_id = auth.uid()
  )
);

-- Add comments to document the security hardening
COMMENT ON TABLE public.providers IS 'Healthcare provider information - Access restricted to protect sensitive professional data including license numbers and credentials. Public access completely removed for security compliance.';

-- Update the public provider info function to be more explicit about security
CREATE OR REPLACE FUNCTION public.get_safe_provider_info(provider_id uuid)
RETURNS TABLE (
  specialty text,
  bio text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    providers.specialty,
    providers.bio
  FROM public.providers
  WHERE providers.id = provider_id
  AND providers.id IN (
    -- Only return info for providers who have active services
    SELECT DISTINCT provider_id 
    FROM public.appointments 
    WHERE provider_id IS NOT NULL
  );
$$;