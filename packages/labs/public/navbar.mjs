export function createNavbar() {
    const header = document.createElement('header');
    const siteTitle = document.createElement('h1');
    siteTitle.className = 'site-title';
    siteTitle.textContent = 'Muhammad Arshad';
    header.appendChild(siteTitle);
  
    const nav = document.createElement('nav');
    nav.className = 'main-nav';
    nav.setAttribute('aria-label', 'Main navigation');
  
    const ul = document.createElement('ul');
    ul.className = 'nav-links';
  
    const links = [
      { href: 'index.html', text: 'Home' },
      { href: 'projects.html', text: 'Projects' },
    ];
  
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '') {
      currentPage = 'index.html'; 
    }
  
    links.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
  
      if (link.href === currentPage) {
        a.classList.add('active');
      }
  
      li.appendChild(a);
      ul.appendChild(li);
    });
  
    nav.appendChild(ul);
    header.appendChild(nav);
  
    return header;
  }
  
  export function insertNavbar() {
    const navbar = createNavbar();
    document.body.prepend(navbar);
  }
  
  window.addEventListener('load', () => {
    insertNavbar();
  });
  