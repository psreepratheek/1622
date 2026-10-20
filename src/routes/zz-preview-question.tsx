import { createFileRoute } from "@tanstack/react-router";
import { LoveQuestion } from "@/components/birthday/LoveQuestion";

// Temporary preview page for checking the last question. Delete after use.
export const Route = createFileRoute("/zz-preview-question")({
  component: () => (
    <div className="relative min-h-[100dvh] text-foreground">
      <div aria-hidden className="fixed inset-0 -z-10 bg-dream" />
      <section className="safe-pad flex min-h-[100dvh] w-full items-center justify-center py-16">
        <LoveQuestion onReplay={() => {}} />
      </section>
    </div>
  ),
});
