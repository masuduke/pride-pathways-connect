-- Fix the generate_membership_number function to have proper search_path
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS text 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO ''
AS $$
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
$$;