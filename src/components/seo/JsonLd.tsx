// Renders one or more schema.org objects as a JSON-LD script tag.
export function JsonLd({ data }: { data: Record<string, any> | Record<string, any>[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
