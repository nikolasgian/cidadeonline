import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CtaSection } from "@/components/home/CtaSection";
import { QuickAccessSection } from "@/components/home/QuickAccessSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <QuickAccessSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;