import { attachShadow } from "./utils.mjs";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    /* -------------------------------------
       BASE STYLES & TOKENS
       ------------------------------------- */
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-family-heading);
      color: var(--color-heading);
    }
    header {
      background-color: var(--color-primary, #213555);
      color: var(--color-text-inverted, #ffffff);
      padding: var(--spacing-m, 1em);
      margin-bottom: var(--spacing-m, 1em);
    }
    .site-title {
      color: var(--color-text-inverted, #ffffff);
      font-size: var(--font-size-h1, 2.5rem);
      margin: 0;
    }
    .menu-toggle {
      background: var(--color-primary, #213555);
      border: 2px solid var(--color-text-inverted, #fff);
      color: var(--color-text-inverted, #fff);
      padding: 0.75em 1.25em;
      cursor: pointer;
      font-size: 1.125rem;
      border-radius: var(--radius-default, 5px);
    }
    /* Reusable dark-mode container styling */
    .dark-mode-container {
      display: flex;
      align-items: center;
      font-size: 1rem;
      color: var(--color-text-inverted, #fff);
    }
    .dark-mode-container label {
      cursor: pointer;
      margin: 0;
    }
    .dark-mode-container input {
      margin-right: 0.3em;
    }

    /* -------------------------------------
       DESKTOP STYLES (≥ 801px)
       ------------------------------------- */
    @media (min-width: 801px) {
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      /* Hide the menu button on desktop */
      .menu-toggle {
        display: none;
      }
      /* top-level dark-mode container is hidden on desktop */
      .dark-mode-container.mobile {
        display: none; 
      }

      .main-nav {
        display: block;
      }
      .nav-links {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: var(--spacing-s, 0.5em);
      }
      .nav-links li {
        list-style: none;
      }
      /* show the desktop dark mode container */
      .dark-mode-container.desktop {
        display: flex; /* place it to the left of the nav links */
      }
    }

    /* -------------------------------------
       MOBILE STYLES (≤ 800px)
       ------------------------------------- */
    @media (max-width: 800px) {
      header {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      /* .dark-mode-container that’s for desktop is hidden on mobile */
      .dark-mode-container.desktop {
        display: none;
      }
      /* show the mobile dark mode container (immediately left of Menu) */
      .dark-mode-container.mobile {
        display: flex; 
        margin-right: 0.5em;
      }

      .menu-toggle {
        display: inline-block;
      }
      .main-nav {
        width: 100%;
      }
      .nav-links {
        display: none; /* hidden until "Menu" is toggled */
        flex-direction: column;
        align-items: flex-start;
        margin-top: var(--spacing-s, 0.5em);
        list-style: none;
        padding: 0;
      }
      .nav-links.open {
        display: flex;
      }
      .nav-links li {
        list-style: none;
      }
    }

    /* -------------------------------------
       NAV LINKS STYLING
       ------------------------------------- */
    .nav-links a {
      color: var(--color-link, #c0392b);
      text-decoration: none;
      font-weight: bold;
      position: relative;
    }
    .nav-links a:hover {
      text-decoration: underline;
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 2px;
      background-color: var(--color-link, #c0392b);
    }
  </style>

  <header>
    <!-- Top row: site title, mobile dark-mode, and menu button -->
    <div class="header-top">
      <h1 class="site-title">Muhammad Arshad</h1>

      <!-- MOBILE dark-mode checkbox (hidden on desktop) -->
      <div class="dark-mode-container mobile">
        <label>
          <input type="checkbox" class="dark-mode-checkbox" autocomplete="off" />
          Dark mode
        </label>
      </div>

      <button class="menu-toggle" aria-label="Toggle Menu">Menu</button>
    </div>

    <!-- Nav row: includes the DESKTOP dark-mode, plus the links -->
    <nav class="main-nav" aria-label="Main navigation">
      <ul class="nav-links">
        <!-- DESKTOP dark-mode checkbox (hidden on mobile) -->
        <li class="dark-mode-container desktop">
          <label>
            <input type="checkbox" class="dark-mode-checkbox" autocomplete="off" />
            Dark mode
          </label>
        </li>
        <li><a href="index.html">Home</a></li>
        <li><a href="projects.html">Projects</a></li>
      </ul>
    </nav>
  </header>
`;

class MyCoolHeader extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = null;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  connectedCallback() {
    this._shadowRoot = attachShadow(this, TEMPLATE);

    this._highlightActiveLink();

    const menuButton = this._shadowRoot.querySelector('.menu-toggle');
    menuButton.addEventListener('click', () => this._toggleNav());

    const darkModeCheckboxes = this._shadowRoot.querySelectorAll('.dark-mode-checkbox');
    darkModeCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const checked = checkbox.checked;
        darkModeCheckboxes.forEach((cb) => (cb.checked = checked));

        if (checked) {
          document.body.classList.add('dark-mode');
          localStorage.setItem('darkMode', 'true');
        } else {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('darkMode', 'false');
        }
      });
    });

    const darkModeOn = (localStorage.getItem('darkMode') === 'true');
    if (darkModeOn) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    darkModeCheckboxes.forEach((cb) => (cb.checked = darkModeOn));

    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  _highlightActiveLink() {
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '') {
      currentPage = 'index.html';
    }
    const links = this._shadowRoot.querySelectorAll('.nav-links a');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  _toggleNav() {
    const navLinks = this._shadowRoot.querySelector('.nav-links');
    navLinks.classList.toggle('open');
  }

  handleDocumentClick(event) {
    const path = event.composedPath();
    if (!path.includes(this)) {
      const navLinks = this._shadowRoot.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    }
  }
}

customElements.define("my-cool-header", MyCoolHeader);
