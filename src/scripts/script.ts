interface DurationTracker {
  getDuration(): Promise<number>;
  resetDuration: () => Promise<void>;
}

interface CelebrationAnimation {
  start: () => void;
  stop: () => void;
}

type TallyCounterOptions = {
  tally: number;
  count: number;
}

interface TallyCounter {
  set(options: TallyCounterOptions): void;
}

type TallyDisplayOptions = {
  max: number;
}

interface TallyDisplay {
  init(options: TallyDisplayOptions): TallyCounter;
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

class VacationTracker implements DurationTracker {
  private readonly HOUR = 1000 * 60 * 60;
  private lastVacationDate: number;

  constructor() {
    this.lastVacationDate = (this.HOUR * 73);
  }

  private getHoursSince(since: number) {
    const now = Date.now();
    this.lastVacationDate = Math.ceil(Math.max((now - since) / this.HOUR));
    return this.lastVacationDate;
  }

  private async fetchLastVacationDate() {
    return Date.now() - this.lastVacationDate;
  }

  async getDuration() {
    const lastVacationDate = await this.fetchLastVacationDate();
    return this.getHoursSince(lastVacationDate);
  }

  async resetDuration() {
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
  vacationer: DurationTracker;
  tallymark: TallyMarkGenerators;
  celebration: CelebrationAnimation;
  tallyDisplay: TallyDisplay;
}

async function app({
  elements,
  animation,
  tallymark,
  vacationer,
  celebration,
  tallyDisplay,
}: AppOptions) {  
  const totalDuration = await vacationer.getDuration();
  const display = tallyDisplay.init({
    max: totalDuration
  });
  const incrementOptions = {
    max: totalDuration, 
    interval: animation.delay / totalDuration
  };
  
  const decrementOptions = {
    max: totalDuration,
    interval: incrementOptions.interval / 2
  }

  await sleep(animation.delay);
  
  for await (const { tally, count } of tallymark.incrementTally(incrementOptions)) {
    // const group = groups[count];
    display.set({count, tally});
    // tallymark.applyTallyMark({ num: tally, group });
    // totalDisplay.updateTotal(count);
  }
  
  elements.resetButton?.addEventListener('click', async () => {
    for await (const { tally, count } of tallymark.decrementTally(decrementOptions)) {
      // const group = groups[count];
      // tallymark.applyTallyMark({ num: tally, group });
      // totalDisplay.updateTotal(count);
      display.set({count, tally});
    }

    celebration.start();
    await sleep(9_000);

    // totalDisplay.updateTotal(1);
    // tallymark.applyTallyMark({ num: 1, group: groups[0] });
    display.set({count: 1, tally: 1});
    celebration.stop();
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

function createSetCountFn(options: CreateSetCountFnOptions): SetCountFn {
  const { totalDisplay, colors } = options;
  return (count: number) => {
    totalDisplay.style.color = count > 0 
      ? colors.failure 
      : colors.success;
    totalDisplay.textContent = `${count} hrs`;
  }
}

type CreateTallyCounterOptions = {
  groups: HTMLElement[];
  setDisplay: SetCountFn;
  applyTallyMark: TallyMark['applyTallyMark'];
}

function createTallyCounter(options: CreateTallyCounterOptions): TallyCounter {
  const { applyTallyMark, setDisplay, groups } = options;
  return {
    set({ count, tally }) {
      const group = groups[count];
      setDisplay(count);
      applyTallyMark({ num: tally, group });
    }
  }
}

type CreateTallyDisplayOptions = {
  container: HTMLElement;
  tallymark: TallyMark;
  setDisplay: SetCountFn;
}

function createTallyDisplay(options: CreateTallyDisplayOptions): TallyDisplay {
  const { container, setDisplay, tallymark } = options;
  const { applyTallyMark, prepareTallyGroups } = tallymark;
  const groups: HTMLElement[] = [];
  return {
    init(options: TallyDisplayOptions) {
      const { max } = options;
      if (groups.length === 0) {
        groups.push(
          ...prepareTallyGroups({ container, max })
        );
      }

      return createTallyCounter({
        applyTallyMark,
        setDisplay,
        groups,
      });
    }
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
        console.log('Celebration started');
      },
      stop() {
        elements.confettiContainer.style.zIndex = "-1";
        elements.resetButton.style.display = "block";
        elements.confettiContainer.style.display = "none";
        elements.appContainer.style.backgroundColor = colors.background;
        console.log('Celebration stopped');
      }
    }

    const setDisplay = createSetCountFn({
      totalDisplay: elements.totalDisplay,
      colors,
    });

    const tallyDisplay = createTallyDisplay({
      container: elements.tallyContainer,
      tallymark: tallymark,
      setDisplay,
    });

    const animation = {
      delay: 1500, 
      duration: 2000,
    };

    await app({
      elements, 
      tallymark,
      animation,
      vacationer,
      celebration,
      tallyDisplay,
    });

  } catch (err) {
    console.error('This app is garbage', err);
  }
}

main();