-- Create storage bucket for member ID card photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('member-photos', 'member-photos', true);

-- Create storage policies for member photos
CREATE POLICY "Members can view their own photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Members can upload their own photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Members can update their own photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Members can delete their own photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);