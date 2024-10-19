"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { useAuth } from "@/context/AuthContext";

export function Providers({ children }) {
  const { openCart } = useAuth();
  useEffect(() => {
    let lenis = new Lenis({
      duration: 1.2, // Scrolling speed (you can adjust this)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      smooth: true,
    });

    if (openCart == true) {
      lenis.destroy()
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }

    return () => {
      // Cleanup Lenis on component unmount
      lenis.destroy();
    };
  }, [openCart]);

  return <Provider store={store}>{children}</Provider>;
}
