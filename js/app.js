import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-scss';

import Glide from '@glidejs/glide';

// If JavaScript is enabled, add a class to the <html> element.
document.documentElement.classList.add('js');

// Load DOM elements.
const code = document.querySelectorAll(
    'code[class*="language-"], [class*="language-"] code'
);
const navMenu = document.getElementById('site-navigation');
const slider = document.querySelectorAll('.glide');

// Syntax highlighting via Prism.
if (code.length) {
    Prism.highlightAll();
}

// Responsive navigation menu.
if (navMenu) {
    const navToggle = document.getElementById('site-navigation-toggle');
    const navList = document.getElementById('site-navigation-list');

    navToggle?.addEventListener('click', event => {
        event.preventDefault();

        navToggle.classList.toggle('site-navigation-toggle-active');
        navMenu.classList.toggle('site-navigation-open');
    });

    navList?.addEventListener('focusin', () => {
        navToggle?.classList.add('site-navigation-toggle-active');
        navMenu.classList.add('site-navigation-open');
    });

    navList?.addEventListener('focusout', () => {
        navToggle?.classList.remove('site-navigation-toggle-active');
        navMenu.classList.remove('site-navigation-open');
    });
}

// Slider via Glide.
if (slider.length) {
    slider.forEach(element => {
        new Glide(element, {
            type: 'carousel'
        }).mount();
    });
}

// Dark mode.
const bodyClass = document.body.classList;
const images = document.querySelectorAll('img.prefers-color-scheme');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
const lightSwitch = document.getElementById('lightswitch');

// Set images and page styles for dark mode.
const makeImagesDark = () => {
    bodyClass.add('darkmode');

    images.forEach(image => {
        const src = image.dataset.srcDark;
        const srcset = image.dataset.srcsetDark;

        if (src) {
            image.src = src;
        }

        if (srcset) {
            image.srcset = srcset;
        }
    });
};

// Set images and page styles for light mode.
const makeImagesLight = () => {
    bodyClass.remove('darkmode');

    images.forEach(image => {
        const src = image.dataset.srcLight;
        const srcset = image.dataset.srcsetLight;

        if (src) {
            image.src = src;
        }

        if (srcset) {
            image.srcset = srcset;
        }
    });
};

// Detect and change dark/light mode when there is no
// locally stored preference.
const toggleDarkMode = mediaQuery => {
    if (localStorage.getItem('prefers-color-scheme') !== null) {
        return;
    }

    if (mediaQuery.matches) {
        makeImagesDark();
    } else if (bodyClass.contains('darkmode')) {
        makeImagesLight();
    }
};

toggleDarkMode(darkModeMediaQuery);

// Modern replacement for the deprecated MediaQueryList.addListener().
darkModeMediaQuery.addEventListener('change', toggleDarkMode);

// Apply stored dark mode preference.
if (localStorage.getItem('prefers-color-scheme') === 'dark') {
    makeImagesDark();
}

// Manually switch between dark and light mode.
lightSwitch?.addEventListener('click', event => {
    event.preventDefault();

    if (bodyClass.contains('darkmode')) {
        makeImagesLight();
        localStorage.setItem('prefers-color-scheme', 'light');
    } else {
        makeImagesDark();
        localStorage.setItem('prefers-color-scheme', 'dark');
    }
});
