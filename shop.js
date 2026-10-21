
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
  
  // شراء منتجات NERA من خلال Supabase
  let neraSupabaseClient = null;

  async function getNeraSupabase() {
    if (neraSupabaseClient) return neraSupabaseClient;

    const { createClient } = await import(
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
    );

    neraSupabaseClient = createClient(
      "https://aboenvwqlzmbjyqisarb.supabase.co",
      "sb_publishable_-U554BTwIf6tP-DA9uRgCg_5w5_XtU3"
    );

    return neraSupabaseClient;
  }

  document.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const productName = button.dataset.buy;
      const product = NERA_COINS.products[productName];

      if (!product) {
        alert("المنتج ده لسه مش متجهز للشراء في نظام العملات.");
        return;
      }

      if (!confirm(
        `تأكيد شراء ${productName} مقابل ${formatNeraCoins(product.price)} عملة NERA؟`
      )) {
        return;
      }

      const originalText = button.textContent;
      button.disabled = true;
      button.textContent = "جاري الشراء...";

      try {
        const supabase = await getNeraSupabase();

        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          alert("سجّل دخولك الأول علشان تشتري المنتج.");
          window.location.href = "login.html";
          return;
        }

        const { data, error } = await supabase.rpc(
          "buy_nera_product",
          { p_product_id: product.id }
        );

        if (error) throw error;

        const result = Array.isArray(data) ? data[0] : data;

        if (!result || result.success !== true) {
          alert(
            result?.message ||
            result?.error ||
            "الشراء لم يكتمل. راجع رصيدك أو ملكيتك للمنتج."
          );
          return;
        }

        button.textContent = "تم الشراء ✓";
        button.disabled = true;

        alert(
          `تم شراء ${result.product_name || productName} بنجاح!\n` +
          `رصيدك المتبقي: ${result.remaining_balance ?? "تم تحديثه"} NERA`
        );
      } catch (error) {
        console.error("NERA purchase error:", error);
        alert(
          "حصل خطأ أثناء الشراء. اتأكد من اتصال الإنترنت وإعدادات Supabase."
        );
      } finally {
        if (!button.textContent.includes("تم الشراء")) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
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
  // المنتجات المتاحة حاليًا: 6 صور مختلفة بدون تكرار
  const productImages = {
    "إطار النيون الملكي": "avatar-frame-royal.png",
    "إطار سايبر سماوي": "wings-cyber.png",
    "شارة الأسطورة": "badge-legendary.png",
    "شارة النخبة": "shield-cyber.png",
    "تأثير الاسم النيون": "name-neon-legendary.png",
    "تأثير الاسم الناري": "crystal-energy.png"
  };
  
  // عرض أسعار المنتجات من ملف coins.js
  productCards.forEach((card) => {
    const productName = card.dataset.name;
    const price = getNeraProductPrice(productName);
    const footer = card.querySelector(".product-footer");

    if (price === null || !footer) return;

    let priceLabel = footer.querySelector(".product-price");

    if (!priceLabel) {
      priceLabel = document.createElement("span");
      priceLabel.className = "product-price";
      priceLabel.style.cssText =
        "display:inline-flex;align-items:center;gap:6px;font-weight:800;direction:ltr;";

      const coinImage = footer.querySelector(".price-coin");

      if (coinImage) {
        coinImage.insertAdjacentElement("afterend", priceLabel);
      } else {
        footer.prepend(priceLabel);
      }
    }

    priceLabel.textContent = formatNeraCoins(price);
  });


  productCards.forEach((card) => {
    const productName = card.dataset.name;
    const imageName = productImages[productName];
    const visual = card.querySelector(".product-visual");

    // إخفاء المنتجات التي لم تتوفر لها صورة بعد
    if (!imageName || !visual) {
      card.hidden = true;
      return;
    }

    card.hidden = false;

    const image = document.createElement("img");
    image.src = imageName;
    image.alt = productName;
    image.loading = "lazy";

    image.style.cssText = [
      "display:block",
      "width:100%",
      "height:190px",
      "object-fit:contain",
      "padding:14px",
      "box-sizing:border-box",
      "position:relative",
      "z-index:2"
    ].join(";");

    visual.querySelectorAll(
      ".avatar-preview, .badge-emblem, .name-preview"
    ).forEach((oldShape) => oldShape.remove());

    visual.insertBefore(
      image,
      visual.querySelector(".visual-caption")
    );
  });

  // تحديث عدد المنتجات الظاهرة عند فتح المتجر.
  updateProducts();
  updateProducts();

  console.info("NERA Store initialized successfully.");
});
