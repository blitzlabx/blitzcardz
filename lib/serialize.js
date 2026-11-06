export function publicCard(c) {
  const out = {
    id: c.id,
    tier: c.tier,
    title: c.title,
    url: c.url,
    series: c.series
  };
  if (c.event) out.event = c.event;
  return out;
}
