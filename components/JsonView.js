import { highlightJson } from "@/lib/highlight";

export default function JsonView({ data, className = "" }) {
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  return <pre className={`json ${className}`} dangerouslySetInnerHTML={{ __html: highlightJson(text) }} />;
}
