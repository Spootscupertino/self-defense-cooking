import { initDietary } from './dietary/component.js';
import { initMacros } from './macros/component.js';
import { initNutrition } from './nutrition/component.js';
import { initHeatScale } from './heat-scale/component.js';
import { initPortions } from './portions/component.js';
import { initPrice } from './price/component.js';
import { initDifficulty } from './difficulty/component.js';
import { initTime } from './time/component.js';
import { formatQty } from './shared/utils.js';
import { suggestSubs } from './shared/substitutions.js';

let recipeIndex = [];
let portionsControl;
let avoidAllergens = new Set();
let recipeAllergenSet = new Set();
let categorizedIndex = [];
let activeCategory = null;
let statusEl;

const PLACEHOLDER_INGREDIENTS = ['salt', 'black pepper', 'olive oil'];
const PLACEHOLDER_STEP_PREFIX = 'Prepare ingredients and preheat equipment';

const ALLERGEN_KEYWORDS = {
  Gluten: ['wheat', 'flour', 'bread', 'pasta', 'noodle', 'cracker', 'breadcrumb', 'spaghetti', 'tortilla', 'couscous', 'barley', 'rye', 'semolina', 'farro'],
  Dairy: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'ghee', 'parmesan', 'cheddar', 'mozzarella', 'feta'],
  Eggs: ['egg', 'eggs', 'mayo', 'mayonnaise', 'aioli'],
  Peanuts: ['peanut', 'peanuts', 'satay'],
  'Tree Nuts': ['almond', 'walnut', 'pecan', 'pistachio', 'cashew', 'hazelnut', 'macadamia', 'nut'],
  Soy: ['soy', 'tofu', 'edamame', 'tamari', 'miso', 'soy sauce'],
  Shellfish: ['shrimp', 'prawn', 'lobster', 'crab', 'scallop', 'clam', 'mussel', 'oyster'],
  Fish: ['salmon', 'tuna', 'cod', 'tilapia', 'anchovy', 'trout', 'bass', 'sardine'],
  Sesame: ['sesame', 'tahini', 'zaatar']
};

function detectAllergens(name = '') {
  const lower = name.toLowerCase();
  return Object.entries(ALLERGEN_KEYWORDS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([label]) => label);
}

async function fetchJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json();
}

function getSlugFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function renderIngredients(listEl, ingredients = []) {
  if (!listEl) return;
  const detected = new Set(recipeAllergenSet);
  listEl.innerHTML = ingredients
    .map(item => {
      const qty = item.quantity;
      const numericQty = Number(qty);
      const displayQty = Number.isFinite(numericQty) ? formatQty(numericQty) : qty;
      const unit = item.unit || '';
      const name = item.name || '';
      const baseAttr = Number.isFinite(numericQty) ? numericQty : '';
      const explicitAllergens = Array.isArray(item.allergens) ? item.allergens : [];
      const allergens = explicitAllergens.length ? explicitAllergens : detectAllergens(name);
      allergens.forEach(a => detected.add(a));
      const allergenTags = allergens.length
        ? `<div class="allergen-tags">${allergens.map(a => `<span class="allergen-tag">${a}</span>`).join('')}</div>`
        : '';
      const dataAllergens = allergens.join(',');
      return `<li data-base-qty="${baseAttr}" data-unit="${unit}" data-name="${name}" data-allergens="${dataAllergens}">
        <div class="ing-row">
          <span class="qty">${displayQty}</span> <span class="unit">${unit}</span> <span class="name">${name}</span>
          ${allergenTags}
          <button class="sub-btn" type="button" data-name="${name}">Substitute</button>
        </div>
        <div class="sub-panel" hidden>
          <div class="sub-title">Try:</div>
          <ul class="sub-list"></ul>
        </div>
      </li>`;
    })
    .join('');
  recipeAllergenSet = detected;
  updateAllergenSummary();
  applyAllergenHighlighting();
}

function renderDirections(listEl, directions = []) {
  if (!listEl) return;
  listEl.innerHTML = directions.map(step => `<li>${step}</li>`).join('');
}

async function loadRecipeList() {
  if (recipeIndex.length) return recipeIndex;
  try {
    recipeIndex = await fetchJSON('recipes/list.json');
    categorizedIndex = recipeIndex.map(item => ({ ...item, categories: categorizeRecipe(item) }));
    return recipeIndex;
  } catch (err) {
    console.warn('Failed to load recipe list:', err);
    return [];
  }
}

async function fetchRecipeBySlug(slug) {
  if (!slug) return null;
  try {
    const recipe = await fetchJSON(`recipes/${slug}/recipe.json`);
    recipe.allergens = deriveAllergensFromIngredients(recipe);
    return recipe;
  } catch (err) {
    console.warn(`Failed to load recipe ${slug}:`, err);
    return null;
  }
}

function deriveAllergensFromIngredients(recipe = {}) {
  const topLevel = Array.isArray(recipe.allergens) ? recipe.allergens : [];
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const found = new Set(topLevel);
  ingredients.forEach(item => {
    const explicit = Array.isArray(item.allergens) ? item.allergens : [];
    explicit.forEach(a => found.add(a));
    detectAllergens(item.name || '').forEach(a => found.add(a));
  });
  return Array.from(found);
}

function populateRecipe(recipe) {
  if (!recipe) return;
  const titleEl = document.querySelector('.brand h1');
  if (titleEl) titleEl.textContent = recipe.title || 'Recipe';

  const portionInput = document.getElementById('portionInput');
  const ingredientsList = document.getElementById('ingredientsList');
  const directionsList = document.querySelector('.section-content ol');
  const notesEl = document.querySelector('.section summary + .section-content p');

  const recipeYield = Number(recipe.yield) || 4;
  if (portionInput) portionInput.value = recipeYield;

  recipeAllergenSet = new Set(Array.isArray(recipe.allergens) ? recipe.allergens : []);
  renderIngredients(ingredientsList, recipe.ingredients);
  renderDirections(directionsList, recipe.directions);
  if (notesEl && recipe.notes) notesEl.textContent = recipe.notes;

  // Nutrition/macros (skip zero/empty to preserve defaults)
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    const isNumber = typeof val === 'number';
    const isEmpty = val === undefined || val === null || val === '';
    const isZero = isNumber && val === 0;
    if (el && !isEmpty && !isZero) el.value = val;
  };

  setVal('caloriesInput', recipe.nutrition?.calories);
  setVal('sodiumInput', recipe.nutrition?.sodium);
  setVal('satFatInput', recipe.nutrition?.saturatedFat);
  setVal('fiberInput', recipe.nutrition?.fiber);
  setVal('sugarInput', recipe.nutrition?.sugar);

  setVal('proteinInput', recipe.macros?.protein);
  setVal('carbsInput', recipe.macros?.carbs);
  setVal('fatInput', recipe.macros?.fat);

  setVal('pricePerServing', recipe.price?.perServing);
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect && recipe.price?.currency) currencySelect.value = recipe.price.currency;

  const diffSelect = document.getElementById('difficultySelect');
  if (diffSelect && recipe.difficulty) diffSelect.value = recipe.difficulty;

  setVal('prepTime', recipe.time?.prepMinutes);
  setVal('cookTime', recipe.time?.cookMinutes);
}

const CATEGORIES = [
  { id: 'chicken', label: 'Chicken', keywords: ['chicken', 'wing'] },
  { id: 'beef', label: 'Beef', keywords: ['beef', 'hamburger', 'meatball', 'meatloaf'] },
  { id: 'pork', label: 'Pork', keywords: ['pork', 'ham', 'bacon', 'sausage'] },
  { id: 'seafood', label: 'Seafood', keywords: ['salmon', 'fish', 'shrimp', 'cod', 'tilapia', 'lobster', 'crab'] },
  { id: 'pasta', label: 'Pasta & Noodles', keywords: ['pasta', 'noodle', 'ziti', 'lasagna', 'spaghetti', 'mac'] },
  { id: 'mex', label: 'Tacos & Tex-Mex', keywords: ['taco', 'burrito', 'enchilada', 'quesadilla'] },
  { id: 'soups', label: 'Soups & Stews', keywords: ['soup', 'stew', 'chili'] },
  { id: 'breakfast', label: 'Breakfast', keywords: ['pancake', 'omelette', 'toast', 'egg'] },
  { id: 'veg', label: 'Veggie & Sides', keywords: ['salad', 'vegetable', 'mashed', 'rice', 'beans', 'potato'] },
  { id: 'dessert', label: 'Dessert', keywords: ['cookie', 'bread', 'cake'] }
];

function categorizeRecipe(item = {}) {
  const hay = `${(item.title || '').toLowerCase()} ${(item.slug || '').toLowerCase()}`;
  const hits = CATEGORIES.filter(cat => cat.keywords.some(k => hay.includes(k))).map(cat => cat.id);
  return hits.length ? hits : ['other'];
}

// Bootstraps the componentized controls once the DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const portionRoot = document.getElementById('portionsControl');
  const portionInput = document.getElementById('portionInput');
  const portionApply = document.getElementById('portionApply');
  const servingsLabel = document.getElementById('servingsLabel');
  statusEl = document.getElementById('recipeStatus');

  const list = await loadRecipeList();
  const initialSlug = getSlugFromQuery() || (list[0] && list[0].slug);
  const recipe = initialSlug ? await safeSelect(initialSlug) : null;
  const recipeYield = Number(recipe?.yield) || 4;

  initDietary(document.getElementById('dietaryControl'));
  initMacros(document.getElementById('macrosControl'));
  initNutrition(document.getElementById('nutritionControl'), { portionInput });
  initHeatScale(document.getElementById('heatControl'));
  portionsControl = initPortions({
    root: portionRoot,
    ingredientsList: document.getElementById('ingredientsList'),
    servingsLabel,
    baseServings: recipeYield
  });
  attachSubstitutionControls(document.getElementById('ingredientsList'));
  initPrice(document.getElementById('priceControl'), { portionInput, portionApply });
  initDifficulty(document.getElementById('difficultyControl'));
  initTime(document.getElementById('timeControl'));
  initAllergenControl();
  initCategoryBoard(categorizedIndex, slug => selectRecipe(slug));
  refreshControlSummaries();

  initSearch(list, selectRecipe, initialSlug);

  const cuisineBrowser = document.getElementById('recipeBrowse');
  if (cuisineBrowser) {
    cuisineBrowser.addEventListener('click', e => {
      const li = e.target.closest('[data-slug]');
      if (!li) return;
      e.preventDefault();
      selectRecipe(li.dataset.slug);
    });
  }

  async function safeSelect(slug) {
    try {
      const recipe = await fetchRecipeBySlug(slug);
      if (!recipe) {
        showStatus(`Could not load recipe: ${slug}`, 'error');
        return null;
      }
      populateRecipe(recipe);
      const nextYield = Number(recipe.yield) || 4;
      if (portionInput) portionInput.value = nextYield;
      if (portionsControl?.setBase) portionsControl.setBase(nextYield);
      attachSubstitutionControls(document.getElementById('ingredientsList'));
      applyAllergenHighlighting();
      refreshControlSummaries();
      updateQueryString(slug);
      if (isPlaceholderRecipe(recipe)) {
        showStatus(`Loaded ${recipe.title || slug} — needs real data (ingredients/steps/macros)`, 'warn');
      } else {
        showStatus(`Loaded ${recipe.title || slug}`, 'ok');
      }
      return recipe;
    } catch (err) {
      console.error('Select recipe failed', slug, err);
      showStatus(`Error loading recipe: ${slug}`, 'error');
      return null;
    }
  }

  async function selectRecipe(slug) {
    await safeSelect(slug);
  }
});

function attachSubstitutionControls(listEl) {
  if (!listEl) return;
  const buttons = Array.from(listEl.querySelectorAll('.sub-btn'));
  buttons.forEach(btn => {
    const name = btn.dataset.name || '';
    const panel = btn.closest('li')?.querySelector('.sub-panel');
    const list = panel?.querySelector('.sub-list');
    if (!panel || !list) return;
    const suggestions = suggestSubs(name);
    if (suggestions.length === 0) {
      list.innerHTML = '<li>No suggested substitutions yet.</li>';
    } else {
      list.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
    }
    btn.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
    });
  });
}

function updateAllergenSummary() {
  const summary = document.getElementById('allergenSummary');
  if (!summary) return;
  const list = Array.from(recipeAllergenSet);
  if (!list.length) {
    summary.innerHTML = '<span class="allergen-chip">No common allergens detected</span>';
    return;
  }
  summary.innerHTML = list
    .map(a => `<span class="allergen-chip alert">${a}</span>`)
    .join('');
}

function applyAllergenHighlighting() {
  const items = Array.from(document.querySelectorAll('#ingredientsList li'));
  items.forEach(li => {
    const allergens = (li.dataset.allergens || '').split(',').filter(Boolean);
    const flagged = allergens.some(a => avoidAllergens.has(a));
    li.classList.toggle('ingredient-flagged', flagged);
  });
}

function initAllergenControl() {
  const checks = Array.from(document.querySelectorAll('.allergen-check'));
  if (!checks.length) return;
  const sync = () => {
    avoidAllergens = new Set(checks.filter(c => c.checked).map(c => c.value));
    applyAllergenHighlighting();
  };
  checks.forEach(c => c.addEventListener('change', sync));
  sync();
}

function showStatus(message, tone = 'info') {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.dataset.tone = tone;
}

function isPlaceholderRecipe(recipe = {}) {
  const ing = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
  const dirs = Array.isArray(recipe.directions) ? recipe.directions : [];
  const hasOnlyTemplateIngredients =
    ing.length <= 3 &&
    ing.every(item => PLACEHOLDER_INGREDIENTS.includes((item.name || '').toLowerCase()));
  const hasTemplateStep = dirs.some(step => (step || '').startsWith(PLACEHOLDER_STEP_PREFIX));
  const macros = recipe.macros || {};
  const nutrition = recipe.nutrition || {};
  const macrosZero = ['protein', 'carbs', 'fat'].every(k => Number(macros[k] || 0) === 0);
  const nutritionZero = ['calories', 'sodium', 'saturatedFat'].every(k => Number(nutrition[k] || 0) === 0);
  return hasOnlyTemplateIngredients || hasTemplateStep || (macrosZero && nutritionZero);
}

function initCategoryBoard(list = [], onSelect) {
  const chipsEl = document.getElementById('categoryChips');
  const picksEl = document.getElementById('categoryPicks');
  if (!chipsEl || !picksEl) return;

  function renderChips() {
    chipsEl.innerHTML = CATEGORIES.map(cat => {
      const active = activeCategory === cat.id ? 'active' : '';
      return `<button class="category-chip ${active}" data-cat="${cat.id}">${cat.label}</button>`;
    }).join('');
    const buttons = Array.from(chipsEl.querySelectorAll('button[data-cat]'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        renderChips();
        renderPicks();
      });
    });
  }

  function renderPicks() {
    const catId = activeCategory || CATEGORIES[0].id;
    const picks = list.filter(item => (item.categories || []).includes(catId)).slice(0, 25);
    const fallback = picks.length ? picks : list.slice(0, 25);
    picksEl.innerHTML = (picks.length ? picks : fallback)
      .map(item => `<li data-slug="${item.slug}">${item.title || item.slug}</li>`)
      .join('');
    const lis = Array.from(picksEl.querySelectorAll('li[data-slug]'));
    lis.forEach(li => li.addEventListener('click', () => onSelect?.(li.dataset.slug)));
  }

  activeCategory = CATEGORIES[0].id;
  renderChips();
  renderPicks();
}

function refreshControlSummaries() {
  const ids = [
    'proteinInput',
    'carbsInput',
    'fatInput',
    'caloriesInput',
    'sodiumInput',
    'satFatInput',
    'prepTime',
    'cookTime',
    'pricePerServing'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const difficulty = document.getElementById('difficultySelect');
  if (difficulty) difficulty.dispatchEvent(new Event('change', { bubbles: true }));
}

function updateQueryString(slug) {
  const url = new URL(window.location.href);
  url.searchParams.set('slug', slug);
  window.history.replaceState({}, '', url);
}

function initSearch(list = [], onSelect, activeSlug) {
  const input = document.getElementById('recipeSearch');
  const results = document.getElementById('searchResults');
  const card = input?.closest('.search-card');
  if (!input || !results || !card) return;

  if (activeSlug) {
    const active = list.find(item => item.slug === activeSlug);
    if (active) input.value = active.title || active.slug;
  }

  const render = term => {
    const needle = term.trim().toLowerCase();
    const matches = list
      .filter(item => {
        const title = (item.title || '').toLowerCase();
        const slug = item.slug || '';
        return title.includes(needle) || slug.includes(needle);
      })
      .slice(0, 8);
    results.innerHTML = matches
      .map(item => `<li data-slug="${item.slug}">${item.title || item.slug}</li>`)
      .join('');
    results.hidden = matches.length === 0;
  };

  input.addEventListener('input', e => render(e.target.value));
  input.addEventListener('focus', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      results.hidden = true;
      results.innerHTML = '';
    }
  });

  results.addEventListener('click', e => {
    const li = e.target.closest('li');
    if (!li) return;
    const slug = li.dataset.slug;
    const match = list.find(item => item.slug === slug);
    if (match) {
      input.value = match.title || match.slug;
      results.hidden = true;
      results.innerHTML = '';
      onSelect?.(slug);
    }
  });

  document.addEventListener('click', e => {
    if (!card.contains(e.target)) {
      results.hidden = true;
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    initExtras();
  } catch (err) {
    console.error('[recipe-engine extras]', err);
  }
});

function initExtras() {
  const searchCard = document.querySelector('.search-card');
  if (searchCard) {
    const randomBtn = document.createElement('button');
    randomBtn.type = 'button';
    randomBtn.textContent = 'Random recipe';
    randomBtn.addEventListener('click', () => {
      if (!Array.isArray(recipeIndex) || recipeIndex.length === 0) return;
      const random = recipeIndex[Math.floor(Math.random() * recipeIndex.length)];
      if (random?.slug) loadRecipe(random.slug);
    });
    searchCard.appendChild(randomBtn);
  }

  const ingList = document.getElementById('ingredientsList');
  if (ingList) {
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy ingredients';
    copyBtn.addEventListener('click', () => copyIngredients());
    ingList.parentElement?.appendChild(copyBtn);
  }
}

async function copyIngredients() {
  const ingList = document.getElementById('ingredientsList');
  if (!ingList) return;

  const lines = Array.from(ingList.querySelectorAll('li'))
    .map((li) => li.innerText.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  const text = lines.join('\n');

  try {
    await navigator.clipboard.writeText(text);
    setStatus('Ingredients copied to clipboard.');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    ta.remove();
    setStatus('Ingredients copied.');
  }
}

function setStatus(msg) {
  const el = document.getElementById('recipeStatus');
  if (!el) return;
  el.textContent = msg || '';
  el.classList.add('active');
  window.setTimeout(() => el.classList.remove('active'), 3000);
}
