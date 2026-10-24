'use client';

import React from 'react';
import { StorefrontView } from '../../../components/storefront/StorefrontView';

export default function StorefrontPage({ params }: { params?: { slug?: string } }) {
  const slug = params?.slug || 'tehran-boutique';
  return (
    <StorefrontView
      storeSlug={slug}
      onGoHome={() => {
        window.location.href = '/';
      }}
    />
  );
}
