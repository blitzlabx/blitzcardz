"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let hideTimer;
    const start = () => {
      setComplete(false);
      setVisible(true);
    };
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    setComplete(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setComplete(false);
    }, 260);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className={`navigation-progress${visible ? " is-visible" : ""}${complete ? " is-complete" : ""}`} aria-hidden="true">
      <span />
    </div>
  );
}
