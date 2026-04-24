import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { usePageMeta } from '@/hooks/use-page-meta';

const NotFound = () => {
  const location = useLocation();

  usePageMeta({
    title: 'Page Not Found',
    description: 'The page you requested does not exist.',
    path: location.pathname,
    noindex: true,
  });

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-2xl text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">404</p>
        <h1 className="font-heading text-4xl md:text-5xl mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/" className="text-gold hover:text-gold-light transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
