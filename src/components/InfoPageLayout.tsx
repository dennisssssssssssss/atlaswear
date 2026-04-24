import { ReactNode } from "react";

interface InfoPageLayoutProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}

const InfoPageLayout = ({
  eyebrow,
  title,
  intro,
  children,
}: InfoPageLayoutProps) => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-4xl">
        <div className="max-w-3xl mb-12">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            {eyebrow}
          </p>
          <h1 className="font-heading text-4xl md:text-5xl mb-4">{title}</h1>
          <p className="text-muted-foreground leading-relaxed">{intro}</p>
        </div>

        <div className="space-y-10">{children}</div>
      </div>
    </div>
  );
};

export default InfoPageLayout;
