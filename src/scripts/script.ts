const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

type GetHoursSinceOptions = {
  since: number;
}

function getHoursSince(options: GetHoursSinceOptions) {
  const { since } = options;
  const now = Date.now();
  return Math.ceil(Math.max((now - since) / HOUR));
}

async function getLastVacationDate() {
  return Date.now() - (HOUR * 73);
  // return 17;
}

type CalculateDelayOptions = {
  duration: number;
  count: number;
}

function calculateDelay(options: CalculateDelayOptions) {
  const { duration, count } = options;
  return duration / count;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

type ApplyTallyMarkCountOptions = {
  num: number;
  tally: HTMLImageElement;
}

function applyTallyMarkCount(options: ApplyTallyMarkCountOptions) {
  const { num, tally } = options;

  if (isNaN(num) || num < 1 || num > 5) {
    tally.style.display = 'none';
  } else {
    tally.style.display = 'block';
    tally.src = `./img/tallymark${num}.svg`;
  }
  
  return tally;
}

function createTallyGroupElement() {
  const group = document.createElement('div');
  group.className = 'tally-group';
  return group;
}

type CreateTallyElementOptions = {
  num: number;
}

function createTallyMarkElement(options: CreateTallyElementOptions) {
  const { num } = options;
  const tally = document.createElement('img');
  tally.alt = `Tallymark`;
  tally.className = 'tally-marks';

  return applyTallyMarkCount({ num, tally });
}

type PrepareTallyGroupsOptions = {
  max: number;
  container: HTMLElement
}

function prepareTallyGroups(options: PrepareTallyGroupsOptions): HTMLElement[] {
  const { max, container } = options;
  const groups: HTMLElement[] = [];
  const appendCurrent = (group?: HTMLElement) => 
    currentTallyGroup && container.appendChild(currentTallyGroup);

  let currentTallyGroup = createTallyGroupElement();
  for (let i = 0; i < max + 1; i++) {
    if (i % 5 === 0) {
      currentTallyGroup = createTallyGroupElement();
      appendCurrent(currentTallyGroup);
    }
    groups.push(currentTallyGroup);
  }

  return groups;
}

type ApplyTallyMarkOptions = {
  num: number;
  group: HTMLElement;
}

function applyTallyMark(options: ApplyTallyMarkOptions) {
  const { num, group } = options;
  const tally = createTallyMarkElement({ num });
  group.replaceChildren(tally);
}

type TallyIntervalOptions = {
  max: number;
  interval: number;
}

async function* incrementTally(options: TallyIntervalOptions) {
  const { max, interval } = options;
  for (let count = 0; count < max; count++) {
    const tally = (count % 5) + 1;
    yield { tally, count };
    await sleep(interval);
  }
}

async function* decrementTally(options: TallyIntervalOptions) {
  const { max, interval } = options;
  for (let count = max - 1; count >= 0; count--) {
    const tally = (count % 5) - 1;
    yield { tally, count };
    await sleep(interval);
  }
}

type AppElements = {
  tallyContainer: HTMLElement;
  counterDisplay: HTMLElement;
  counterDisplayHours: HTMLHeadingElement
  reset: HTMLButtonElement;
  canvas: HTMLCanvasElement;
}

type AppOptions = {
  animation: {
    delay: number;
    duration: number;
  }
  elements: AppElements;
}

async function app(options: AppOptions) {
  const { elements, animation } = options;
  
  const lastVacationDate = await getLastVacationDate();
  const totalHours = getHoursSince({ 
    since: lastVacationDate
  });

  const interval = animation.delay / totalHours;

  const updateCount = (count: number) => {
    elements.counterDisplayHours.textContent = `${count} hrs`;
  }
  
  const groups = prepareTallyGroups({ 
    max: totalHours, 
    container: elements.tallyContainer 
  });
  
  await sleep(animation.delay);
  
  for await (const { tally, count } of incrementTally({ max: totalHours, interval })) {
    const group = groups[count];
    applyTallyMark({ num: tally, group });
    updateCount(count);
  }
  
  elements.reset?.addEventListener('click', async () => {
    for await (const { tally, count } of decrementTally({ max: totalHours, interval })) {
      const group = groups[count];
      applyTallyMark({ num: tally, group });
      updateCount(count);
    }
  });
}

function isAppElements(elements: any): elements is AppElements {
  return elements.tallyContainer instanceof HTMLElement &&
    elements.counterDisplay instanceof HTMLElement &&
    elements.counterDisplayHours instanceof HTMLElement &&
    elements.reset instanceof HTMLButtonElement &&
    elements.canvas instanceof HTMLCanvasElement;
}

function getAppElements(): AppElements {
  const elements = {
    tallyContainer: document.getElementById('root'),
    counterDisplay: document.querySelector('.count-body'),
    counterDisplayHours: document.querySelector('.count-body-hours'),
    reset: document.getElementById('btn-reset'),
    canvas: document.getElementById('celebration'),
  }

  if (isAppElements(elements)) {
    return elements;
  }

  throw new Error('Missing required elements');
}

async function main() {
  try {
    const elements = getAppElements();
    await app({ elements });
  } catch (err) {
    console.error('This app is garbage', err);
  }
}

main();