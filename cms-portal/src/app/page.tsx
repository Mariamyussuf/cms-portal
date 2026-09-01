import { SiteHeader } from "@/components/marketing/site-header";
import { Hero } from "@/components/marketing/hero";
import { AssociationsStrip } from "@/components/marketing/associations-strip";
import { EventsTimeline } from "@/components/marketing/events-timeline";
import { StudentShowcase } from "@/components/marketing/student-showcase";
import { CTASection } from "@/components/marketing/cta-section";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <AssociationsStrip />
        <EventsTimeline />
        <StudentShowcase />
        <CTASection />
      </main>
      <SiteFooter />
    </>
  );
}
