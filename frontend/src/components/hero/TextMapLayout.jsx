/**
 * Live wireframe to validate content density & hierarchy.
 * Use temporarily on pages to preview “text amounts”.
 */
export default function TextMapLayout() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-slate-300 p-6">
          <h2 className="font-[Outfit] text-2xl font-bold text-slate-900">Section Heading</h2>
          <p className="prose mt-3 max-w-[60ch] text-slate-600">
            80–120 words target. Keep lines ~65ch for readability. This box helps you gauge the right
            amount of copy per section for students/professors: substantial but scannable.
          </p>
        </div>
        <div className="rounded-xl border border-dashed border-slate-300 p-6">
          <h3 className="font-[Outfit] text-xl font-semibold text-slate-900">Feature Card</h3>
          <p className="mt-2 max-w-[50ch] text-sm text-slate-600">
            35–50 words. Explain what it does and why it matters. Avoid jargon. End with the outcome.
          </p>
        </div>
      </div>
    </section>
  );
}
