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
        if (y + needed > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, pageWidth, 40, "F");

      doc.setTextColor(168, 85, 247);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(displayName, margin, 18);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("AI-Powered Learning Roadmaps", margin, 26);

      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.text(`Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} from ${siteUrl}`, margin, 34);

      y = 50;

      // Title
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(roadmap.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 8 + 4;

      // Description
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(roadmap.description, contentWidth);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 4;

      // Meta badges
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Duration: ${roadmap.totalEstimatedTime}  |  Phases: ${roadmap.phases.length}  |  Steps: ${roadmap.phases.reduce((a, p) => a + p.steps.length, 0)}`, margin, y);
      y += 10;

      // Divider
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Phases
      for (const phase of roadmap.phases) {
        checkPage(30);

        // Phase header
        doc.setFillColor(168, 85, 247);
        doc.roundedRect(margin, y - 4, 8, 8, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        const phaseIndex = roadmap.phases.indexOf(phase) + 1;
        doc.text(String(phaseIndex), margin + 3.5, y + 1.5);

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(phase.title, margin + 12, y + 2);

        doc.setTextColor(120, 120, 120);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`${phase.estimatedTime}  |  ${phase.steps.length} steps`, pageWidth - margin, y + 2, { align: "right" });
        y += 8;

        // Phase description
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        const phaseDesc = doc.splitTextToSize(phase.description, contentWidth - 12);
        doc.text(phaseDesc, margin + 12, y);
        y += phaseDesc.length * 4 + 4;

        // Steps
        for (const step of phase.steps) {
          checkPage(20);

          // Step box
          doc.setFillColor(248, 248, 248);
          const stepBoxStart = y;
          doc.roundedRect(margin + 12, y, contentWidth - 12, 6, 1, 1, "F");

          doc.setTextColor(40, 40, 40);
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.text(step.title, margin + 16, y + 4.2);

          doc.setTextColor(140, 140, 140);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          doc.text(`${step.duration}  |  ${step.difficulty}`, pageWidth - margin - 4, y + 4.2, { align: "right" });
          y += 8;

          // Step description
          doc.setTextColor(80, 80, 80);
          doc.setFontSize(9);
          const stepDesc = doc.splitTextToSize(step.description, contentWidth - 16);
          doc.text(stepDesc, margin + 16, y);
          y += stepDesc.length * 4 + 2;

          // Tips
          if (step.tips && step.tips.length > 0) {
            doc.setTextColor(180, 140, 0);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text("Tips:", margin + 16, y);
            y += 4;
            doc.setFont("helvetica", "normal");
            for (const tip of step.tips) {
              checkPage(6);
              doc.setTextColor(100, 100, 100);
              doc.setFontSize(8);
              const tipLines = doc.splitTextToSize(`• ${tip}`, contentWidth - 20);
              doc.text(tipLines, margin + 18, y);
              y += tipLines.length * 3.5 + 1;
            }
            y += 1;
          }

          // Resources
          if (step.resources.length > 0) {
            doc.setTextColor(168, 85, 247);
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.text(`Resources (${step.resources.length}):`, margin + 16, y);
            y += 5;
            doc.setFont("helvetica", "normal");

            for (const resource of step.resources) {
              checkPage(8);
              doc.setTextColor(60, 60, 60);
              doc.setFontSize(8);

              const typeEmoji = resource.type === "video" ? "[Video]" : resource.type === "course" ? "[Course]" : "[Article]";
              const freeLabel = resource.free ? " (Free)" : "";
              const resTitle = doc.splitTextToSize(`${typeEmoji} ${resource.title}${freeLabel}`, contentWidth - 24);
              doc.text(resTitle, margin + 18, y);
              y += resTitle.length * 3.5;

              doc.setTextColor(100, 140, 200);
              doc.setFontSize(7);
              const urlText = resource.url.length > 80 ? resource.url.substring(0, 80) + "..." : resource.url;
              doc.text(urlText, margin + 18, y);
              y += 5;
            }
          }

          y += 3;
        }

        y += 6;
      }

      // Footer + Watermark on every page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Vertical watermark on right margin
        const pageHeight = doc.internal.pageSize.getHeight();
        const rightX = pageWidth - 5;

        // Site name - vertical (top to bottom)
        doc.setFontSize(7);
        doc.setTextColor(215, 215, 215);
        doc.setFont("helvetica", "bold");
        for (let j = 0; j < displayName.length; j++) {
          doc.text(displayName[j], rightX, 40 + j * 3.2, { align: "right" });
        }

        // URL - vertical (below name)
        doc.setFontSize(5);
        doc.setTextColor(225, 225, 225);
        doc.setFont("helvetica", "normal");
        const urlShort = siteUrl.replace("https://", "").replace("http://", "");
        for (let j = 0; j < urlShort.length; j++) {
          doc.text(urlShort[j], rightX, 40 + displayName.length * 3.2 + 8 + j * 2.8, { align: "right" });
        }

        // Page number
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 3, { align: "center" });

        // Last page credits
        if (i === totalPages) {
          doc.setFontSize(8);
          doc.setTextColor(140, 140, 140);
          doc.text("Built by Pranjit", pageWidth / 2, pageHeight - 12, { align: "center" });
          doc.setFontSize(7);
          doc.setTextColor(180, 180, 180);
          doc.text(`AI-Powered Learning Roadmaps | ${siteUrl}`, pageWidth / 2, pageHeight - 8, { align: "center" });
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
