-- Add additional customer fields to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'UK';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'English';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS appointment_preferences JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS communication_preferences JSONB;

-- Create medical history table
CREATE TABLE IF NOT EXISTS public.medical_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  allergies TEXT[],
  current_medications TEXT[],
  medical_conditions TEXT[],
  previous_surgeries TEXT[],
  family_medical_history TEXT,
  preferred_provider_gender TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  blood_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on medical_history
ALTER TABLE public.medical_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medical_history - very strict access
CREATE POLICY "Users can view their own medical history" 
ON public.medical_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own medical history" 
ON public.medical_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own medical history" 
ON public.medical_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medical history" 
ON public.medical_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Medical providers can view medical history for their patients
CREATE POLICY "Medical providers can view patient medical history" 
ON public.medical_history 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM appointments a
    JOIN providers p ON a.provider_id = p.id
    WHERE a.user_id = medical_history.user_id 
    AND p.user_id = auth.uid()
    AND p.specialty IN ('medical', 'nurse', 'physician', 'doctor')
  )
);

-- Add trigger for automatic timestamp updates on medical_history
CREATE TRIGGER update_medical_history_updated_at
  BEFORE UPDATE ON public.medical_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();