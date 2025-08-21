-- Remove the dangerous public access policy that exposes all provider data
DROP POLICY IF EXISTS "Public can view basic provider info" ON public.providers;

-- Create a secure public view that only exposes safe provider information
CREATE OR REPLACE VIEW public.providers_public_info AS
SELECT 
  id,
  specialty,
  bio
FROM public.providers;

-- Enable RLS on the view
ALTER VIEW public.providers_public_info SET (security_barrier = true);

-- Create a new restrictive policy for authenticated users booking appointments
-- This allows authenticated users to see provider profiles through appointments only
CREATE POLICY "Authenticated users can view provider info for appointments" 
ON public.providers 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.appointments 
    WHERE appointments.provider_id = providers.id 
    AND appointments.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR auth.uid() = providers.user_id
);

-- Create a function for safe public provider lookup (specialty and bio only)
CREATE OR REPLACE FUNCTION public.get_public_provider_info(provider_ids uuid[])
RETURNS TABLE (
  id uuid,
  specialty text,
  bio text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    providers.id,
    providers.specialty,
    providers.bio
  FROM public.providers
  WHERE providers.id = ANY(provider_ids);
$$;