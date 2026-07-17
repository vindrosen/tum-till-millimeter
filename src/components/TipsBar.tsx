import { BulbIcon } from "./Icons";
import ShareBar from "./ShareBar";

export default function TipsBar() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wood-soft text-wood-strong">
            <BulbIcon width={22} height={22} />
          </span>
          <div>
            <p className="font-display text-lg font-extrabold text-wood-strong">Tips!</p>
            <p className="mt-0.5 max-w-xl text-sm text-ink-soft">
              När man säger 2×4 menar man den nominella storleken. Det faktiska måttet är mindre
              efter hyvling – en hyvlad 2×4 blir 45 × 95 mm.
            </p>
          </div>
        </div>
        <ShareBar />
      </div>
    </div>
  );
}
