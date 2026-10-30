/* story.js — carousel หน้า story.html
   จุด (dots) และตัวนับสร้างอัตโนมัติตามจำนวนสไลด์ → เพิ่มสไลด์ใน HTML ได้เลย */
(function () {
  const track = document.querySelector(".carousel__track");
  if (!track) return;

  const slides = [...track.querySelectorAll(".carousel__slide")];
  const pills = [...document.querySelectorAll(".category-pills .pill")];
  const dotsBox = document.querySelector(".carousel__dots");
  const current = document.querySelector("#carouselCurrent");
  const total = document.querySelector("#carouselTotal");
  const pad = (n) => String(n).padStart(2, "0");
  let active = 0;

  total.textContent = `/ ${pad(slides.length)}`;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", `Category ${i + 1}`);
    dot.addEventListener("click", () => show(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  function show(index) {
    active = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${active * 100}%)`;
    slides.forEach((s, i) => s.setAttribute("aria-hidden", String(i !== active)));
    pills.forEach((p, i) => p.classList.toggle("is-active", i === active));
    dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
    current.textContent = pad(active + 1);
  }

  document.querySelector(".carousel__arrow--next").addEventListener("click", () => show(active + 1));
  document.querySelector(".carousel__arrow--prev").addEventListener("click", () => show(active - 1));
  pills.forEach((p, i) => p.addEventListener("click", () => show(i)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(active + 1);
    if (e.key === "ArrowLeft") show(active - 1);
  });

  // ปัดบนมือถือ
  const viewport = document.querySelector(".carousel__viewport");
  let startX = 0;
  viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) show(active + (delta < 0 ? 1 : -1));
  }, { passive: true });

  show(0);
})();
