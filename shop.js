
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const searchInput = document.getElementById("productSearch");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = Array.from(
    document.querySelectorAll(".product-card")
  );
  const productCount = document.getElementById("productCount");
  const emptyState = document.getElementById("emptyState");

  const previewModal = document.getElementById("previewModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCloseButtons = document.querySelectorAll("[data-close-modal]");

  if (!productGrid || !searchInput || !previewModal || !modalTitle) {
    console.error("NERA Store: required HTML elements are missing.");
    return;
  }

  let activeFilter = "all";
  let previousFocus = null;

  function normalizeText(value) {
    return String(value || "")
      .trim()
      .toLocaleLowerCase("ar");
  }

  function updateProducts() {
    const query = normalizeText(searchInput.value);
    let visibleCount = 0;

    productCards.forEach((card) => {
      const category = card.dataset.category || "";
      const name = card.dataset.name || "";
      const searchableText = normalizeText(
        `${name} ${card.textContent}`
      );

      const matchesCategory =
        activeFilter === "all" || category === activeFilter;

      const matchesSearch =
        query.length === 0 || searchableText.includes(query);

      const visible = matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) {
        visibleCount++;
      }
    });

    if (productCount) {
      productCount.textContent = String(visibleCount);
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const selected = item === button;

        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      updateProducts();
    });

    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === activeFilter)
    );
  });

  searchInput.addEventListener("input", updateProducts);

  function openPreview(productName, trigger) {
    previousFocus = trigger || document.activeElement;
    modalTitle.textContent = productName || "معاينة العنصر";
    previewModal.hidden = false;
    document.body.style.overflow = "hidden";

    const closeButton = previewModal.querySelector(
      "button[data-close-modal]"
    );

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closePreview() {
    if (previewModal.hidden) return;

    previewModal.hidden = true;
    document.body.style.overflow = "";

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  document.querySelectorAll("[data-preview]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.preview || "معاينة العنصر";
      openPreview(name, button);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closePreview);
  });

  previewModal.addEventListener("click", (event) => {
    if (event.target === previewModal) {
      closePreview();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !previewModal.hidden) {
      closePreview();
    }
  });

  // تحديث عدد المنتجات الظاهرة عند فتح المتجر.
  updateProducts();

  console.info("NERA Store initialized successfully.");
});
