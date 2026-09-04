import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RoadmapAI Terms of Service — guidelines for using our AI-powered learning roadmap platform.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const lastUpdated = "September 4, 2026";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using RoadmapAI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            RoadmapAI provides AI-generated learning roadmaps and resource recommendations. The Service uses artificial intelligence to create structured learning paths based on user-provided topics.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Use the Service only for lawful purposes</li>
            <li>Not attempt to disrupt or overload the Service</li>
            <li>Not use automated tools to access the Service without permission</li>
            <li>Not submit harmful, offensive, or inappropriate topics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Intellectual Property</h2>
          <p>
            The Service, including its design, code, and branding, is the property of RoadmapAI. Generated roadmaps are provided for personal, non-commercial use. You may share them freely.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. While we strive for accuracy, we do not guarantee that generated roadmaps or resource recommendations are complete, accurate, or suitable for your needs. Always verify information independently.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Limitation of Liability</h2>
          <p>
            RoadmapAI shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us (which is currently $0).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Third-Party Links</h2>
          <p>
            Roadmaps contain links to third-party websites and resources. We are not responsible for the content, accuracy, or policies of these external sites.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">8. Service Availability</h2>
          <p>
            We may modify, suspend, or discontinue the Service at any time without notice. We are not liable for any interruption or unavailability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">9. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">10. Contact</h2>
          <p>
            For questions about these Terms, visit our{" "}
            <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
              contact page
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
