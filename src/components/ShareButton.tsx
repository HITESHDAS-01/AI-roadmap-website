"use client";

import { useState } from "react";
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, MessageCircle, Link as LinkIcon } from "lucide-react";

interface ShareButtonProps {
  topic: string;
  title: string;
}

export default function ShareButton({ topic, title }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out this AI-powered learning roadmap for ${title} 🚀`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-400",
      bg: "hover:bg-sky-500/10",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-400",
      bg: "hover:bg-blue-500/10",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-500",
      bg: "hover:bg-blue-600/10",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-400",
      bg: "hover:bg-green-500/10",
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
  ];

  return (
    <div className="relative">
      {/* Native Share (mobile) / Dropdown toggle (desktop) */}
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <LinkIcon className="w-4 h-4 text-gray-400" />
              )}
              <span className={`text-sm ${copied ? "text-green-400" : "text-gray-300"}`}>
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>

            {/* Social Platforms */}
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 text-left ${platform.bg} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                <platform.icon className={`w-4 h-4 ${platform.color}`} />
                <span className="text-sm text-gray-300">{platform.name}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
