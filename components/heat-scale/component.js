import { heatDescriptor } from '../shared/utils.js';

const HEAT_RECOMMENDATIONS = [
  { max: 2, text: 'Keep it cool: citrus, yogurt, cucumber, or fresh herbs to tame heat.' },
  { max: 4, text: 'Gentle warmth: black pepper, sweet paprika, or a dash of chili oil on the side.' },
  { max: 7, text: 'Balanced heat: garlic-chili crisp, jalapeno, red pepper flakes, or smoky paprika.' },
  { max: 9, text: 'Turn it up: cayenne, serrano, gochugaru, chipotle, or a spoon of sambal.' },
  { max: 10, text: "Fire level: habanero, bird's eye, ghost pepper oil; offer yogurt or lime as a cooldown." }
];

export function initHeatScale(root) {
  if (!root) return;
  const slider = root.querySelector('#heatSlider');
  const label = root.querySelector('#heatLabel');
  const reco = root.querySelector('#heatReco');
  const addBtn = root.querySelector('#heatAddBtn');
  if (!slider || !label || !reco) return;

  function recommendation(val) {
    const entry = HEAT_RECOMMENDATIONS.find(r => val <= r.max) || HEAT_RECOMMENDATIONS[HEAT_RECOMMENDATIONS.length - 1];
    return entry.text;
  }

  function update() {
    const val = Number(slider.value || 0);
    label.textContent = `${heatDescriptor(val)} (${val}/10)`;
    reco.textContent = recommendation(val);
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const current = Number(slider.value || 0);
      const next = Math.min(10, current + 1);
      slider.value = String(next);
      update();
    });
  }

  slider.addEventListener('input', update);
  update();
}
