"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND } from "@/config/brand";
import { MapPin, Phone, Mail, Clock, Send, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { useCMS } from "@/context/CMSContext";

export default function ContactPage() {
  const { pages, settings } = useCMS();
  const pageData = pages.find(
    (p) => p.slug === "contact" || p.slug === "/contact" || p.id === "page-contact"
  );

  const phone = settings?.contact?.phone || BRAND.phoneDisplay;
  const email = settings?.contact?.email || BRAND.email;
  const address = settings?.contact?.address || BRAND.address;

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Dispatch ticket to backend / shamimjkrworld@gmail.com
      await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          subject: formData.subject || "Contact Form Inquiry",
          message: formData.message,
          priority: "normal",
        }),
      });
      setSubmitted(true);
    } catch {
      // Fallback submit
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-12 md:py-16 text-center relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 relative z-10">
          <nav className="flex items-center justify-center gap-2 text-xs text-neutral-400 mb-3">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-semibold">
              {pageData?.title || "Contact Us"}
            </span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            {pageData?.title || "Contact Us"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md mx-auto">
            {pageData?.content || "Have questions about an order or sizing? Reach out to our customer care team."}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Info (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4145a] block mb-2">
                Get In Touch
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900">
                We'd love to hear from you
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
                Whether you have an inquiry about our tactical streetwear drops, order status, or wholesale partnerships, our team is ready to help.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase">Head Office</h4>
                  <p className="text-neutral-600 mt-0.5">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <Phone className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase">Phone & WhatsApp</h4>
                  <p className="text-neutral-600 mt-0.5">
                    <a href={`tel:${phone}`} className="hover:underline">
                      {phone}
                    </a>
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Sat - Thu: 10:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <Mail className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase">Email Support</h4>
                  <p className="text-neutral-600 mt-0.5">
                    <a href={`mailto:${email}`} className="hover:underline">
                      {email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-neutral-900 uppercase">Working Days</h4>
                  <p className="text-neutral-600 mt-0.5">Saturday - Thursday: 10:00 AM – 8:00 PM</p>
                  <p className="text-neutral-500 text-[11px]">Friday: Closed for dispatch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-50 p-6 sm:p-10 rounded-2xl border border-neutral-200">
              <h3 className="text-base font-black uppercase tracking-wider text-neutral-900 mb-6 pb-3 border-b border-neutral-200">
                Send Us a Message
              </h3>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-neutral-900 text-lg">Thank You!</h4>
                  <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                    Your message has been received. Our team will review your inquiry and get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017xxxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-800 mb-1.5">Subject</label>
                      <input
                        type="text"
                        placeholder="Order status, Size question, etc."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-800 mb-1.5">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3 bg-white border border-neutral-300 rounded-lg outline-none focus:border-black font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
