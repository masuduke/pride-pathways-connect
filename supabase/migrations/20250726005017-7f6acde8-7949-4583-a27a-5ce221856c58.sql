-- Add membership number to profiles table
ALTER TABLE public.profiles 
ADD COLUMN membership_number text UNIQUE;

-- Create a function to generate unique membership numbers
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS text AS $$
DECLARE
    new_number text;
    prefix text := 'RD';
    counter integer;
BEGIN
    -- Get the highest existing membership number
    SELECT COALESCE(
        MAX(CAST(SUBSTRING(membership_number FROM 3) AS INTEGER)), 
        1000
    ) + 1 INTO counter
    FROM public.profiles 
    WHERE membership_number IS NOT NULL 
    AND membership_number ~ '^RD[0-9]+$';
    
    -- Generate new membership number
    new_number := prefix || counter::text;
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update handle_new_user function to assign membership numbers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert profile with membership number
  INSERT INTO public.profiles (
    user_id, 
    first_name, 
    last_name, 
    display_name,
    membership_number
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name'
    ),
    generate_membership_number()
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;