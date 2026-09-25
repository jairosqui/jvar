// ===== Configuración =====
// Pega aquí tu Access Key de Web3Forms (https://web3forms.com). Es pública por diseño.
const WEB3FORMS_ACCESS_KEY = "b936d491-9a45-49e5-bd00-d0bf0ae0bb41";

document.documentElement.classList.add("js");

// Año del footer
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
};
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
window.addEventListener("resize", () => { if (window.innerWidth > 980) setMenu(false); });

// Animaciones al hacer scroll
const reveals = document.querySelectorAll("[data-reveal]");
reveals.forEach((el) => { const d = parseFloat(el.dataset.reveal); if (d) el.style.setProperty("--d", d + "s"); });
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
      // Quita el retraso tras la entrada para que los hover respondan de inmediato
      setTimeout(() => e.target.style.removeProperty("--d"), 1200);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Formulario (Web3Forms, sin reCAPTCHA — honeypot "botcheck")
const form = document.getElementById("contact-form");
const btn = document.getElementById("submit-btn");
const btnLabel = btn.querySelector("span");
const ok = document.getElementById("msg-ok");
const err = document.getElementById("msg-err");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  ok.hidden = true; err.hidden = true;

  let valid = true;
  form.querySelectorAll("[required]").forEach((f) => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("is-invalid", bad);
    if (bad) valid = false;
  });
  if (!valid) return;

  const data = new FormData(form);
  if (data.get("botcheck")) return;
  data.append("access_key", WEB3FORMS_ACCESS_KEY);

  btn.disabled = true; btnLabel.textContent = "Enviando…";
  try {
    const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: data });
    const json = await res.json();
    if (json.success) { form.reset(); ok.hidden = false; } else { err.hidden = false; }
  } catch (_) {
    err.hidden = false;
  } finally {
    btn.disabled = false; btnLabel.textContent = "Enviar solicitud";
  }
});

form.querySelectorAll("[required]").forEach((f) => f.addEventListener("input", () => f.classList.remove("is-invalid")));
