export function highlightJson(str) {
  const esc = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let cls = "j-num";
      if (m.startsWith('"')) cls = m.endsWith(":") ? "j-key" : "j-str";
      else if (m === "true" || m === "false") cls = "j-bool";
      else if (m === "null") cls = "j-null";
      return `<span class="${cls}">${m}</span>`;
    }
  );
}
