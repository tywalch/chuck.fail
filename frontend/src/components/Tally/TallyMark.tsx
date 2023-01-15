import styles from './TallyMark.module.css';

import tally1 from './tallymark1.svg';
import tally2 from './tallymark2.svg';
import tally3 from './tallymark3.svg';
import tally4 from './tallymark4.svg';
import tally5 from './tallymark5.svg';

function getTallySource(num: number) {
  switch (num) {
    case 1:
      return tally1;
    case 2:
      return tally2;
    case 3:
      return tally3;
    case 4:
      return tally4;
    case 5:
      return tally5;
    default:
      return null;
  }
}

type TallyProps = {
  num: number;
}

function Tally(options: TallyProps) {
  const source = getTallySource(options.num);
  if (source !== null) {
    return <img 
      src={source} 
      alt={`Tallymark ${options.num}`}
      class={styles.tally}
    />
  }
}

type TallyMarkProps = {
  num: number;
}

export function TallyMark(options: TallyMarkProps) {
  return (
    <div class={styles.tallyGroup}>
      <Tally num={options.num} />
    </div>
  );
}