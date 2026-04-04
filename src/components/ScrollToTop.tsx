import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kısa timeout ile mobil tarayıcı render'ını bekle
    const timer = setTimeout(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;