/* collection.js — สร้างการ์ดตัวละครจาก characters.js
   ใช้กับ thaifilm / foreignfilm / animation / collang
   - หน้าหมวด: <body data-category="thai">
   - หน้ารวม (collang): ไม่ใส่ data-category → แสดงทั้งหมด + ปุ่มกรอง (?cat=thai) */
(function () {
  const grid = document.querySelector("[data-character-grid]");
  if (!grid) return;

  const fixedCategory = document.body.dataset.category || "";
  const filterBox = document.querySelector("[data-filter]");
  const countEl = document.querySelector("[data-count]");
  let active = fixedCategory || new URLSearchParams(location.search).get("cat") || "all";
  if (active !== "all" && !COLLECTIONS[active]) active = "all";

  /* ---------- ส่วนหัวของหน้าหมวด ---------- */
  if (fixedCategory && COLLECTIONS[fixedCategory]) {
    const info = COLLECTIONS[fixedCategory];
    document.title = `${info.title} | Characters That Stay`;
    setHTML("[data-hero-eyebrow]", `COLLECTION / ${info.label}`);
    setHTML("[data-hero-title]", `${info.title} <span>Characters</span>`);
    setHTML("[data-hero-intro]", info.intro);
  }

  /* ---------- ปุ่มกรอง (เฉพาะหน้ารวม) ---------- */
  if (filterBox && !fixedCategory) {
    const options = [["all", "All"]].concat(
      Object.entries(COLLECTIONS).map(([key, info]) => [key, info.title])
    );
    options.forEach(([key, label]) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "pill";
      pill.textContent = label;
      pill.dataset.cat = key;
      pill.addEventListener("click", () => {
        active = key;
        const url = key === "all" ? location.pathname : `?cat=${key}`;
        history.replaceState(null, "", url);
        render();
      });
      filterBox.appendChild(pill);
    });
  }

  render();

  /* ---------- สร้างการ์ด ---------- */
  function render() {
    const list = active === "all"
      ? CHARACTERS
      : CHARACTERS.filter((c) => c.category === active);

    grid.replaceChildren(...list.map(createCard));

    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "archive__empty";
      empty.textContent = "ยังไม่มีตัวละครในหมวดนี้";
      grid.appendChild(empty);
    }

    if (countEl) {
      countEl.textContent = `${String(list.length).padStart(2, "0")} CHARACTERS`;
    }

    if (filterBox) {
      filterBox.querySelectorAll(".pill").forEach((p) =>
        p.classList.toggle("is-active", p.dataset.cat === active)
      );
    }
  }

  function createCard(character, index) {
    const label = COLLECTIONS[character.category]?.label || "";

    const card = el("a", "character-card");
    card.href = `character-detail.html?id=${encodeURIComponent(character.id)}`;

    const media = el("div", "character-card__image");
    const img = el("img");
    img.src = character.image;
    img.alt = character.name;
    img.loading = "lazy";
    if (character.focus) img.style.objectPosition = character.focus;
    media.append(
      img,
      el("span", "character-card__index", String(index + 1).padStart(2, "0")),
      el("span", "character-card__open", "VIEW STORY ↗")
    );

    const meta = el("div", "character-card__meta");
    meta.append(el("span", "", character.film), el("span", "", label));

    card.append(
      media,
      meta,
      el("h2", "character-card__name", character.name),
      el("p", "character-card__tag", character.tag)
    );
    return card;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function setHTML(selector, html) {
    const node = document.querySelector(selector);
    if (node) node.innerHTML = html;
  }
})();
