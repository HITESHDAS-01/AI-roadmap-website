import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RoadmapAI Privacy Policy — learn how we handle your data and protect your privacy.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const lastUpdated = "September 4, 2026";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Information We Collect</h2>
          <p>
            RoadmapAI is designed with privacy in mind. We collect minimal data to provide our service:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-gray-300">Topic queries:</strong> The topics you search for are processed to generate roadmaps. We do not store your search history permanently.</li>
            <li><strong className="text-gray-300">Usage analytics:</strong> We use basic analytics to understand how our service is used (page views, referral sources). This data is anonymous.</li>
            <li><strong className="text-gray-300">Contact information:</strong> If you contact us via email or our contact form, we retain your message to respond to you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. How We Use Your Data</h2>
          <p>We use collected data solely to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Generate and deliver your learning roadmaps</li>
            <li>Improve our AI models and resource curation</li>
            <li>Respond to your inquiries</li>
            <li>Monitor and improve service performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Third-Party Services</h2>
          <p>
            We use third-party APIs to provide our service. These services may collect data as described in their own privacy policies:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong className="text-gray-300">OpenAI / Google Gemini:</strong> Used for AI-powered roadmap generation. Your topic query is sent to these APIs to generate responses.</li>
            <li><strong className="text-gray-300">SerpAPI:</strong> Used to search for educational resources. Your search queries may be processed by SerpAPI.</li>
            <li><strong className="text-gray-300">Vercel:</strong> Our hosting provider. Standard server logs are collected.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Cookies</h2>
          <p>
            RoadmapAI uses essential cookies only for basic site functionality. We do not use advertising or tracking cookies. You can disable cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Data Retention</h2>
          <p>
            Generated roadmaps are not stored on our servers. Once you leave the page, the data is gone. Contact form submissions are retained for 90 days then deleted.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Request deletion of any data we hold about you</li>
            <li>Request a copy of your data</li>
            <li>Opt out of analytics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Children&apos;s Privacy</h2>
          <p>
            Our service is not directed to individuals under 13. We do not knowingly collect data from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">9. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
              our contact page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
