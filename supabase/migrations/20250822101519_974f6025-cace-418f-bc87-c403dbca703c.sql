-- Check if storage policies exist and create them if needed
-- First check existing policies
SELECT * FROM storage.policies WHERE bucket_id = 'member-photos';

-- Create storage policies for member photos if they don't exist
CREATE POLICY "Users can view their own member photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own member photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own member photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own member photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'member-photos' AND auth.uid()::text = (storage.foldername(name))[1]);