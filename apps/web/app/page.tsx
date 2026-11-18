import type { Metadata } from "next";
import { APP_NAME } from "@askwell/shared";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { Demo } from "../components/landing/Demo";
import { Pricing } from "../components/landing/Pricing";
import { InstallSnippet } from "../components/landing/InstallSnippet";
import { Footer } from "../components/landing/Footer";

export const metadata: Metadata = {
  title: `${APP_NAME} — AI support chat for any website`,
  description: `Add an AI-powered support bot to your website in minutes. ${APP_NAME} answers visitor questions from your product docs.`,
};

export default function LandingPage() {
  return (
    <div data-theme="dark" className="min-h-screen overflow-x-hidden bg-bg text-fg">
      {/* Hero entrance keyframes — only under prefers-reduced-motion: no-preference */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes landing-fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0);   }
          }
          .hero-animate-1 { animation: landing-fade-up 0.7s ease both; }
          .hero-animate-2 { animation: landing-fade-up 0.7s ease 0.15s both; }
          .hero-animate-3 { animation: landing-fade-up 0.7s ease 0.3s both; }
        }
      `}</style>
      <Hero />
      <HowItWorks />
      <Demo />
      <Pricing />
      <InstallSnippet />
      <Footer />
    </div>
  );
}
