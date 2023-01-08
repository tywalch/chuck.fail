interface DurationTracker {
  getDuration(): Promise<number>;
  resetDuration(): Promise<void>;
}

interface CelebrationAnimation {
  start: () => void;
  stop: () => void;
}

type TallyTrackerOptions = {
  tally: number;
  count: number;
}

interface TallyTracker {
  get(): number;
  set(options: TallyTrackerOptions): void;
}

type SetCountFn = (count: number) => void;

async function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomColor(colors: string[]) {
  let index = getRandomNumber(0, colors.length - 1);
  return colors[index];
}

const vacationEndpoint = `${window.location.href}.netlify/functions/vacation`;

function getMostRecentVacationDatetime(): Promise<number> {
  return fetch(vacationEndpoint)
      .then(resp => resp.json())
      .then(payload => {
        return payload.data.datetime ?? Date.now();
      })
      .catch(console.log);
}

async function resetRecentVacation() {
  await fetch(vacationEndpoint, { method: 'POST' })
    .then(resp => resp.json())
    .then(payload => {
      if (!payload.success) {
        throw new Error(`Failed to get latest vacation day: ${payload.message}`);
      }
    })
    .catch(console.log);
}

class VacationTracker implements DurationTracker {
  private readonly HOUR = 1000 * 60 * 60;
  private lastVacationDate: number | undefined;

  private getHoursSince(since: number) {
    const now = Date.now();
    return Math.ceil(Math.max((now - since) / this.HOUR));
  }

  private async fetchLastVacationDate() {
    const lastVacationDate = this.lastVacationDate ?? await getMostRecentVacationDatetime();
    this.lastVacationDate = lastVacationDate;
    return lastVacationDate;
  }

  async getDuration() {
    const lastVacationDate = await this.fetchLastVacationDate();
    return this.getHoursSince(lastVacationDate);
  }

  async resetDuration() {
    await resetRecentVacation();
    this.lastVacationDate = Date.now();
  }
}

function createVacationTracker() {
  return new VacationTracker();
}

function createTallyMark() {
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
    container: HTMLElement;
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

  type DecrementTallyOptions = {
    current: number;
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

  async function* decrementTally(options: DecrementTallyOptions) {
    const { current, interval } = options;
    for (let count = current - 1; count >= 0; count--) {
      const tally = (count % 5) - 1;
      yield { tally, count };
      await sleep(interval);
    }
  }

  return {
    applyTallyMark,
    incrementTally,
    decrementTally,
    prepareTallyGroups,
  }
}

type TallyMark = ReturnType<typeof createTallyMark>;
type TallyMarkGenerators = Pick<TallyMark, 'decrementTally' | 'incrementTally'>;

type AppElements = {
  appContainer: HTMLElement;
  tallyContainer: HTMLElement;
  totalContainer: HTMLElement;
  totalDisplay: HTMLHeadingElement
  confettiContainer: HTMLElement;
  resetButton: HTMLButtonElement;
}

type AppAnimationOptions = {
  delay: number;
  duration: number;
}

type AppOptions = {
  animation: AppAnimationOptions;
  elements: AppElements;
  tallymark: TallyMarkGenerators;
  celebration: CelebrationAnimation;
  tallyCounter: TallyTracker;
  initialDuration: number;
  resetDuration: () => Promise<void>;
}

async function app({
  elements,
  animation,
  tallymark,
  celebration,
  tallyCounter,
  resetDuration,
  initialDuration,
}: AppOptions) {  
  const incrementOptions = {
    max: initialDuration, 
    interval: animation.delay / initialDuration
  };

  await sleep(animation.delay);
  
  for await (const { tally, count } of tallymark.incrementTally(incrementOptions)) {
    tallyCounter.set({ count, tally });
  }

  if (tallyCounter.get() === 0) {
    celebration.start();
  }
  
  elements.resetButton?.addEventListener('click', async () => {
    const current = tallyCounter.get();
    const interval = incrementOptions.interval / 2;
    for await (const { tally, count } of tallymark.decrementTally({ current, interval })) {
      tallyCounter.set({count, tally});
    }

    celebration.start();
    await resetDuration();
  });
}

function isAppElements(elements: any): elements is AppElements {
  return elements.tallyContainer instanceof HTMLElement &&
    elements.totalContainer instanceof HTMLElement &&
    elements.totalDisplay instanceof HTMLElement &&
    elements.resetButton instanceof HTMLButtonElement &&
    elements.confettiContainer instanceof HTMLElement &&
    elements.appContainer instanceof HTMLElement;
}

function getAppElements(): AppElements {
  const elements = {
    tallyContainer: document.getElementById('root'),
    totalContainer: document.querySelector('.count-body'),
    totalDisplay: document.querySelector('.count-body-hours'),
    resetButton: document.getElementById('btn-reset'),
    confettiContainer: document.getElementsByClassName('confetti-container')[0],
    appContainer: document.getElementsByTagName('body')[0],
  }

  if (isAppElements(elements)) {
    return elements;
  }

  throw new Error('Missing required elements');
}

type CreateSetCountFnOptions = {
  totalDisplay: HTMLElement;
  colors: {
    success: string;
    failure: string;
  }
}

function createSetDisplayCountFn(options: CreateSetCountFnOptions): SetCountFn {
  const { totalDisplay, colors } = options;
  return (count: number) => {
    totalDisplay.style.color = count > 0 
      ? colors.failure 
      : colors.success;
    totalDisplay.textContent = `${count} hrs`;
  }
}

type CreateTallyTrackerOptions = {
  groups: HTMLElement[];
  setDisplayTextCount: SetCountFn;
  applyTallyMarkCount: TallyMark['applyTallyMark'];
}

function createTallyTracker(options: CreateTallyTrackerOptions): TallyTracker {
  const { 
    groups,
    applyTallyMarkCount, 
    setDisplayTextCount, 
  } = options;
  let current = 0;
  return {
    set({ count, tally }) {
      current = count;
      const group = groups[count];
      setDisplayTextCount(count);
      applyTallyMarkCount({ num: tally, group });
    },
    get() {
      return current;
    },
  }
}

async function main() {
  try {
    const elements = getAppElements();
    const vacationer = createVacationTracker();
    const tallymark = createTallyMark();

    const colors = {
      success: "#4caf50",
      failure: "#f44336",
      background: "#111111fa",
    }
    
    const celebration: CelebrationAnimation = {
      start() {
        elements.confettiContainer.style.zIndex = "1000";
        elements.resetButton.style.display = "none";
        elements.confettiContainer.style.display = "block";
        elements.appContainer.style.backgroundColor = colors.success;
      },
      stop() {
        elements.confettiContainer.style.zIndex = "-1";
        elements.resetButton.style.display = "block";
        elements.confettiContainer.style.display = "none";
        elements.appContainer.style.backgroundColor = colors.background;
      }
    }

    const initialDuration = await vacationer.getDuration();
    const resetDuration = () => vacationer.resetDuration();

    const setDisplayCount = createSetDisplayCountFn({
      totalDisplay: elements.totalDisplay,
      colors,
    });

    const groups = tallymark.prepareTallyGroups({
      container: elements.tallyContainer,
      max: initialDuration,
    });

    const tallyCounter = createTallyTracker({
      applyTallyMarkCount: tallymark.applyTallyMark,
      setDisplayTextCount: setDisplayCount,
      groups,
    });

    const animation = {
      delay: 1500, 
      duration: 2000,
    };

    await app({
      elements, 
      tallymark,
      animation,
      celebration,
      tallyCounter,
      resetDuration,
      initialDuration,
    });

  } catch (err) {
    console.error('This app is garbage', err);
  }
}

main();