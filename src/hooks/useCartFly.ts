/**
 * useCartFly — Sepete ürün eklendiğinde küçük görsel sepet ikonuna doğru uçar.
 * Kullanım:
 *   const { flyToCart } = useCartFly();
 *   flyToCart(imageUrl, clientX, clientY);
 */

export function useCartFly() {
  const flyToCart = (
    imgSrc: string,
    startX: number,
    startY: number
  ) => {
    // Sepet ikonunu bul
    const cartBtn = document.querySelector("[data-cart-icon]") as HTMLElement | null;
    if (!cartBtn) return;

    const cartRect = cartBtn.getBoundingClientRect();
    const targetX = cartRect.left + cartRect.width / 2;
    const targetY = cartRect.top + cartRect.height / 2;

    // Uçan element oluştur
    const fly = document.createElement("div");
    fly.style.cssText = `
      position: fixed;
      z-index: 9999;
      left: ${startX - 28}px;
      top: ${startY - 28}px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      border: 2px solid #c9a96e;
      pointer-events: none;
      transition: none;
      will-change: transform, opacity;
    `;

    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    fly.appendChild(img);
    document.body.appendChild(fly);

    // Animasyon — ürün sepete uçuyor
    const dx = targetX - startX;
    const dy = targetY - startY;

    fly.animate(
      [
        {
          transform: "translate(0, 0) scale(1)",
          opacity: 1,
        },
        {
          transform: `translate(${dx * 0.4}px, ${dy * 0.1}px) scale(0.8)`,
          opacity: 0.95,
          offset: 0.3,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
          opacity: 0,
        },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        fill: "forwards",
      }
    ).onfinish = () => {
      fly.remove();
      // Sepet ikonunu kısa süre vurgula
      cartBtn.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.35)" },
          { transform: "scale(1)" },
        ],
        { duration: 320, easing: "cubic-bezier(0.34,1.56,0.64,1)" }
      );
    };
  };

  return { flyToCart };
}
