import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Printer, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, addYears } from "date-fns";
import companyLogo from "@/assets/company-logo.png";

interface MemberIDCardProps {
  profile: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    membership_number?: string;
    created_at?: string;
  };
  userId: string;
}

export const MemberIDCard = ({ profile, userId }: MemberIDCardProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load existing photo on mount
  useEffect(() => {
    loadMemberPhoto();
  }, [userId]);

  const loadMemberPhoto = async () => {
    try {
      setLoading(true);
      
      // List all files in the user's folder to find the correct extension
      const { data: files, error: listError } = await supabase.storage
        .from('member-photos')
        .list(`${userId}/`);
      
      if (listError || !files || files.length === 0) {
        console.log('No photos found for user:', userId);
        setPhotoUrl(null);
        return;
      }
      
      // Find the profile photo file
      const profilePhoto = files.find(file => file.name.startsWith('profile-photo'));
      
      if (profilePhoto) {
        const { data } = supabase.storage
          .from('member-photos')
          .getPublicUrl(`${userId}/${profilePhoto.name}`);
        
        // Add timestamp to prevent caching issues
        const photoUrlWithTimestamp = `${data.publicUrl}?t=${Date.now()}`;
        
        // Verify the image loads
        const img = new Image();
        img.onload = () => {
          console.log('Photo loaded successfully:', photoUrlWithTimestamp);
          setPhotoUrl(photoUrlWithTimestamp);
        };
        img.onerror = () => {
          console.error('Failed to load photo:', photoUrlWithTimestamp);
          setPhotoUrl(null);
        };
        img.src = photoUrlWithTimestamp;
      } else {
        console.log('No profile photo found for user:', userId);
        setPhotoUrl(null);
      }
    } catch (error) {
      console.error('Error loading photo:', error);
      setPhotoUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    try {
      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/profile-photo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('member-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      await loadMemberPhoto();
      
      toast({
        title: "Photo uploaded successfully",
        description: "Your ID card photo has been updated"
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPhoto(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getExpirationDate = () => {
    if (!profile.created_at) return "N/A";
    const registrationDate = new Date(profile.created_at);
    const expirationDate = addYears(registrationDate, 1);
    return format(expirationDate, "MM/dd/yyyy");
  };

  const getDisplayName = () => {
    if (profile.first_name && profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile.first_name || profile.last_name || "Member";
  };

  return (
    <div className="space-y-4">
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .id-card-print-area,
          .id-card-print-area * {
            visibility: visible;
          }
          
          .id-card-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 3.375in;
            height: 2.125in;
            border: 3px solid hsl(280 100% 45%);
            background: linear-gradient(135deg, 
              hsl(0 100% 60%) 0%,
              hsl(30 100% 55%) 16.66%,
              hsl(60 100% 50%) 33.33%,
              hsl(120 100% 40%) 50%,
              hsl(200 100% 50%) 66.66%,
              hsl(280 100% 45%) 83.33%,
              hsl(320 100% 50%) 100%
            );
            color: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .id-card-print-area::before {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 40px;
            height: 40px;
            background-image: url('${companyLogo}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            opacity: 0.8;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .id-card-print-area img {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .id-card-print-area .member-photo {
            background: white !important;
            border: 2px solid white !important;
          }
          
          .id-card-print-area .print-text-white {
            color: white !important;
          }
          
          .id-card-print-area .print-text-shadow {
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          }
          
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Controls - Hidden when printing */}
      <div className="flex gap-3 no-print">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="pride"
          className="flex-1"
        >
          {uploading ? (
            <>
              <Upload className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              {photoUrl ? "Change Photo" : "Upload Photo"}
            </>
          )}
        </Button>
        
        <Button onClick={handlePrint} variant="healthcare">
          <Printer className="h-4 w-4" />
          Print ID Card
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ID Card */}
      <Card className="id-card-print-area w-full max-w-md mx-auto shadow-pride border-4 border-primary bg-gradient-pride relative">
        {/* Company Logo */}
        <div className="absolute top-2 right-2 w-10 h-10 opacity-80 no-print">
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <CardContent className="p-4 bg-white/95 backdrop-blur-sm m-1 rounded-lg">
          <div className="space-y-3">
            {/* Header */}
            <div className="text-center border-b-2 border-primary pb-2">
              <h3 className="text-lg font-bold text-primary print-text-white print-text-shadow">RONGDUNO</h3>
              <p className="text-xs text-primary/80 print-text-white">LGBT+ Health & Community Member</p>
            </div>

            {/* Photo and Info Section */}
            <div className="flex items-center gap-4">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="member-photo w-20 h-20 border-3 border-primary rounded-lg overflow-hidden bg-gradient-subtle flex items-center justify-center shadow-glow">
                  {loading ? (
                    <div className="animate-pulse bg-primary/20 w-full h-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  ) : photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Member Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-primary">
                      <User className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>

              {/* Member Info */}
              <div className="flex-1 space-y-1">
                <div>
                  <p className="text-xs text-primary/70 print-text-white uppercase tracking-wide font-semibold">Name</p>
                  <p className="text-sm font-bold text-primary print-text-white print-text-shadow">{getDisplayName()}</p>
                </div>
                
                {profile.date_of_birth && (
                  <div>
                    <p className="text-xs text-primary/70 print-text-white uppercase tracking-wide font-semibold">DOB</p>
                    <p className="text-sm font-semibold text-primary print-text-white print-text-shadow">{format(new Date(profile.date_of_birth), "MM/dd/yyyy")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Membership Details */}
            <div className="space-y-2 pt-2 border-t-2 border-primary/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-primary/70 print-text-white uppercase tracking-wide font-semibold">Member #</p>
                  <p className="text-sm font-mono font-bold text-primary print-text-white print-text-shadow">
                    {profile.membership_number || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-primary/70 print-text-white uppercase tracking-wide font-semibold">Expires</p>
                  <p className="text-sm font-bold text-primary print-text-white print-text-shadow">{getExpirationDate()}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-2 border-t-2 border-primary/30">
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                </div>
                <p className="text-xs text-primary/80 print-text-white font-semibold">Proud • United • Strong</p>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                </div>
              </div>
              <p className="text-xs text-primary/60 print-text-white mt-1">Pride in Health & Community</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};