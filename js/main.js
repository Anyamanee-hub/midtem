/* main.js — ใช้ทุกหน้า: ปุ่มเมนูมือถือ + ไฮไลต์เมนูของหน้าปัจจุบัน
   กำหนดเมนูที่ active ด้วย <body data-nav="home|story|collection"> */
(function () {
  const nav = document.querySelector(".main-nav");
  const button = document.querySelector(".menu-toggle");

  if (nav && button) {
    button.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
    });
  }

  const current = document.body.dataset.nav;
  if (nav && current) {
    nav.querySelectorAll("a[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }
    });
  }
})();
