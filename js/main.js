// js/main.js

// Helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const html = document.documentElement;

// ===== Theme Toggle =====
const themeToggle = $("#themeToggle");

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  html.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

// Set initial theme on load
setTheme(getPreferredTheme());

themeToggle?.addEventListener("click", () => {
  const current = html.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
});

// ===== Mobile Navigation Toggle =====
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMenu() {
  navToggle?.classList.remove("active");
  navMenu?.classList.remove("active");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", navMenu.classList.contains("active") ? "true" : "false");
});

// Close mobile menu when clicking a nav link
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ===== Navbar shadow on scroll =====
const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

// ===== Smooth scrolling (with header offset) =====
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    const target = href ? $(href) : null;
    if (!target) return;

    e.preventDefault();

    const headerOffset = 70;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ===== Active section highlighting =====
const navLinks = $$(".nav-link");
const sections = $$(".hero, .section");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { root: null, rootMargin: "-20% 0px -70% 0px", threshold: 0 }
);

sections.forEach((sec) => sectionObserver.observe(sec));

// ===== Back to top button =====
const backToTop = $("#backToTop");
window.addEventListener("scroll", () => {
  if (!backToTop) return;
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Reveal on scroll animation =====
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = $$(".project-card, .skill-category, .timeline-item, .education-card, .about-card");

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("fade-in-up");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
}

// ===== Footer year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// ===== Contact form (front-end only) =====
const contactForm = $("#contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name")?.value?.trim();
  const email = $("#email")?.value?.trim();
  const message = $("#message")?.value?.trim();

  console.log("Contact form submitted:", { name, email, message });

  alert("Thank you for your message! I will get back to you soon.");
  contactForm.reset();
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const iframe = document.getElementById("hidden_iframe");

  if (!form || !status || !iframe) return;

  let submitting = false;

  form.addEventListener("submit", () => {
    submitting = true;
    status.textContent = "Sending...";
  });

  iframe.addEventListener("load", () => {
    // iframe also "loads" once on page load — ignore that one
    if (!submitting) return;

    submitting = false;
    status.textContent = "✅ Message sent! I’ll get back to you soon.";
    form.reset();

    setTimeout(() => (status.textContent = ""), 4000);
  });
});
