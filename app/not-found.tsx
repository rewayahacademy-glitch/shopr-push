import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-bg">
      <span className="text-6xl mb-6 text-teal/20 font-outfit font-bold select-none">404</span>
      <h1 className="font-outfit font-bold text-h2 text-slate mb-3">Page introuvable</h1>
      <p className="text-teal/60 text-body-lg mb-8 max-w-sm">
        Cette page n&apos;existe pas ou a été déplacée. Revenez à l&apos;accueil pour explorer nos sélections.
      </p>
      <Button href="/" variant="secondary" size="lg">
        Retour à l&apos;accueil
      </Button>
    </div>
  );
}
