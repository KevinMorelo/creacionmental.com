document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll(".site-nav .nav-link");
  const sections = ["inicio", "nosotros", "servicios", "proyectos", "contacto"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const grid = document.querySelector(".project-grid");
  const prev = document.querySelector(".proj-prev");
  const next = document.querySelector(".proj-next");

  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  }

  const headerEl = document.querySelector(".site-header");
  const headerHeight = headerEl ? headerEl.offsetHeight : 0;

  function scrollToSection(el) {
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function clearURLHash() {
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search
    );
  }

  function setActiveById(id) {
    navLinks.forEach((a) => {
      a.classList.toggle("active", a.dataset.target === id);
    });
  }

  // --- click en links del menú (sin hash en URL)
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      // cerrar menú en mobile
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }

      setActiveById(targetId);
      scrollToSection(targetEl);
      clearURLHash();
    });
  });

  // --- resaltar sección activa al hacer scroll
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveById(entry.target.id);
            clearURLHash();
          }
        });
      },
      {
        root: null,
        // levanta el umbral superior para que el cambio ocurra cuando la sección
        // está bien “dentro” del viewport y compensado por el header
        rootMargin: `-${headerHeight + 1}px 0px -60% 0px`,
        threshold: 0.01,
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  // --- validación campo teléfono
  const telefonoInput = document.getElementById("telefono");
  const telefonoError = document.getElementById("telefono-error");

  if (telefonoInput) {
    telefonoInput.addEventListener("input", function () {
      if (/[^0-9]/.test(this.value)) {
        this.value = this.value.replace(/[^0-9]/g, "");
        if (telefonoError) telefonoError.style.display = "block";
      } else {
        if (telefonoError) telefonoError.style.display = "none";
      }
    });
  }

  // --- al cargar: si venías con un hash, hacemos scroll y limpiamos la URL
  if (window.location.hash) {
    const id = window.location.hash.replace("#", "");
    const targetEl = document.getElementById(id);
    if (targetEl) {
      setTimeout(() => {
        scrollToSection(targetEl);
        setActiveById(id);
        clearURLHash();
      }, 0);
    } else {
      clearURLHash();
    }
  }

document.querySelectorAll('a[data-target]').forEach((link) => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const modal = this.closest('.pmodal');
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    const targetId = this.getAttribute('data-target');
    const section  = document.getElementById(targetId);
    if (section) {
      const header = document.querySelector('.site-header');
      const offset = header ? header.offsetHeight : 0;
      const y = section.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: y, behavior: 'smooth' });

      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  });
});


  if (grid && prev && next) {
    const step = () => {
      const card = grid.querySelector(".project-card");
      const gap = parseFloat(getComputedStyle(grid).gap) || 20;
      return card ? card.getBoundingClientRect().width + gap : 300;
    };

    prev.addEventListener("click", () => {
      grid.scrollBy({ left: -step(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      grid.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  const form = document.getElementById('contactoForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Enviando...';

    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form) });
      const data = await res.json();
      if (res.ok && data.ok) {
        alert('¡Gracias! Tu mensaje fue enviado.');
        form.reset();
      } else {
        alert('No se pudo enviar: ' + (data.msg || 'Error'));
      }
    } catch (err) {
      alert('Error de red. Intenta de nuevo.');
    } finally {
      btn.disabled = false; btn.textContent = 'Enviar';
    }
  });

  if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    window.scrollTo(0, 0);
    history.replaceState(null, "", window.location.pathname);
  }

  const PROJECTS_DATA = {
    "proyecto-1": {
      title: "Proyecto 1 · Casa Luz",
      subtitle: "Residencial — Interiorismo + Iluminación",
      desc: "Intervención integral donde la iluminación de acento y el tratamiento de materiales cálidos generan atmósferas íntimas y funcionales. El layout se optimiza para recorridos fluidos y zonas de pausa.",
      img: "/assets/img/planos.jpg",
      tags: ["Interiorismo", "Iluminación", "Materialidad", "Recorridos"],
    },
    "proyecto-2": {
      title: "Proyecto 2 · Ático Verde",
      subtitle: "Residencial — Arquitectura + Domótica",
      desc: "Espacio inteligente con automatización de escenas y control ambiental. Se prioriza eficiencia energética, confort y una estética limpia que resalta la naturaleza del entorno.",
      img: "/assets/img/planos.jpg",
      tags: ["Arquitectura", "Domótica", "Eficiencia", "Confort"],
    },
    "proyecto-3": {
      title: "Proyecto 3 · Estudio Norte",
      subtitle: "Comercial — Arquitectura integral",
      desc: "Programa flexible para usos mixtos. La materialidad sobria y la iluminación técnica favorecen el rendimiento y la identidad de marca.",
      img: "/assets/img/planos.jpg",
      tags: ["Comercial", "Identidad", "Iluminación técnica", "Flexibilidad"],
    },
    "proyecto-4": {
      title: "Proyecto 4 · Estudio Norte",
      subtitle: "Comercial — Arquitectura integral",
      desc: "Programa flexible para usos mixtos. La materialidad sobria y la iluminación técnica favorecen el rendimiento y la identidad de marca.",
      img: "/assets/img/planos.jpg",
      tags: ["Comercial", "Identidad", "Iluminación técnica", "Flexibilidad"],
    },
  };

  (function initProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;

    const imgEl = document.getElementById("pm-img");
    const titleEl = document.getElementById("pm-title");
    const subEl = document.getElementById("pm-subtitle");
    const descEl = document.getElementById("pm-desc");
    const tagsEl = document.getElementById("pm-tags");

    function fillModal(data) {
      titleEl.textContent = data.title || "";
      subEl.textContent = data.subtitle || "";
      descEl.textContent = data.desc || "";

      if (data.img) {
        imgEl.src = data.img;
        imgEl.alt = data.title || "Proyecto";
      } else {
        imgEl.removeAttribute("src");
        imgEl.alt = "";
      }

      tagsEl.innerHTML = "";
      (data.tags || []).forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        tagsEl.appendChild(li);
      });
    }

    function openModal(id) {
      const data = PROJECTS_DATA[id];
      if (!data) return;
      fillModal(data);
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".project-card[data-id]").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".proj-btn")) return;
        openModal(card.dataset.id);
      });
    });

    modal.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", closeModal);
    });
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("pmodal__overlay")) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  })();
});
