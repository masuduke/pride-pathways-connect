import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, subject, message }: ContactFormData = await req.json();

    console.log('Received contact form submission:', { firstName, lastName, email, subject });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Save to database
    const { data: messageData, error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        subject: subject,
        message: message
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save message to database');
    }

    console.log('Message saved to database:', messageData.id);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Rainbow Directory <onboarding@resend.dev>",
      to: ["masud.uk.e@gmail.com"], // Admin email
      subject: `New Contact Message: ${subject}`,
      html: `
        <h2>New Contact Message Received</h2>
        <p><strong>From:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Subject:</strong> ${subject}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Message ID: ${messageData.id}</em></p>
        <p><em>Received: ${new Date().toLocaleString()}</em></p>
      `,
    });

    // Send confirmation email to sender
    const confirmationEmailResponse = await resend.emails.send({
      from: "Rainbow Directory <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <h1>Thank you for contacting us, ${firstName}!</h1>
        <p>We have received your message regarding "<strong>${subject}</strong>" and will get back to you as soon as possible.</p>
        <p>Your message reference ID is: <strong>${messageData.id}</strong></p>
        <h3>Your message:</h3>
        <p><em>${message.replace(/\n/g, '<br>')}</em></p>
        <hr>
        <p>Best regards,<br>The Rainbow Directory Team</p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);
    console.log("Confirmation email sent:", confirmationEmailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: messageData.id,
      message: "Contact form submitted successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process contact form" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);