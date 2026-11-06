"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const t = setTimeout(() => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);
  return null;
}
