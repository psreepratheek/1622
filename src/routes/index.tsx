import { createFileRoute } from "@tanstack/react-router";
import { BirthdayApp } from "@/components/birthday/BirthdayApp";
import { content } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `For ${content.herName} 💗` },
      { name: "description", content: `A little birthday surprise for ${content.herName}.` },
      { property: "og:title", content: `For ${content.herName} 💗` },
      { property: "og:description", content: `A little birthday surprise for ${content.herName}.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayApp,
});
