// Пока JavaScript почти не нужен: стартовая анимация сделана CSS-ом.
// Этот файл оставлен специально для следующих этапов.

// Пример: если захочешь запускать анимацию не сразу, а когда hero появляется в экране,
// можно убрать класс hero--animate из HTML и включать его через IntersectionObserver.

const hero = document.querySelector('#hero');
const popular = document.querySelector('#catalog');
const popularOrnament = document.querySelector('.popular__ornament');

const reduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


function updatePopularOrnament() {

  if (!popular || !popularOrnament || reduceMotion) return;

  const rect = popular.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  /*
    0 — блок только начинает появляться
    1 — мы достаточно далеко прошли по блоку
  */

  const progress = Math.min(
    Math.max(
      (viewportHeight - rect.top) /
      (viewportHeight + rect.height * 0.55),
      0
    ),
    1
  );


  /* Вращение примерно на 50 градусов */

  const rotation = -15 + progress * 50;


  /* Очень небольшое вертикальное движение */

  const shift = progress * 35;


  popularOrnament.style.setProperty(
    '--ornament-rotation',
    `${rotation}deg`
  );

  popularOrnament.style.setProperty(
    '--ornament-shift',
    `${shift}px`
  );
}


let popularTicking = false;

function onPopularScroll() {

  if (!popularTicking) {

    requestAnimationFrame(() => {

      updatePopularOrnament();

      popularTicking = false;

    });

    popularTicking = true;
  }
}


window.addEventListener(
  'scroll',
  onPopularScroll,
  { passive: true }
);

window.addEventListener(
  'resize',
  updatePopularOrnament
);

updatePopularOrnament();

// Для повторного теста анимации в DevTools можно выполнить:
// hero.classList.remove('hero--animate');
// requestAnimationFrame(() => hero.classList.add('hero--animate'));

// В будущем отдельные предметы можно будет размечать так:
// <img class="object object--shirt fly-item" src="assets/shirt.webp" alt="" />
// и каждому задавать собственные delay / transform через CSS.


