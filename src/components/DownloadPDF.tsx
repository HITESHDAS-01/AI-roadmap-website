"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import type { Roadmap } from "@/types/roadmap";

export default function DownloadPDF({ roadmap }: { roadmap: Roadmap }) {
  const [generating, setGenerating] = useState(false);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "roadmapai.dev";

  const handleDownload = async () => {
    setGenerating(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // Get site name from URL
      const siteName = siteUrl.replace("https://", "").replace("http://", "").split(".")[0];
      const displayName = siteName.charAt(0).toUpperCase() + siteName.slice(1);

      const checkPage = (needed: number) => {
        if (y + needed > doc.internal.pageSize.getHeight() - 25) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(168, 85, 247);
      doc.setFontSize(26);
      doc.setFont("helvetica", "bold");
      doc.text(displayName, margin, 20);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("AI-Powered Learning Roadmaps", margin, 28);

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} from ${siteUrl}`, margin, 36);

      y = 55;

      // Title
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(roadmap.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 9 + 4;

      // Description
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(roadmap.description, contentWidth);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 6;

      // Meta badges
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Duration: ${roadmap.totalEstimatedTime}  |  Phases: ${roadmap.phases.length}  |  Steps: ${roadmap.phases.reduce((a, p) => a + p.steps.length, 0)}`, margin, y);
      y += 12;

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;

      // Phases
      for (const phase of roadmap.phases) {
        checkPage(35);

        // Phase header
        doc.setFillColor(168, 85, 247);
        doc.roundedRect(margin, y - 5, 10, 10, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const phaseIndex = roadmap.phases.indexOf(phase) + 1;
        doc.text(String(phaseIndex), margin + 5, y + 1.5);

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(phase.title, margin + 14, y + 2);

        doc.setTextColor(120, 120, 120);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${phase.estimatedTime}  |  ${phase.steps.length} steps`, pageWidth - margin, y + 2, { align: "right" });
        y += 10;

        // Phase description
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(10);
        const phaseDesc = doc.splitTextToSize(phase.description, contentWidth - 14);
        doc.text(phaseDesc, margin + 14, y);
        y += phaseDesc.length * 4.5 + 5;

        // Steps
        for (const step of phase.steps) {
          checkPage(25);

          // Step box
          doc.setFillColor(248, 248, 248);
          doc.roundedRect(margin + 14, y, contentWidth - 14, 8, 1, 1, "F");

          doc.setTextColor(40, 40, 40);
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(step.title, margin + 18, y + 5.5);

          doc.setTextColor(140, 140, 140);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(`${step.duration}  |  ${step.difficulty}`, pageWidth - margin - 4, y + 5.5, { align: "right" });
          y += 10;

          // Step summary (if exists)
          if (step.summary) {
            doc.setTextColor(100, 80, 160);
            doc.setFontSize(9);
            doc.setFont("helvetica", "italic");
            const summaryLines = doc.splitTextToSize(step.summary, contentWidth - 20);
            doc.text(summaryLines, margin + 18, y);
            y += summaryLines.length * 4 + 3;
          }

          // Step description
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(10);
          const stepDesc = doc.splitTextToSize(step.description, contentWidth - 20);
          doc.text(stepDesc, margin + 18, y);
          y += stepDesc.length * 4.5 + 3;

          // Tips
          if (step.tips && step.tips.length > 0) {
            doc.setTextColor(180, 140, 0);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text("Tips:", margin + 18, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            for (const tip of step.tips) {
              checkPage(6);
              doc.setTextColor(100, 100, 100);
              doc.setFontSize(9);
              const tipLines = doc.splitTextToSize(`• ${tip}`, contentWidth - 24);
              doc.text(tipLines, margin + 20, y);
              y += tipLines.length * 4 + 1;
            }
            y += 2;
          }

          // Resources
          if (step.resources.length > 0) {
            doc.setTextColor(168, 85, 247);
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.text(`Resources (${step.resources.length}):`, margin + 18, y);
            y += 6;
            doc.setFont("helvetica", "normal");

            for (const resource of step.resources) {
              checkPage(10);
              doc.setTextColor(60, 60, 60);
              doc.setFontSize(9);

              const typeEmoji = resource.type === "video" ? "[Video]" : resource.type === "course" ? "[Course]" : "[Article]";
              const freeLabel = resource.free ? " (Free)" : "";
              const resTitle = doc.splitTextToSize(`${typeEmoji} ${resource.title}${freeLabel}`, contentWidth - 28);
              doc.text(resTitle, margin + 20, y);
              y += resTitle.length * 4;

              doc.setTextColor(100, 140, 200);
              doc.setFontSize(8);
              const urlText = resource.url.length > 90 ? resource.url.substring(0, 90) + "..." : resource.url;
              doc.text(urlText, margin + 20, y);
              y += 5;
            }
          }

          y += 4;
        }

        y += 8;
      }

      // Popular Online Courses Section
      checkPage(80);
      y += 5;

      // Divider
      doc.setDrawColor(168, 85, 247);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      doc.setTextColor(168, 85, 247);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Explore More on Popular Platforms", margin, y);
      y += 8;

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Continue your learning journey with these top platforms:", margin, y);
      y += 10;

      const topic = roadmap.topic;
      const encoded = encodeURIComponent(topic);

      const platforms = [
        { name: "Coursera", desc: "University courses & certificates", url: `https://www.coursera.org/search?query=${encoded}` },
        { name: "Udemy", desc: "Affordable practical courses", url: `https://www.udemy.com/courses/search/?q=${encoded}` },
        { name: "edX", desc: "Harvard, MIT & top university courses", url: `https://www.edx.org/search?q=${encoded}` },
        { name: "freeCodeCamp", desc: "Free coding bootcamps & tutorials", url: `https://www.freecodecamp.org/news/search/?query=${encoded}` },
        { name: "Khan Academy", desc: "Free world-class education", url: `https://www.khanacademy.org/search?search_query=${encoded}` },
        { name: "LinkedIn Learning", desc: "Professional skill development", url: `https://www.linkedin.com/learning/search?keywords=${encoded}` },
        { name: "Pluralsight", desc: "Tech skills & certifications", url: `https://www.pluralsight.com/search?q=${encoded}` },
        { name: "Skillshare", desc: "Creative & practical skills", url: `https://www.skillshare.com/en/search?query=${encoded}` },
        { name: "MIT OpenCourseWare", desc: "Free MIT course materials", url: `https://ocw.mit.edu/search/?q=${encoded}` },
        { name: "Stanford Online", desc: "Stanford courses & programs", url: `https://online.stanford.edu/search?q=${encoded}` },
      ];

      for (const platform of platforms) {
        checkPage(12);

        // Platform name
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`• ${platform.name}`, margin + 2, y);
        y += 5;

        // Description
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(platform.desc, margin + 8, y);
        y += 4;

        // URL
        doc.setTextColor(100, 140, 200);
        doc.setFontSize(8);
        doc.text(platform.url, margin + 8, y);
        y += 7;
      }

      y += 5;

      // Footer + Watermark on every page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Vertical watermark on right margin
        const pageHeight = doc.internal.pageSize.getHeight();
        const rightX = pageWidth - 5;

        // Site name - vertical (top to bottom)
        doc.setFontSize(8);
        doc.setTextColor(215, 215, 215);
        doc.setFont("helvetica", "bold");
        for (let j = 0; j < displayName.length; j++) {
          doc.text(displayName[j], rightX, 50 + j * 3.5, { align: "right" });
        }

        // URL - vertical (below name)
        doc.setFontSize(6);
        doc.setTextColor(225, 225, 225);
        doc.setFont("helvetica", "normal");
        const urlShort = siteUrl.replace("https://", "").replace("http://", "");
        for (let j = 0; j < urlShort.length; j++) {
          doc.text(urlShort[j], rightX, 50 + displayName.length * 3.5 + 8 + j * 3, { align: "right" });
        }

        // Page number
        doc.setFontSize(8);
        doc.setTextColor(180, 180, 180);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 4, { align: "center" });

        // Last page credits
        if (i === totalPages) {
          doc.setFontSize(10);
          doc.setTextColor(140, 140, 140);
          doc.text("Built by Pranjit", pageWidth / 2, pageHeight - 14, { align: "center" });
          doc.setFontSize(8);
          doc.setTextColor(180, 180, 180);
          doc.text(`AI-Powered Learning Roadmaps | ${siteUrl}`, pageWidth / 2, pageHeight - 9, { align: "center" });
        }
      }

      const fileName = `${roadmap.topic.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-roadmap.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      {generating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {generating ? "Generating..." : "Download PDF"}
    </button>
  );
}
