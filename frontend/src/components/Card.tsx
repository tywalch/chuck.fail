import { COLOR } from '../constants/color';

import styles from './Card.module.css';

function $(...classNames: string[]) {
  return classNames.reduce<{[name: string]: boolean}>((acc, curr) => {
    acc[curr] = true;
    return acc;
  }, {});
}

type CardProps = {
  count: () => number;
  onReset: () => void;
  celebrate: () => boolean;
}

export function Card(props: CardProps) {
  const { count, onReset, celebrate } = props;
  
  const containerClassList = () => {
    return {
      [styles.cardCenter]: count() !== 0 || celebrate(),
      [styles.hidden]: count() === 0 && !celebrate(),
      [styles.rattle]: count() > 0 && !celebrate(),
    }
  }

  const cardClassList = () => {
    return {
      [styles.card]: count() > 0 || celebrate(),
      [styles.countDisplay]: count() > 0 || celebrate(),
      [styles.slam]: count() > 0 && !celebrate(),
      [styles.hidden]: count() === 0 && !celebrate(),
    }
  }

  const cardBodyClassList = () => {
    return {
      ...$(styles.cardBody, styles.countBody),
      [styles.countSuccess]: celebrate(), // count() === 0 && celebrate(),
      [styles.countFail]: !celebrate() // count() !== 0 || !celebrate()
    }
  }

  const cardHeaderClassList = () => {
    return {
      ...$(styles.cardTitle, styles.countHeader),
      [styles.countSuccess]: celebrate(), // count() === 0 && celebrate(),
      [styles.countFail]: !celebrate() // count() !== 0 || !celebrate()
    }
  }

  const footerClassList = () => {
    return {
      [styles.cardFooter]: count() > 0 || celebrate(),
      [styles.countAction]: count() > 0 || celebrate(),
      [styles.hidden]: celebrate(), // count() === 0 && celebrate(),
    }
  }

  return (
    <div classList={containerClassList()}>
      <div classList={cardClassList()}>
        <div classList={cardHeaderClassList()}>
          <h1>Chuck.{celebrate() ? 'Success' : 'Fail'}</h1>
          <p>Charlie is literally such a fuck up he can't even figure out how vacation days work. If you're so great at code, why are you so scared of not coding, Bro?</p>
        </div>  
        <div classList={cardBodyClassList()}>
          <h2 
            class={styles.countBodyHours}
            style={{ color: count() === 0 && celebrate() ? COLOR.SUCCESS : COLOR.FAILURE }}
          >{ count() } {count() === 1 ? 'hr' : 'hrs'}</h2>
          <p class={styles.countBodyDescription}>Work-hours since he has taken a day off</p>
        </div>
        <div classList={footerClassList()}>
          <button onClick={() => onReset()} class={styles.countActionButton}>Reset</button>
        </div>
      </div>
    </div>
  )
}