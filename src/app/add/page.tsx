import { tracks } from "@/lib/data";
import AddQuestionForm, { type TrackMeta } from "@/components/AddQuestionForm";

export const metadata = {
  title: "Add a question · Code Ladder",
  description: "Generate a ready-to-paste question JSON snippet for any track.",
};

export default function AddPage() {
  const meta: TrackMeta[] = tracks.map((t) => ({
    id: t.id,
    title: t.title,
    refsLabel: t.refsLabel,
    topics: t.topics.map((tp) => ({
      id: tp.id,
      title: tp.title,
      categories: Array.from(new Set(tp.questions.map((q) => q.category))),
    })),
  }));
  return <AddQuestionForm tracks={meta} />;
}
