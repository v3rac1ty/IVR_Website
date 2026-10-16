// One scroll-reveal system for the whole page: any element with the `reveal` class
// fades up once when it enters the viewport. Optional `--reveal-delay` staggers siblings.
// A MutationObserver picks up elements from lazy-loaded sections as they mount.
export const startReveal = () => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" }
  );

  const scan = (root) => {
    if (root.nodeType !== 1) return;
    if (root.matches(".reveal:not(.is-revealed)")) io.observe(root);
    root.querySelectorAll(".reveal:not(.is-revealed)").forEach((el) => io.observe(el));
  };

  scan(document.body);
  new MutationObserver((mutations) => {
    mutations.forEach((m) => m.addedNodes.forEach(scan));
  }).observe(document.body, { childList: true, subtree: true });
};
