"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, Send, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contact Us</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Have questions, feedback, or suggestions? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2 text-purple-400">
            <Mail className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Email</h3>
          <p className="text-xs text-gray-500">hello@roadmapai.dev</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2 text-blue-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">Feedback</h3>
          <p className="text-xs text-gray-500">Share your suggestions</p>
        </div>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2 text-green-400">
            <ExternalLink className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-white mb-1">GitHub</h3>
          <p className="text-xs text-gray-500">Report issues</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {submitted ? (
          <div className="rounded-xl bg-white/[0.03] border border-green-500/20 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <Send className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-sm text-gray-400 mb-4">
              Thanks for reaching out. We&apos;ll get back to you as soon as possible.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormState({ name: "", email: "", subject: "", message: "" });
              }}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-400 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-xs font-medium text-gray-400 mb-1.5">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs font-medium text-gray-400 mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                placeholder="Tell us what you think..."
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
