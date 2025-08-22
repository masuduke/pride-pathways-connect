import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Printer, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SupportingLetterProps {
  userId: string;
  profile: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    membership_number?: string;
  };
}

export const SupportingLetter = ({ userId, profile }: SupportingLetterProps) => {
  const { toast } = useToast();
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [showLetter, setShowLetter] = useState(false);

  const generateLetter = () => {
    if (!selectedGender) {
      toast({
        title: "Gender Required",
        description: "Please select your gender to generate the supporting letter.",
        variant: "destructive",
      });
      return;
    }
    setShowLetter(true);
  };

  const printLetter = () => {
    window.print();
  };

  const memberName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const genderIdentity = selectedGender === 'male' ? 'gay' : 'lesbian';
  const honorific = selectedGender === 'male' ? 'Mr' : 'Miss';
  const currentDate = format(new Date(), 'dd MMMM yyyy');

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .supporting-letter-print, .supporting-letter-print * {
              visibility: visible;
            }
            .supporting-letter-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 210mm;
              min-height: 297mm;
              background: white;
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: black;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.1;
              z-index: -1;
              width: 300px;
              height: auto;
            }
            .letter-header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            .letter-body {
              padding: 0 40px;
              text-align: justify;
              line-height: 1.8;
            }
            .letter-footer {
              position: fixed;
              bottom: 20px;
              left: 40px;
              right: 40px;
              text-align: center;
              font-size: 10pt;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
          }
          
          .supporting-letter-container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Supporting Letter Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showLetter ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Your Gender
                </label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Member Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span>
                    <p>{memberName || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date of Birth:</span>
                    <p>{profile.date_of_birth ? format(new Date(profile.date_of_birth), 'dd/MM/yyyy') : 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Membership Number:</span>
                    <p>{profile.membership_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <Button onClick={generateLetter} className="w-full">
                Generate Supporting Letter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 no-print">
                <Button onClick={printLetter} variant="outline" className="flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print Letter
                </Button>
                <Button onClick={() => setShowLetter(false)} variant="ghost">
                  Back to Form
                </Button>
              </div>

              <div className="supporting-letter-print supporting-letter-container">
                {/* Watermark */}
                <div className="watermark">
                  <img 
                    src="/rongduno-header-logo.png" 
                    alt="Rongduno Watermark" 
                    className="w-full h-auto opacity-10"
                  />
                </div>

                {/* Header */}
                <div className="letter-header p-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <img 
                      src="/rongduno-header-logo.png" 
                      alt="Rongduno Logo" 
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-primary">Rongduno</h1>
                      <p className="text-lg text-muted-foreground">The Largest LGBT+ Community for Bangladeshi</p>
                    </div>
                  </div>
                </div>

                {/* Letter Content */}
                <div className="letter-body p-8 pt-0">
                  <div className="mb-8">
                    <p className="mb-2">{currentDate}</p>
                    <p className="mb-4">Our Ref: {profile.membership_number}</p>
                    
                    <div className="mb-6">
                      <p>The Home Office</p>
                      <p>Lunar House</p>
                      <p>40 Wellesley Road</p>
                      <p>Croydon CR9 2BY</p>
                    </div>

                    <p className="font-bold mb-4">
                      RE: ASYLUM APPLICATION FOR {memberName.toUpperCase()}
                    </p>
                    <p className="mb-4">
                      Bangladeshi National – Date of birth: {profile.date_of_birth ? format(new Date(profile.date_of_birth), 'dd MMMM yyyy') : 'Not provided'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p>Dear Sirs,</p>

                    <p>
                      I am writing in support of {honorific} {memberName}'s application for asylum in the United Kingdom.
                    </p>

                    <p>
                      {honorific} {memberName} has been a registered member of Rongduno and has taken an active role in our community. 
                      She regularly attends our monthly meetings, participates in group discussions, and uses our support services. 
                      From my direct and consistent interactions with her, I can confirm that she identifies as a {genderIdentity}.
                    </p>

                    <p>
                      As an organisation that works exclusively with LGBT individuals from Bangladeshi backgrounds, we are deeply aware 
                      of the challenges faced by our members. Homosexuality is criminalised and widely condemned in Bangladesh, with 
                      individuals at high risk of harassment, violence, and social exclusion. If {honorific} {memberName} were returned 
                      to Bangladesh, it is my strong belief that she would be exposed to persecution and significant harm.
                    </p>

                    <p>
                      On these grounds, I respectfully request that her application be considered with the utmost care and that she be 
                      granted protection in the United Kingdom.
                    </p>

                    <div className="mt-8">
                      <p className="mb-8">Yours sincerely,</p>
                      <div className="mb-4" style={{ height: '60px' }}>
                        <p>(Signature)</p>
                      </div>
                      <div>
                        <p className="font-semibold">Md Masud Rana</p>
                        <p>Chairperson</p>
                        <p>Rongduno</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="letter-footer">
                  <div className="text-xs space-y-1">
                    <p><strong>Rongduno - The Largest LGBT+ Community for Bangladeshi</strong></p>
                    <p>Phone: +44 7123 456789 | Email: info@rongduno.org | Website: www.rongduno.org</p>
                    <p>Address: 123 Community Street, London, UK | Company Number: 12345678</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};