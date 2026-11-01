/* detail.js — เติมข้อมูลหน้า character-detail.html?id=... จาก characters.js */
(function () {
  const id = new URLSearchParams(location.search).get("id");
  const character = getCharacter(id) || (!id ? CHARACTERS[0] : null);

  const $ = (selector) => document.querySelector(selector);
  const mainImage = $("#detailImage");
  const galleryGrid = $("#detailGallery");

  if (!character) {
    $("#detailName").textContent = "Character not found";
    $("#detailDescription").textContent =
      "ไม่พบข้อมูลตัวละคร กรุณาตรวจสอบ id ในลิงก์ หรือใน js/characters.js";
    ["#detailMedia", "#detailFilm", "#detailQuote", "#detailMemory", "#detailGalleryWrap"]
      .forEach((s) => ($(s).hidden = true));
    return;
  }

  const collection = COLLECTIONS[character.category] || {};

  document.title = `${character.name} | Characters That Stay`;

  $("#detailCategory").textContent =
    [collection.label, character.mood].filter(Boolean).join(" / ");
  $("#detailName").textContent = character.name;
  $("#detailSubtitle").textContent = character.nameEn || "";
  $("#detailFilmName").textContent = character.film || "";

  fill("#detailDescription", "#detailStory", character.description);
  fill("#detailQuoteText", "#detailQuote", character.quote ? `“${character.quote}”` : "");
  fill("#detailMemoryText", "#detailMemory", character.memory);

  // ลิงก์กลับไปหน้าหมวดของตัวละครนี้
  if (collection.page) $("#detailBack").href = collection.page;

  // รูปหลัก
  setMain(character.image, character.name);
  mainImage.addEventListener("error", () => {
    mainImage.alt = "ไม่พบไฟล์ภาพหลัก กรุณาตรวจสอบชื่อไฟล์";
  });

  // แกลเลอรี
  function getGallery(character) {
  return GALLERIES[character.id] || [];
  }

  const gallery = getGallery(character);
  $("#detailGalleryCount").textContent =
    `${String(gallery.length).padStart(2, "0")} / MOMENTS`;

  gallery.forEach((path, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `ดูภาพที่ ${i + 1}`);

    const img = document.createElement("img");
    img.src = path;
    img.alt = `${character.name} - moment ${i + 1}`;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      button.classList.add("is-missing");
      button.title = `ยังไม่มีรูป ${path}`;
      img.style.visibility = "hidden";   // ไม่โชว์ไอคอนรูปเสีย เหลือแค่กรอบ
    });

    button.addEventListener("click", () => {
      setMain(path, img.alt);
      mainImage.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    button.appendChild(img);
    galleryGrid.appendChild(button);
  });

  function setMain(src, alt) {
    mainImage.src = src;
    mainImage.alt = alt;
  }

  // ใส่ข้อความ ถ้าว่างให้ซ่อนทั้งส่วน
  function fill(textSelector, sectionSelector, text) {
    $(textSelector).textContent = text || "";
    $(sectionSelector).hidden = !text;
  }
})();
