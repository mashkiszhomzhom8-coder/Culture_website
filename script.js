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


/*Content 2 animation*/

const popularHeader = document.querySelector('.popular__header');
const categories = document.querySelectorAll('.category');


const popularObserver = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) return;


      if (entry.target.classList.contains('popular__header')) {

        entry.target.classList.add('is-visible');

      }


      if (entry.target.classList.contains('category')) {

        const index = [...categories].indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, index * 120);

      }


      popularObserver.unobserve(entry.target);

    });

  },
  {
    threshold: .18
  }
);


if (popularHeader) {
  popularObserver.observe(popularHeader);
}


categories.forEach(category => {
  popularObserver.observe(category);
});

/* Поиск и выбор категории в витрине туториалов. */
const tutorialSearch = document.querySelector('.tutorials__search input');
const tutorialChips = document.querySelectorAll('.tutorials__chips button');
const tutorialCards = document.querySelectorAll('.tutorial-card');
const tutorialControls = document.querySelector('.tutorials__controls');
const tutorialFilterPanel = document.querySelector('.tutorials__filter-panel');
const tutorialFilterSelects = tutorialFilterPanel?.querySelectorAll('select');
const tutorialsEmpty = document.querySelector('.tutorials__empty');
let activeTutorialCategory = 'все';

function filterByRange(value, range, number) {
  if (value === 'any') return true;
  if (range === 'duration') {
    return (value === 'under-60' && number < 60)
      || (value === '60-120' && number >= 60 && number <= 120)
      || (value === 'over-120' && number > 120);
  }

  return (value === 'under-500' && number <= 500)
    || (value === '500-1000' && number > 500 && number <= 1000)
    || (value === 'over-1000' && number >= 1000);
}

function filterTutorials() {
  const phrase = tutorialSearch ? tutorialSearch.value.trim().toLowerCase() : '';
  const difficulty = tutorialFilterPanel?.querySelector('[name="difficulty"]')?.value || 'any';
  const duration = tutorialFilterPanel?.querySelector('[name="duration"]')?.value || 'any';
  const budget = tutorialFilterPanel?.querySelector('[name="budget"]')?.value || 'any';

  let visibleCards = 0;

  tutorialCards.forEach((card) => {
    const category = card.dataset.category || '';
    const text = card.textContent.toLowerCase();
    const matchesCategory = activeTutorialCategory === 'все' || category === activeTutorialCategory;
    const matchesSearch = !phrase || text.includes(phrase);
    const matchesDifficulty = difficulty === 'any' || card.dataset.difficulty === difficulty;
    const matchesDuration = filterByRange(duration, 'duration', Number(card.dataset.duration));
    const matchesBudget = filterByRange(budget, 'budget', Number(card.dataset.budget));

    const shouldHide = !matchesCategory || !matchesSearch || !matchesDifficulty || !matchesDuration || !matchesBudget;
    card.hidden = shouldHide;
    if (!shouldHide) visibleCards += 1;
  });

  if (tutorialsEmpty) tutorialsEmpty.hidden = visibleCards > 0;
}

tutorialSearch?.addEventListener('input', filterTutorials);
tutorialControls?.addEventListener('submit', (event) => event.preventDefault());
tutorialFilterSelects?.forEach((select) => select.addEventListener('change', filterTutorials));

tutorialChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    activeTutorialCategory = chip.textContent.trim().toLowerCase();
    tutorialChips.forEach((item) => item.classList.toggle('is-active', item === chip));
    filterTutorials();
  });
});

const tutorialFilterButton = document.querySelector('.tutorials__filter');
const tutorialFilterReset = tutorialFilterPanel?.querySelector('button');

function toggleTutorialFilters(show) {
  if (!tutorialFilterButton || !tutorialFilterPanel) return;

  tutorialFilterPanel.hidden = !show;
  tutorialFilterButton.setAttribute('aria-expanded', String(show));
}

tutorialFilterButton?.addEventListener('click', () => {
  toggleTutorialFilters(tutorialFilterPanel?.hidden);
});

tutorialFilterReset?.addEventListener('click', () => {
  tutorialFilterPanel?.querySelectorAll('select').forEach((select) => { select.value = 'any'; });
  filterTutorials();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') toggleTutorialFilters(false);
});

// Для повторного теста анимации в DevTools можно выполнить:
// hero.classList.remove('hero--animate');
// requestAnimationFrame(() => hero.classList.add('hero--animate'));

// В будущем отдельные предметы можно будет размечать так:
// <img class="object object--shirt fly-item" src="assets/shirt.webp" alt="" />
// и каждому задавать собственные delay / transform через CSS.
