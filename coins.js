
"use strict";

/* ========================================
   NERA COINS — إعدادات عملات المتجر
   تعديل أسعار المنتجات يتم من هذا الملف
======================================== */

const NERA_COINS = {
  currencyName: "NERA",
  currencySymbol: "🪙",

  products: {
    "إطار النيون الملكي": {
      id: "royal-neon-frame",
      price: 500,
      rarity: "نادر"
    },

    "إطار سايبر سماوي": {
      id: "cyber-cyan-frame",
      price: 250,
      rarity: "مميز"
    },

    "شارة الأسطورة": {
      id: "legendary-badge",
      price: 2500,
      rarity: "أسطوري"
    },

    "شارة النخبة": {
      id: "elite-badge",
      price: 250,
      rarity: "مميز"
    },

    "تأثير الاسم النيون": {
      id: "neon-name-effect",
      price: 250,
      rarity: "مميز"
    },

    "تأثير الاسم الناري": {
      id: "fire-name-effect",
      price: 1000,
      rarity: "ملحمي"
    }
  }
};

/* الحصول على سعر منتج بالاسم */
function getNeraProductPrice(productName) {
  const product = NERA_COINS.products[productName];
  return product ? product.price : null;
}

/* تنسيق السعر للعرض */
function formatNeraCoins(amount) {
  return Number(amount).toLocaleString("en-US") + " NERA";
}

/* إتاحة الإعدادات لباقي ملفات الموقع */
if (typeof window !== "undefined") {
  window.NERA_COINS = NERA_COINS;
  window.getNeraProductPrice = getNeraProductPrice;
  window.formatNeraCoins = formatNeraCoins;
}
