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
})();
