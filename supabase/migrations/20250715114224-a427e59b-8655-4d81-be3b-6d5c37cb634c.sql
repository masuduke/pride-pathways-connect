-- Create enum for service types
CREATE TYPE public.service_type AS ENUM ('therapy', 'hiv_testing', 'support_group', 'counseling', 'peer_support');

-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- Create enum for test result status
CREATE TYPE public.test_status AS ENUM ('negative', 'positive', 'pending', 'inconclusive');

-- Create providers table (therapists, counselors, medical staff)
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  specialty TEXT NOT NULL,
  license_number TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  available_hours JSONB, -- Store availability schedule
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  service_type public.service_type NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  provider_id UUID REFERENCES public.providers(id),
  service_id UUID REFERENCES public.services(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status public.appointment_status DEFAULT 'scheduled',
  notes TEXT,
  is_online BOOLEAN DEFAULT false,
  meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create support groups table
CREATE TABLE public.support_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  focus_area TEXT, -- e.g., "HIV Support", "Depression", "Anxiety"
  facilitator_id UUID REFERENCES public.providers(id),
  max_members INTEGER DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  meeting_schedule TEXT, -- e.g., "Weekly Thursdays 6PM"
  location TEXT,
  is_virtual BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group memberships table
CREATE TABLE public.group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  group_id UUID REFERENCES public.support_groups(id) NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, group_id)
);

-- Create group sessions table
CREATE TABLE public.group_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.support_groups(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  topic TEXT,
  notes TEXT,
  attendee_count INTEGER DEFAULT 0,
  location TEXT,
  meeting_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test appointments table (for HIV testing)
CREATE TABLE public.test_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  provider_id UUID REFERENCES public.providers(id),
  test_type TEXT NOT NULL DEFAULT 'HIV',
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_rapid_test BOOLEAN DEFAULT true,
  is_anonymous BOOLEAN DEFAULT false,
  status public.appointment_status DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test results table (highly sensitive data)
CREATE TABLE public.test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(user_id) NOT NULL,
  test_appointment_id UUID REFERENCES public.test_appointments(id),
  test_type TEXT NOT NULL DEFAULT 'HIV',
  result_status public.test_status NOT NULL,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL,
  result_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  resource_type TEXT, -- e.g., "article", "video", "pdf", "link"
  category TEXT, -- e.g., "mental_health", "hiv_prevention", "support"
  url TEXT,
  file_path TEXT,
  is_public BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for providers
CREATE POLICY "Providers can manage their own profile" ON public.providers
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view active providers" ON public.providers
  FOR SELECT USING (true);

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for appointments
CREATE POLICY "Users can manage their own appointments" ON public.appointments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their appointments" ON public.appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = appointments.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- RLS Policies for support groups
CREATE POLICY "Anyone can view active support groups" ON public.support_groups
  FOR SELECT USING (is_active = true);

CREATE POLICY "Facilitators can manage their groups" ON public.support_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = support_groups.facilitator_id 
      AND providers.user_id = auth.uid()
    )
  );

-- RLS Policies for group memberships
CREATE POLICY "Users can manage their own memberships" ON public.group_memberships
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Facilitators can view their group memberships" ON public.group_memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_groups sg
      JOIN public.providers p ON sg.facilitator_id = p.id
      WHERE sg.id = group_memberships.group_id 
      AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for group sessions
CREATE POLICY "Group members can view sessions" ON public.group_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.group_memberships gm
      WHERE gm.group_id = group_sessions.group_id 
      AND gm.user_id = auth.uid()
      AND gm.is_active = true
    )
  );

CREATE POLICY "Facilitators can manage their group sessions" ON public.group_sessions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.support_groups sg
      JOIN public.providers p ON sg.facilitator_id = p.id
      WHERE sg.id = group_sessions.group_id 
      AND p.user_id = auth.uid()
    )
  );

-- RLS Policies for test appointments (privacy focused)
CREATE POLICY "Users can manage their own test appointments" ON public.test_appointments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their test appointments" ON public.test_appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.providers 
      WHERE providers.id = test_appointments.provider_id 
      AND providers.user_id = auth.uid()
    )
  );

-- RLS Policies for test results (highly sensitive)
CREATE POLICY "Users can only view their own test results" ON public.test_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results" ON public.test_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Medical providers can manage test results" ON public.test_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.providers p
      WHERE p.user_id = auth.uid()
      AND p.specialty IN ('medical', 'nurse', 'physician')
    )
  );

-- RLS Policies for resources
CREATE POLICY "Anyone can view public resources" ON public.resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own resources" ON public.resources
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all resources" ON public.resources
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_provider_id ON public.appointments(provider_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_group_memberships_user_id ON public.group_memberships(user_id);
CREATE INDEX idx_group_memberships_group_id ON public.group_memberships(group_id);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_resources_category ON public.resources(category);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_groups_updated_at
  BEFORE UPDATE ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_sessions_updated_at
  BEFORE UPDATE ON public.group_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_appointments_updated_at
  BEFORE UPDATE ON public.test_appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON public.test_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();