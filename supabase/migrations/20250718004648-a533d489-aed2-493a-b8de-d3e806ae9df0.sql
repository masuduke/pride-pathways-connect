-- Insert the required services that users can book
INSERT INTO public.services (name, description, service_type, duration_minutes, price, is_active) VALUES
('Mental Health Therapy', 'Professional counseling with LGBT+ affirming therapists', 'therapy', 60, 80, true),
('HIV Testing & Support', 'Confidential HIV testing with counseling support', 'hiv_testing', 60, 0, true),
('Community Support Groups', 'Peer support in safe group environments', 'support_group', 90, 0, true);