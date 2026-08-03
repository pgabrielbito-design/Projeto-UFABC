/* =========================================================
   SANEAMENTO ALÉM DA REDE — JavaScript
   Projeto de Extensão e Divulgação Científica · UFABC

   Funcionalidades:
     1. Menu mobile (abrir/fechar + acessibilidade)
     2. Sombra do header ao rolar
     3. Destaque do link ativo no menu (scroll spy)
     4. Animações de entrada ao rolar (reveal)
     5. Contadores animados (números)
     6. Filtros da Biblioteca Digital
     7. Formulário de contato (feedback visual)
     8. Botão "voltar ao topo"
     9. Ano atual no rodapé
   Código em JavaScript puro, sem bibliotecas externas.
========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. MENU MOBILE ---------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    function closeMenu() {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
    function openMenu() {
      navMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    }

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.contains('open');
        isOpen ? closeMenu() : openMenu();
      });

      // Fecha o menu ao clicar em um link (navegação por âncora)
      navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      // Fecha o menu com a tecla ESC (acessibilidade por teclado)
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
          closeMenu();
          navToggle.focus();
        }
      });
    }

    /* ---------- 2. SOMBRA DO HEADER AO ROLAR ---------- */
    const header = document.querySelector('.site-header');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
      const y = window.scrollY;
      if (header) header.classList.toggle('scrolled', y > 20);

      // Botão voltar ao topo
      if (backToTop) {
        if (y > 500) {
          backToTop.hidden = false;
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 3. SCROLL SPY (link ativo) ---------- */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });

      sections.forEach(function (sec) { spy.observe(sec); });
    }

    /* ---------- 4. ANIMAÇÕES DE ENTRADA (REVEAL) ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // pequeno atraso escalonado para elementos irmãos
            const delay = Math.min(i * 60, 240);
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, delay);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach(function (el) { revealObserver.observe(el); });
    } else {
      // Fallback: mostra tudo se não houver suporte
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- 5. CONTADORES ANIMADOS ---------- */
    const counters = document.querySelectorAll('.stat-num[data-count]');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';

      if (prefersReduced) {
        el.textContent = target.toLocaleString('pt-BR') + suffix;
        return;
      }

      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // easing suave (easeOutCubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(eased * target);
        el.textContent = value.toLocaleString('pt-BR') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window && counters.length) {
      const counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });

      counters.forEach(function (c) { counterObserver.observe(c); });
    } else {
      counters.forEach(animateCounter);
    }

    /* ---------- 6. FILTROS DA BIBLIOTECA ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const libCards = document.querySelectorAll('.lib-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = btn.getAttribute('data-filter');

        // Atualiza estado visual/ARIA dos botões
        filterBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        // Mostra/oculta cards conforme categoria
        libCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          const show = filter === 'todos' || category === filter;
          card.classList.toggle('is-hidden', !show);
        });
      });
    });

    /* ---------- 7. FORMULÁRIO DE CONTATO (FEEDBACK VISUAL) ---------- */
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault(); // não envia dados de verdade (site estático)

        // Validação simples nativa
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const nome = (document.getElementById('nome').value || '').trim();
        const primeiroNome = nome.split(' ')[0] || 'obrigado';

        if (feedback) {
          feedback.hidden = false;
          feedback.textContent =
            '✅ Mensagem registrada, ' + primeiroNome +
            '! Este é um formulário demonstrativo — nenhum dado foi enviado.';
          feedback.focus && feedback.focus();
        }

        form.reset();
      });
    }

    /* ---------- 8. BOTÃO VOLTAR AO TOPO ---------- */
    if (backToTop) {
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
      });
    }

    /* ---------- 9. ANO ATUAL NO RODAPÉ ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

  });
})();
