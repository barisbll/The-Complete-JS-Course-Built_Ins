'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const aNavLinks = document.querySelectorAll('.nav__link');

const logo = document.querySelector('.nav__logo');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scroll
btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

navLinks.addEventListener('click', e => {
  if (
    !e.target.classList.contains('nav__link') ||
    e.target.classList.contains('nav__link--btn')
  )
    return;

  e.preventDefault();
  const id = e.target.getAttribute('href');

  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

//Tabbed Component

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');

const operations = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', e => {
  const tab = e.target.closest('.operations__tab');

  if (!tab) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tab.classList.add('operations__tab--active');

  const contentNum = tab.dataset.tab;
  operations.forEach(operation =>
    operation.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${contentNum}`)
    .classList.add('operations__content--active');
});

//Fading Navbar

navLinks.addEventListener('mouseover', e => {
  aNavLinks.forEach(link => (link.style.opacity = '0.5'));
  logo.style.opacity = '0.5';
  if (e.target.href) e.target.style.opacity = '1';
});

navLinks.addEventListener('mouseout', e => {
  aNavLinks.forEach(link => (link.style.opacity = '1'));
  logo.style.opacity = '1';
});

//Sticky Navbar

const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');

const section1Check = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(section1Check, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
navObserver.observe(header);

// Reveal Sections

const sections = document.querySelectorAll('.section');

const revealSections = (entries, observer) => {
  const [entry] = entries;

  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0,
  rootMargin: '-90px',
});

sections.forEach(sec => {
  sectionObserver.observe(sec);
  //ssec.classList.add('section--hidden');
});

// Lazy Images

const imgs = document.querySelectorAll('.features__img');

const imageObserver = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting) {
    const src = entry.target.dataset.src;
    entry.target.src = src;

    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
  }
};

const imgObserver = new IntersectionObserver(imageObserver, {
  root: null,
  threshold: 0,
});

imgs.forEach(img => imgObserver.observe(img));

// Slider Component

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');

// slider.style.overflow = 'visible';
let currentSlide = 0;

const dotsContainer = document.querySelector('.dots');

slides.forEach((_, idx) => {
  dotsContainer.insertAdjacentHTML(
    'afterbegin',
    `<span class="dots__dot" data-slide="${idx}"></span>`
  );
});

const dots = document.querySelectorAll('.dots__dot');

const activeDot = num => {
  dots.forEach((dot, idx) => {
    dot.classList.remove('dots__dot--active');
    if (idx === num) dot.classList.add('dots__dot--active');
  });
};

dots.forEach(dot =>
  dot.addEventListener('click', e => {
    const wantedSlide = e.target.dataset.slide;
    goTo(wantedSlide - 1);
  })
);

const goTo = slideNum => {
  if (slideNum > slides.length - 1) slideNum = 0;
  if (slideNum < 0) slideNum = slides.length - 1;

  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i + -slideNum) * 100}%)`;
  });

  activeDot(slideNum);
  currentSlide = slideNum;
};

goTo(0);

rightBtn.addEventListener('click', () => {
  goTo(currentSlide + 1);
});

leftBtn.addEventListener('click', () => {
  goTo(currentSlide - 1);
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') goTo(currentSlide + 1);
  if (e.key === 'ArrowLeft') goTo(currentSlide - 1);
});
