import React from 'react';

/**
 * Renders one or more JSON-LD blocks.
 *
 * Server component on purpose: keep it out of 'use client' trees so the
 * structured data is present in the initial HTML that crawlers read.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
