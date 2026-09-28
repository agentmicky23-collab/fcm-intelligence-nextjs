/** schema.org structured data for search engines and AI assistants. */
export function JsonLd({ data }: { data: object | object[] }) {
  const graph = { "@context": "https://schema.org", "@graph": Array.isArray(data) ? data : [data] };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here once "<" is escaped, so no script can be closed early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
