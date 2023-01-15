import { createSignal, For, Show, createEffect, createResource, Index } from "solid-js";
import type { Component } from 'solid-js';
import { Card } from './components/Card';
import { COLOR } from './constants/color';
import { TallyMark } from './components/Tally';
import { Confetti } from './components/Confetti';
import { getMostRecentVacationDatetime, resetRecentVacation } from './services/vacation';
import styles from './App.module.css';

const REVEAL_DURATION = 1500;


const App: Component = () => {
  const [ target, updateTarget ] = createResource(getMostRecentVacationDatetime);
  const [ count, setCount ] = createSignal(0);
  
  const celebrate = () => target() === 0;
  const celebrationStarted = () => count() === 0 && celebrate();
  const revealDelay = () => Math.ceil(REVEAL_DURATION / (target() ?? 1));
  const showCard = () => {
    return celebrate() || (
      Math.abs(count() - (target() ?? 0)
    ) * revealDelay() <= 500);
  };

  const reset = () => {
    resetRecentVacation()
      .then(() => {
        updateTarget.mutate(0);
      })
      .catch(err => {
        console.error('error with reset', {err});
        updateTarget.mutate(0);
      })
  }

  createEffect(() => {
    const $body = document.querySelector('body')!;
    $body.style.backgroundColor = celebrationStarted()
      ? COLOR.SUCCESS
      : COLOR.BACKGROUND;
  });

  createEffect(() => {
    const t = target() ?? 0;
    if (count() !== t) {
      setTimeout(() => {
        if (count() < t) {
          return setCount(c => c + 1);
        } else if (count() > t) {
          return setCount(c => c - 1);
        }
      }, revealDelay());
    }
  });

  const tallies = () => {
    if (count() < 0) {
      return [];
    }
    const partitions = Math.floor(count() / 5);
    const extra = count() - (partitions * 5);
    const base = new Array(partitions).fill(5);
    base.push(extra);
    return base;
  }
  
  return (
    <div>
      <div class={styles.tallyContainer}>
        <For each={tallies()}> 
          {(num, i) => {
            return <TallyMark num={num}/>
          }}

        </For>
      </div>
      <Show when={showCard()}>
        <Card 
          count={count}
          celebrate={celebrate}
          onReset={() => reset()}
        />
      </Show>
      <Show when={celebrationStarted()}>
        <Confetti />
      </Show>
    </div>
  );
};

export default App;

