'use strict';

const nav = document.querySelector('.nav');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab--container');
const tabContent = document.querySelectorAll('.operations__content');

//scroll to section1
btnScrollTo.addEventListener('click', (e) => {
    section1.scrollIntoView({ behavior: 'smooth' });
})

document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
})

//Tabbed component
tabContainer.addEventListener('click', (e) => {
    const clicked = e.target.closest('.operations__tab');

    //Guard clause
    if (!clicked) return;

    //Active tab
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    //Active content tab
    tabContent.forEach(tab => tab.classList.remove('operations__content--active'));
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');
        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        })
        logo.style.opacity = this;
    }
}
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
const stickyNav = (entries) => {
    const [entry] = entries;
    !entry.isIntersecting ? nav.classList.add('sticky') : nav.classList.remove('sticky');
}
const header = document.querySelector('.header');
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `${nav.getBoundingClientRect().height}px`,
});
headerObserver.observe(header);

//Reveal sections
const revealSection = function (entries, observer) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    });
}
const allSections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
allSections.forEach(sec => {
    sec.classList.add('section--hidden');
    sectionObserver.observe(sec);
});
//Lazy loading images
const loadImg = (entries, observer) => {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    //Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () => {
        entry.target.classList.remove('lazy-img');
    });
    observer.unobserve();
}
const imgTargets = document.querySelectorAll(`img[data-src]
`);
const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img))

//Slider
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    //function
    const gotoSlide = function (slide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
    }
    const createDots = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    };
    const activateDot = (slide) => {
        document.querySelectorAll('.dots__dot').forEach(d =>
            d.classList.remove('dots__dot--active'));
        document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
    }
    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else curSlide++;
        gotoSlide(curSlide);
        activateDot(curSlide);
    }
    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else curSlide--;
        gotoSlide(curSlide);
        activateDot(curSlide);
    }
    const init = function () {
        gotoSlide(0);
        createDots();
        activateDot(0);
    }
    init();

    //Event handler
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);
    document.addEventListener('keydown', (e) => {
        e.key === 'ArrowLeft' && prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dots__dot')) {
            curSlide = +e.target.dataset.slide;
            gotoSlide(curSlide);
            activateDot(curSlide);
        }
    });
}
slider();
