
/* =========================================
   NEYRA — SHARED EFFECTS ENGINE
   الإصدار الأول: شارة النخبة
   ========================================= */

(function () {
  "use strict";

  const BADGE_ID = "elite-badge";

  /**
   * إنشاء شارة النخبة.
   * لا تُنشأ الشارة إلا إذا كانت مفعّلة للحساب.
   *
   * @param {string|null} activeBadge
   * @param {"small"|"normal"|"large"} size
   * @returns {HTMLElement|null}
   */
  function createEliteBadge(activeBadge, size = "small") {
    if (activeBadge !== BADGE_ID) {
      return null;
    }

    const badge = document.createElement("span");

    badge.className = "nera-elite-badge";
    badge.classList.add(
      size === "large"
        ? "nera-elite-badge--large"
        : size === "normal"
          ? ""
          : "nera-elite-badge--small"
    );

    badge.setAttribute("aria-label", "شارة النخبة");
    badge.setAttribute("title", "شارة النخبة");
    badge.setAttribute("role", "img");

    // الرمز الرئيسي
    const icon = document.createElement("span");
    icon.className = "nera-elite-badge__icon";
    icon.textContent = "✦";
    icon.setAttribute("aria-hidden", "true");

    // لمعة متحركة
    const shine = document.createElement("span");
    shine.className = "nera-elite-badge__shine";
    shine.setAttribute("aria-hidden", "true");

    // ومضات الطاقة
    const boltOne = document.createElement("span");
    boltOne.className =
      "nera-elite-badge__bolt nera-elite-badge__bolt--one";
    boltOne.setAttribute("aria-hidden", "true");

    const boltTwo = document.createElement("span");
    boltTwo.className =
      "nera-elite-badge__bolt nera-elite-badge__bolt--two";
    boltTwo.setAttribute("aria-hidden", "true");

    badge.append(icon, shine, boltOne, boltTwo);

    return badge;
  }

  /**
   * إضافة الشارة بجوار عنصر الاسم.
   * activeBadge يجب أن يأتي من بيانات الحساب المحفوظة.
   */
  function attachBadge(nameElement, activeBadge, size = "small") {
    if (!nameElement || activeBadge !== BADGE_ID) {
      return null;
    }

    // منع تكرار الشارة على الاسم نفسه
    if (
      nameElement.parentElement &&
      nameElement.parentElement.querySelector(
        ":scope > .nera-elite-badge"
      )
    ) {
      return nameElement.parentElement.querySelector(
        ":scope > .nera-elite-badge"
      );
    }

    const badge = createEliteBadge(activeBadge, size);

    if (!badge) {
      return null;
    }

    nameElement.insertAdjacentElement("afterend", badge);

    return badge;
  }

  // واجهة مشتركة تستخدمها صفحات الموقع
  window.NEYRAEffects = Object.freeze({
    createEliteBadge,
    attachBadge
  });
})();
  
