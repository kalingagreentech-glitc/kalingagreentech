(function () {
  var siteMeta = window.SITE_META;
  if (!siteMeta || !siteMeta.contact) return;

  var contact = siteMeta.contact;
  var defaultMailSubject = "Email Inquire for Solar Installation";
  var whatsappMessage =
    (siteMeta.whatsapp && siteMeta.whatsapp.defaultMessage) ||
    "Hello Kalinga GreenTech, I need assistance.";

  function upsertMeta(name, content) {
    if (!content) return;
    var tag = document.querySelector('meta[name="' + name + '"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  }

  upsertMeta("site:company", siteMeta.companyName || "");
  upsertMeta("contact:email", contact.email || "");
  upsertMeta("contact:phone", contact.phone || "");
  upsertMeta("contact:address", contact.address || "");
  upsertMeta("contact:whatsapp", contact.whatsappNumber || "");
  upsertMeta(
    "contact:emails",
    Array.isArray(contact.emails) ? contact.emails.join(", ") : "",
  );
  upsertMeta(
    "contact:phones",
    Array.isArray(contact.phones) ? contact.phones.join(", ") : "",
  );
  upsertMeta(
    "contact:addresses",
    Array.isArray(contact.addresses) ? contact.addresses.join(" | ") : "",
  );

  function fillText(selector, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(function (el) {
      el.textContent = value;
    });
  }

  function ensureLink(el, href, text) {
    if (!el || !href) return;

    if (el.tagName === "A") {
      el.setAttribute("href", href);
      el.textContent = text;
      return;
    }

    var anchor = el.querySelector("a[data-meta-link]");
    if (!anchor) {
      anchor = document.createElement("a");
      anchor.setAttribute("data-meta-link", "1");
      anchor.className = "hover:underline";
      el.textContent = "";
      el.appendChild(anchor);
    }

    anchor.setAttribute("href", href);
    anchor.textContent = text;
  }

  function normalizedDialNumber(rawPhone) {
    if (!rawPhone) return "";
    return rawPhone.replace(/[^+\d]/g, "");
  }

  function hasExplicitPhoneLabel(el) {
    if (!el || !el.parentElement) return false;
    var prev = el.previousElementSibling;
    if (!prev) return false;
    return /phone\s*:/i.test((prev.textContent || "").trim());
  }

  function hasExplicitEmailLabel(el) {
    if (!el || !el.parentElement) return false;
    var prev = el.previousElementSibling;
    if (!prev) return false;
    return /email\s*:/i.test((prev.textContent || "").trim());
  }

  function hasExplicitAddressLabel(el) {
    if (!el || !el.parentElement) return false;
    var prev = el.previousElementSibling;
    if (!prev) return false;
    return /address\s*:/i.test((prev.textContent || "").trim());
  }

  fillText("[data-site-email]", contact.email || "");
  fillText("[data-site-phone]", contact.phone || "");
  document.querySelectorAll("[data-site-address]").forEach(function (el) {
    var displayAddress = hasExplicitAddressLabel(el)
      ? contact.address || ""
      : "Address: " + (contact.address || "");
    el.textContent = displayAddress;
  });

  document.querySelectorAll("[data-site-email]").forEach(function (el) {
    var mailHref =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" +
      encodeURIComponent(contact.email || "") +
      "&su=" +
      encodeURIComponent(defaultMailSubject);
    var displayEmail = hasExplicitEmailLabel(el)
      ? contact.email || ""
      : "Email: " + (contact.email || "");
    ensureLink(el, mailHref, displayEmail);

    var emailAnchor =
      el.tagName === "A" ? el : el.querySelector("a[data-meta-link]");
    if (emailAnchor) {
      emailAnchor.setAttribute("target", "_blank");
      emailAnchor.setAttribute("rel", "noopener noreferrer");
    }
  });

  var dialNumber = normalizedDialNumber(contact.phone || "");
  document.querySelectorAll("[data-site-phone]").forEach(function (el) {
    var displayPhone = hasExplicitPhoneLabel(el)
      ? contact.phone || ""
      : "PH: " + (contact.phone || "");
    ensureLink(el, "tel:" + dialNumber, displayPhone);
  });

  var waHref =
    "https://wa.me/" +
    (contact.whatsappNumber || "") +
    "?text=" +
    encodeURIComponent(whatsappMessage);

  document.querySelectorAll("a.whatsapp-float-btn").forEach(function (el) {
    el.setAttribute("href", waHref);
  });

  var COOKIE_CONSENT_NAME = "kgt_cookie_consent";
  var COOKIE_CONSENT_EXPIRY_DAYS = 365;

  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function setCookie(name, value, days) {
    var expires = "";
    if (typeof days === "number") {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie =
      name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Lax";
  }

  function removeCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
  }

  function createCookieBanner() {
    var banner = document.createElement("div");
    banner.id = "cookie-consent-banner";
    banner.className =
      "fixed inset-x-4 bottom-4 z-50 rounded-[1.75rem] bg-white border border-slate-200 shadow-[0_28px_64px_rgba(15,23,42,0.18)] p-5 text-slate-950 max-w-6xl mx-auto";
    banner.style.opacity = "0";
    banner.style.transform = "translateY(24px)";
    banner.style.transition = "opacity 320ms ease, transform 320ms ease";

    banner.innerHTML =
      '<div class="relative overflow-hidden rounded-[1.6rem] bg-white shadow-[0_18px_64px_rgba(15,23,42,0.12)]">' +
      '  <div class="border-b border-slate-100 px-5 py-4 sm:px-6">' +
      '    <div class="flex items-center justify-between gap-4">' +
      '      <div class="flex items-center gap-4">' +
      '        <img src="cookie.png" alt="Solar cookies image" class="h-32 w-32 rounded-3xl object-cover shadow-sm" />' +
      '        <div>' +
      '          <p class="text-lg font-semibold text-slate-950">We use cookies</p>' +
      '          <p class="mt-1 max-w-xl text-sm leading-6 text-slate-600">This website uses cookies to improve your experience, analyze traffic, and personalize content. By clicking "Accept All", you agree to our use of cookies.</p>' +
      '        </div>' +
      '      </div>' +
      '      <button id="cookie-close-btn" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">✕</button>' +
      '    </div>' +
      '  </div>' +
      '  <div class="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-6">' +
      '    <button id="cookie-reject-btn" class="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Reject Cookies</button>' +
      '    <button id="cookie-manage-btn" class="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Manage Preferences</button>' +
      '    <button id="cookie-accept-btn" class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700">Accept All</button>' +
      '  </div>' +
      '</div>' +
      '<div id="cookie-preferences-panel" class="hidden mt-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">' +
      '  <p class="mb-3 text-sm font-semibold text-slate-950">Manage preferences</p>' +
      '  <div class="space-y-4 text-sm text-slate-700">' +
      '    <label class="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">' +
      '      <input type="checkbox" checked disabled class="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500" />' +
      '      <div>' +
      '        <div class="font-semibold text-slate-900">Necessary cookies</div>' +
      '        <div class="text-slate-500">Always active to keep the site running.</div>' +
      '      </div>' +
      '    </label>' +
      '    <label class="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">' +
      '      <input id="cookie-analytics-checkbox" type="checkbox" class="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500" />' +
      '      <div>' +
      '        <div class="font-semibold text-slate-900">Analytics cookies</div>' +
      '        <div class="text-slate-500">Help us understand and improve the site.</div>' +
      '      </div>' +
      '    </label>' +
      '  </div>' +
      '  <div class="mt-5 flex flex-wrap gap-3 justify-end">' +
      '    <button id="cookie-save-preferences" class="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700">Save Preferences</button>' +
      '    <button id="cookie-cancel-preferences" class="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>' +
      '  </div>' +
      '</div>';

    document.body.appendChild(banner);
    setTimeout(function () {
      banner.style.opacity = "1";
      banner.style.transform = "translateY(0)";
    }, 20);

    document.getElementById("cookie-accept-btn").addEventListener("click", function () {
      saveConsent({ status: "accepted", analytics: true });
      closeBanner();
    });

    document.getElementById("cookie-reject-btn").addEventListener("click", function () {
      saveConsent({ status: "rejected", analytics: false });
      closeBanner();
    });

    document.getElementById("cookie-close-btn").addEventListener("click", function () {
      closeBanner();
    });

    document.getElementById("cookie-manage-btn").addEventListener("click", function () {
      document.getElementById("cookie-preferences-panel").classList.toggle("hidden");
    });

    document.getElementById("cookie-save-preferences").addEventListener("click", function () {
      var analyticsAccepted = document.getElementById("cookie-analytics-checkbox").checked;
      saveConsent({ status: analyticsAccepted ? "accepted" : "custom", analytics: analyticsAccepted });
      closeBanner();
    });

    document.getElementById("cookie-cancel-preferences").addEventListener("click", function () {
      document.getElementById("cookie-preferences-panel").classList.add("hidden");
    });
  }

  function saveConsent(consent) {
    setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consent), COOKIE_CONSENT_EXPIRY_DAYS);
  }

  function closeBanner() {
    var existingBanner = document.getElementById("cookie-consent-banner");
    if (existingBanner && existingBanner.parentNode) {
      existingBanner.parentNode.removeChild(existingBanner);
    }
  }

  function shouldShowCookieBanner() {
    return !getCookie(COOKIE_CONSENT_NAME);
  }

  if (shouldShowCookieBanner()) {
    createCookieBanner();
  }
})();
