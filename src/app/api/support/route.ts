import { NextResponse } from "next/server";
import { getSupportTickets, createSupportTicket } from "@/lib/cmsDataStore";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const tickets = getSupportTickets();
    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, message, senderEmail, senderName, attachments } = body;

    if (!subject || !message) {
      return NextResponse.json({ success: false, error: "Subject and message are required" }, { status: 400 });
    }

    // Persist ticket record
    const ticket = createSupportTicket({
      subject,
      message,
      senderEmail: senderEmail || "admin@vanguardbd.com",
      senderName: senderName || "Admin",
      attachments: attachments || [],
    });

    // Attempt transactional email if SMTP credentials are provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"VANGUARD BD Portal" <${process.env.SMTP_USER}>`,
          to: "shamimjkrworld@gmail.com",
          subject: `[VANGUARD Support Ticket] ${subject}`,
          text: `Support request from ${senderName || "Admin"} (${senderEmail || "admin@vanguardbd.com"}):\n\n${message}`,
          html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #111;">VANGUARD BD Support Request</h2>
            <p><strong>From:</strong> ${senderName || "Admin"} (${senderEmail || "admin@vanguardbd.com"})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
          </div>`,
        });
      } catch (mailErr) {
        console.warn("SMTP send failed, ticket saved to database:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: ticket,
      message: "Support request recorded and dispatched to shamimjkrworld@gmail.com",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
