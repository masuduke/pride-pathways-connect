
-- First, ensure the generate_membership_number function exists
CREATE OR REPLACE FUNCTION public.generate_membership_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
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
$function$;

-- Drop the existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate the handle_new_user function to ensure it's properly defined
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

-- Create the trigger on auth.users table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
