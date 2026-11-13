
(()=>{
  function initBtuCalc() {
    const form = document.querySelector('#btu-calc-form');
    if (!form) return;

    const areaInput = form.querySelector('#btu-area');
    const personsSelect = form.querySelector('#btu-persons');
    const windowsSelect = form.querySelector('#btu-windows');
    const sunSelect = form.querySelector('#btu-sun');
    const insulationSelect = form.querySelector('#btu-insulation');
    const electronicsSelect = form.querySelector('#btu-electronics');
    const resultBox = document.querySelector('#btu-result-box');
    const resultVal = document.querySelector('#btu-result-val');
    const resultTip = document.querySelector('#btu-result-tip');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const area = parseFloat(areaInput.value);
      if (!area || area <= 0) {
        areaInput.focus();
        return;
      }

      const sun = sunSelect.value;
      const basePerM2 = (sun === 'strong') ? 800 : (sun === 'weak') ? 550 : 650;

      const persons = parseInt(personsSelect.value, 10) || 1;
      const personBtu = Math.max(0, persons - 1) * 600;

      const windows = parseInt(windowsSelect.value, 10) || 1;
      const windowBtu = windows * 500;

      const insulation = insulationSelect.value;
      const insulFactor = (insulation === 'poor') ? 1.2 : (insulation === 'good') ? 0.9 : 1.0;

      const electronics = electronicsSelect.value;
      const elecBtu = (electronics === 'many') ? 1200 : (electronics === 'few') ? 300 : 600;

      const rawBtu = ((area * basePerM2) + personBtu + windowBtu + elecBtu) * insulFactor;

      let commercialBtu = 9000;
      let powerKw = '2.5 kW';
      if (rawBtu <= 6000) {
        commercialBtu = 7000;
        powerKw = '2.0 kW';
      } else if (rawBtu <= 10000) {
        commercialBtu = 9000;
        powerKw = '2.5 kW';
      } else if (rawBtu <= 14000) {
        commercialBtu = 12000;
        powerKw = '3.5 kW';
      } else if (rawBtu <= 20000) {
        commercialBtu = 18000;
        powerKw = '5.0 kW';
      } else if (rawBtu <= 26000) {
        commercialBtu = 24000;
        powerKw = '7.0 kW';
      } else {
        commercialBtu = Math.ceil(rawBtu / 6000) * 6000;
        powerKw = (commercialBtu * 0.000293).toFixed(1) + ' kW';
      }

      const lang = (document.documentElement.lang || 'pt').split('-')[0].toLowerCase();
      const locale = {en:'en-GB',es:'es-ES',fr:'fr-FR'}[lang];
      const n = value => value.toLocaleString(locale);
      const messages = {
        pt:(r,a,c) => 'Estimativa base: ' + r + ' BTU/h para ' + a + ' m². Recomendamos um equipamento comercial de ' + c + ' BTU.',
        en:(r,a,c) => 'Base estimate: ' + r + ' BTU/h for ' + a + ' m². We recommend a standard unit rated at ' + c + ' BTU.',
        es:(r,a,c) => 'Estimación base: ' + r + ' BTU/h para ' + a + ' m². Recomendamos un equipo comercial de ' + c + ' BTU.',
        fr:(r,a,c) => 'Estimation de base : ' + r + ' BTU/h pour ' + a + ' m². Nous recommandons un appareil standard de ' + c + ' BTU.'
      };
      resultVal.textContent = n(commercialBtu) + ' BTU (' + powerKw + ')';
      resultTip.textContent = (messages[lang] || messages.pt)(n(Math.round(rawBtu)), lang === 'pt' ? area : n(area), n(commercialBtu));
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function initCopyProtection() {
    const targets = document.querySelectorAll('.no-copy');
    targets.forEach(el => {
      el.addEventListener('copy', (e) => {
        e.preventDefault();
        return false;
      });
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      el.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initBtuCalc();
      initCopyProtection();
    });
  } else {
    initBtuCalc();
    initCopyProtection();
  }
})();
