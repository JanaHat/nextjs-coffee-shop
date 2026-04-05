type QuestionStepProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function QuestionStep({ title, description, children }: QuestionStepProps) {
  return (
    <section className="app-surface rounded-2xl p-5 sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="app-muted mt-1 text-sm">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
