const medicationsInput = document.querySelector('#medications');
const foodsInput = document.querySelector('#foods');
const checkButton = document.querySelector('#check-button');
const resultsTitle = document.querySelector('#results-title');
const resultsContent = document.querySelector('#results-content');
const resultStatus = document.querySelector('#result-status');
const photoInput = document.querySelector('#photo-input');
const photoPreview = document.querySelector('#photo-preview');
const ocrControls = document.querySelector('#ocr-controls');
const readPhotoButton = document.querySelector('#read-photo');
const ocrStatus = document.querySelector('#ocr-status');
const ocrText = document.querySelector('#ocr-text');
const ocrDestination = document.querySelector('#ocr-destination');
const useOcrTextButton = document.querySelector('#use-ocr-text');
const voiceButton = document.querySelector('#voice-button');
const voiceStatus = document.querySelector('#voice-status');
let selectedPhotoUrl = null;
let ocrRunId = 0;

const interactionRules = [
  {
    medications: ['warfarin', 'coumadin'],
    foods: ['spinach', 'kale', 'broccoli', 'collard greens', 'turnip greens', 'swiss chard', 'leafy greens', 'vitamin k'],
    title: 'Warfarin + vitamin K-rich greens',
    text: 'Vitamin K in some leafy greens can affect warfarin. Consistency matters; do not cut greens out or change your diet based on this demo. Ask your anticoagulation care team.',
  },
  {
    medications: ['simvastatin', 'zocor', 'atorvastatin', 'lipitor', 'nifedipine', 'procardia', 'adalat', 'cyclosporine', 'neoral', 'sandimmune', 'buspirone', 'buspar', 'budesonide', 'amiodarone', 'fexofenadine'],
    foods: ['grapefruit', 'grapefruit juice', 'pomelo', 'seville orange', 'tangelo'],
    title: 'Grapefruit and certain medicines',
    text: 'Grapefruit can change how some medicines are absorbed or broken down. Whether it matters depends on the exact medicine; check its label and ask your pharmacist.',
    source: { label: 'FDA: Grapefruit and some drugs', url: 'https://www.fda.gov/consumers/consumer-updates/grapefruit-juice-and-some-drugs-dont-mix' },
  },
  {
    medications: ['tetracycline', 'doxycycline', 'ciprofloxacin', 'cipro', 'levothyroxine', 'synthroid', 'levoxyl'],
    foods: ['milk', 'dairy', 'yogurt', 'cheese', 'calcium', 'calcium supplement', 'fortified juice'],
    title: 'Calcium-rich foods + selected medicines',
    text: 'Calcium can reduce absorption of some medicines. The medicines affected and the time to separate food or supplements vary; follow your prescription instructions and ask your pharmacist.',
  },
  {
    medications: ['phenelzine', 'nardil', 'tranylcypromine', 'parnate', 'isocarboxazid', 'marplan', 'maoi'],
    foods: ['aged cheese', 'blue cheese', 'cured meat', 'salami', 'pepperoni', 'fermented meat', 'soy sauce', 'fermented soy', 'draft beer', 'tap beer', 'tyramine'],
    title: 'Tyramine-rich foods + MAOI medicines',
    text: 'Some aged or fermented foods and drinks can contain tyramine. With certain MAOI medicines, this may cause a dangerous rise in blood pressure. Follow your medicine-specific food guidance and contact your prescriber or pharmacist.',
  },
  {
    medications: ['furosemide', 'lasix', 'hydrochlorothiazide', 'microzide', 'digoxin', 'lanoxin'],
    foods: ['black licorice', 'licorice', 'liquorice'],
    title: 'Licorice + selected medicines',
    text: 'Real licorice can lower potassium and affect blood pressure; this may be a concern with some diuretics or digoxin. Candy ingredients vary—ask your pharmacist about your medicine and the product.',
  },
  {
    medications: ['lisinopril', 'zestril', 'prinivil', 'spironolactone', 'aldactone', 'enalapril', 'benazepril', 'losartan', 'valsartan'],
    foods: ['potassium', 'potassium salt', 'salt substitute', 'banana', 'bananas', 'orange', 'oranges', 'tomato', 'tomatoes', 'potato', 'potatoes', 'dried fruit'],
    title: 'Potassium-rich foods + selected blood pressure medicines',
    text: 'Some medicines can raise blood potassium. Whether foods such as bananas or tomatoes need limits depends on your health and lab results; do not avoid them or change your diet without personalized advice.',
  },
  {
    medications: ['warfarin', 'coumadin'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + warfarin',
    text: 'Alcohol can affect warfarin response; heavy or binge drinking and changes in drinking habits may affect bleeding risk or INR. Ask your anticoagulation care team what is safe for you.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['simvastatin', 'zocor'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + simvastatin',
    text: 'Heavy alcohol use may increase the risk of liver problems with simvastatin. Ask your clinician or pharmacist about your drinking and liver health.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['lisinopril', 'zestril', 'prinivil'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + lisinopril',
    text: 'Alcohol may add to blood-pressure-lowering effects and increase dizziness or lightheadedness. Ask your pharmacist about your own situation, especially when starting or changing a dose.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['metronidazole', 'flagyl', 'tinidazole', 'fasigyn'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + selected antibiotics',
    text: 'Some antibiotic labels advise avoiding alcohol during treatment and for a period afterward. Check the exact medicine label and ask your pharmacist before drinking.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['alprazolam', 'xanax', 'lorazepam', 'ativan', 'diazepam', 'valium', 'clonazepam', 'klonopin', 'zolpidem', 'ambien', 'oxycodone', 'hydrocodone', 'morphine', 'codeine', 'tramadol'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + sedating or opioid medicines',
    text: 'Alcohol can intensify sleepiness and impaired coordination with these medicines; some combinations can dangerously slow breathing. Avoid combining them until you have checked with your prescriber or pharmacist.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['ibuprofen', 'advil', 'motrin', 'naproxen', 'aleve', 'aspirin'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + selected pain relievers',
    text: 'Alcohol can increase stomach irritation and bleeding risk with some pain relievers, especially NSAIDs. Ask your pharmacist whether this applies to your dose and health history.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
  {
    medications: ['acetaminophen', 'paracetamol', 'tylenol'],
    foods: ['alcohol', 'vodka', 'beer', 'wine', 'whiskey', 'whisky', 'liquor', 'spirits', 'cocktail'],
    title: 'Alcohol + acetaminophen',
    text: 'Alcohol and acetaminophen can both affect the liver. Risk varies with amount, timing, and health history; check the product label and ask a clinician or pharmacist.',
    source: { label: 'NIAAA: Alcohol and medicines', url: 'https://www.niaaa.nih.gov/publications/brochures-and-fact-sheets/harmful-interactions-mixing-alcohol-with-medicines' },
  },
];

function splitList(value) {
  return value.toLowerCase().split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function containsTerm(text, term) {
  const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(text);
}

function runCheck() {
  const medications = splitList(medicationsInput.value);
  const foods = splitList(foodsInput.value);

  if (!medications.length || !foods.length) {
    resultsTitle.textContent = 'Add both parts of your list';
    resultStatus.textContent = 'MORE INFO NEEDED';
    resultStatus.classList.remove('has-results');
    resultsContent.innerHTML = '<div class="empty-state"><div class="empty-illustration" aria-hidden="true"><span class="plate"></span><span class="food-dot dot-a"></span><span class="food-dot dot-b"></span><span class="food-dot dot-c"></span></div><h4>We need a medication and a food.</h4><p>Enter at least one medication name and one food. This limited example list cannot establish that any unflagged combination is safe.</p><button class="reset-button" type="button" id="try-example">Use the demo example →</button></div>';
    document.querySelector('#try-example').addEventListener('click', loadExample);
    return;
  }

  const medicationText = medications.join(' ');
  const foodText = foods.join(' ');
  const findings = interactionRules.filter((rule) =>
    rule.medications.some((term) => containsTerm(medicationText, term))
    && rule.foods.some((term) => containsTerm(foodText, term)),
  );

  resultsTitle.textContent = findings.length ? 'Possible discussion points' : 'No example rule matched';
  resultStatus.textContent = findings.length ? `${findings.length} EXAMPLE FLAG${findings.length === 1 ? '' : 'S'}` : 'NOT ASSESSED';
  resultStatus.classList.toggle('has-results', findings.length > 0);
  const findingsMarkup = findings.length
    ? findings.map((finding) => `<article class="finding"><span class="finding-mark" aria-hidden="true">!</span><div><span class="finding-label">DISCUSS WITH YOUR PHARMACIST</span><h4>${escapeHtml(finding.title)}</h4><p>${escapeHtml(finding.text)}</p>${finding.source ? `<a class="source-link" href="${finding.source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(finding.source.label)} ↗</a>` : ''}</div></article>`).join('')
    : '<article class="finding neutral"><span class="finding-mark" aria-hidden="true">?</span><div><h4>Not assessed by this demo.</h4><p>No example rule matched this pair. That is not evidence it is safe—the list is limited and may miss interactions. Ask your pharmacist to review your full list.</p></div></article>';

  resultsContent.innerHTML = `
    <div class="result-populated">
      <p class="scan-summary"><b>Example flags only—not a safety clearance.</b><br>Looking at ${escapeHtml(medications.join(', '))} and ${escapeHtml(foods.join(', '))}.</p>
      ${findingsMarkup}
      <article class="recipe-card">
        <div class="recipe-heading"><span class="eyebrow">A SIMPLE MEAL IDEA</span><span>Budget-friendly</span></div>
        <h4>Cozy rice &amp; roasted vegetable bowl</h4>
        <p>Serve rice with roasted carrots and seasonal vegetables. Use what you have, and check each ingredient against your personal care plan before eating.</p>
        <p class="recipe-caveat">A demo suggestion only—not checked for your complete medication list, allergies, or nutrition needs.</p>
      </article>
      <p class="no-match">This is a small educational example collection, not a complete or clinically validated database. It can miss serious interactions. Please verify your full list with a pharmacist.</p>
      <button class="reset-button" type="button" id="edit-list">← Edit my list</button>
    </div>`;
  document.querySelector('#edit-list').addEventListener('click', () => medicationsInput.focus());
}

function loadExample() {
  medicationsInput.value = 'warfarin';
  foodsInput.value = 'spinach, rice, carrots';
  runCheck();
}

document.querySelectorAll('.suggestion').forEach((button) => {
  button.addEventListener('click', () => {
    const value = medicationsInput.value.trim();
    const current = splitList(value);
    const selected = button.dataset.med;
    if (!current.includes(selected)) {
      medicationsInput.value = value ? `${value.replace(/[,;\s]+$/, '')}, ${selected}` : selected;
    }
    medicationsInput.focus();
  });
});

checkButton.addEventListener('click', runCheck);
document.querySelector('#try-example').addEventListener('click', loadExample);

photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0];
  if (!file) return;
  ocrRunId += 1;
  if (selectedPhotoUrl) URL.revokeObjectURL(selectedPhotoUrl);
  selectedPhotoUrl = null;
  ocrText.value = '';
  ocrStatus.textContent = '';
  readPhotoButton.disabled = false;
  if (!file.type.startsWith('image/')) {
    photoPreview.hidden = false;
    photoPreview.textContent = 'Please choose an image file. No image was selected for OCR.';
    ocrControls.hidden = true;
    photoInput.value = '';
    return;
  }
  if (file.size > 12 * 1024 * 1024) {
    photoPreview.hidden = false;
    photoPreview.textContent = 'This image is larger than 12 MB. Choose a smaller image to continue.';
    ocrControls.hidden = true;
    photoInput.value = '';
    return;
  }
  selectedPhotoUrl = URL.createObjectURL(file);
  photoPreview.hidden = false;
  photoPreview.innerHTML = `<img src="${selectedPhotoUrl}" alt="Selected image preview"><button type="button" aria-label="Remove selected photo">Remove photo</button>`;
  ocrControls.hidden = false;
  photoPreview.querySelector('button').addEventListener('click', () => {
    ocrRunId += 1;
    URL.revokeObjectURL(selectedPhotoUrl);
    selectedPhotoUrl = null;
    photoInput.value = '';
    photoPreview.replaceChildren();
    photoPreview.hidden = true;
    ocrControls.hidden = true;
    ocrText.value = '';
    ocrStatus.textContent = '';
  });
});

readPhotoButton.addEventListener('click', async () => {
  const file = photoInput.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    ocrStatus.textContent = 'Choose an image before starting text recognition.';
    return;
  }
  if (!window.Tesseract?.createWorker) {
    ocrStatus.textContent = 'The on-device text reader did not load. Check your connection and reload the page to try again.';
    return;
  }

  const runId = ++ocrRunId;
  readPhotoButton.disabled = true;
  ocrStatus.textContent = 'Preparing the on-device text reader…';
  let worker;
  try {
    worker = await window.Tesseract.createWorker('eng', 1, {
      logger: (message) => {
        if (runId !== ocrRunId) return;
        if (message.status === 'recognizing text') {
          ocrStatus.textContent = `Reading text in your browser… ${Math.round(message.progress * 100)}%`;
        } else if (message.status) {
          ocrStatus.textContent = `Preparing text recognition: ${message.status}…`;
        }
      },
    });
    if (runId !== ocrRunId) return;
    const { data } = await worker.recognize(file);
    if (runId !== ocrRunId) return;
    ocrText.value = data.text.trim();
    ocrStatus.textContent = ocrText.value
      ? 'Text found. Review and correct it below before adding it to a list.'
      : 'No readable text found. Try a clearer, well-lit photo or enter the names manually.';
  } catch (error) {
    if (runId === ocrRunId) {
      ocrStatus.textContent = `Text recognition failed: ${error.message || 'unknown error'}. You can type the names instead.`;
    }
  } finally {
    worker?.terminate();
    if (runId === ocrRunId) readPhotoButton.disabled = false;
  }
});

useOcrTextButton.addEventListener('click', () => {
  const reviewedText = ocrText.value.trim();
  if (!reviewedText) {
    ocrStatus.textContent = 'Review or enter some text before adding it to your list.';
    return;
  }
  const target = ocrDestination.value === 'medications' ? medicationsInput : foodsInput;
  const additions = reviewedText.split(/\r?\n+/).map((line) => line.trim()).filter(Boolean).join(', ');
  target.value = [target.value.trim(), additions].filter(Boolean).join(', ');
  target.focus();
  ocrStatus.textContent = `Added reviewed text to your ${ocrDestination.value === 'medications' ? 'medication' : 'food'} list.`;
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
voiceButton.addEventListener('click', () => {
  if (!SpeechRecognition) {
    voiceStatus.textContent = 'Voice input isn’t available in this browser. You can type your list instead.';
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = navigator.language || 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  voiceButton.classList.add('listening');
  voiceStatus.textContent = 'Listening… say your grocery items.';
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    foodsInput.value = foodsInput.value.trim()
      ? `${foodsInput.value.trim().replace(/[,;\s]+$/, '')}, ${transcript}`
      : transcript;
    voiceStatus.textContent = `Added: “${transcript}”`;
  };
  recognition.onerror = (event) => {
    voiceStatus.textContent = event.error === 'not-allowed'
      ? 'Microphone permission was denied. You can type your list instead.'
      : `Voice input couldn’t start (${event.error}). You can type your list instead.`;
  };
  recognition.onend = () => voiceButton.classList.remove('listening');
  try {
    recognition.start();
  } catch {
    voiceButton.classList.remove('listening');
    voiceStatus.textContent = 'Voice input couldn’t start. You can type your list instead.';
  }
});
