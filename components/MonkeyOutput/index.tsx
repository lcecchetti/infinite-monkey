'use client';

import { CSSProperties, useContext, useEffect, useRef } from 'react';
import IsMonitorOnContext from "lib/is-monitor-on-context";
import useMonkey, { getMaxLines } from "lib/use-monkey";
import { Quote } from "lib/types";
import styles from 'styles/components/monkey-output.module.scss';

interface MonkeyOutputProps {
  quotes: Quote[];
  literateRatio: number;
  maxEssayLength: number;
}

const MonkeyOutput = ({ quotes, literateRatio, maxEssayLength }: MonkeyOutputProps) => {
  const isMonitorOn = useContext(IsMonitorOnContext);
  const { monkey, wakeUp, sleep } = useMonkey(quotes, literateRatio, maxEssayLength);
  const quoteRef = useRef<HTMLSpanElement>(null);

  // drives the box's fixed height (see height: calc(var(--max-lines) * 1lh)
  // in monkey-output.module.scss) - sizing itself is pure CSS, no measurement
  const maxLines = getMaxLines(maxEssayLength);
  const outputStyle = { '--max-lines': maxLines } as CSSProperties;

  // stop the monkey when the monitor turns off
  useEffect(() => {
    if (!isMonitorOn && monkey.isAwake) {
      sleep();
    }
  }, [isMonitorOn, monkey.isAwake, sleep]);

  const hasText = monkey.essay.length > 0;

  // scroll to the quote as soon as one is found
  const hasQuote = !!monkey.currentQuote;
  useEffect(() => {
    if (hasQuote) {
      quoteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [hasQuote]);

  const firstQuoteIndex = monkey.essay.findIndex((char) => char.isQuote);
  const showMoral = !monkey.isAwake && !!monkey.currentQuote && monkey.currentQuote.quote === '';

  return (
    <div className={styles.monkeyOutput} style={outputStyle}>

      <div className={styles.actions}>
        <button className={styles.awakeButton} onClick={monkey.isAwake ? sleep : wakeUp}>{monkey.isAwake ? 'Stop The Monkey' : 'Execute Monkey Program'}</button>
      </div>

      {/* the typed-out essay is just visual noise for screen readers - the
        meaningful moments (start/stop, a found quote) are announced below */}
      <p className={styles.statusMessage} role="status" aria-live="polite">
        {monkey.isAwake ? 'The monkey started typing.' : hasText ? 'The monkey stopped.' : ''}
      </p>

      {hasText &&
        <div className={styles.monkeyEssay} aria-hidden="true">
          {monkey.essay.map((char, index) => (
            <span
              ref={index === firstQuoteIndex ? quoteRef : undefined}
              className={char.isQuote ? styles.highlight : ''}
              key={index}
            >
              {char.value}
            </span>
          ))}
        </div>
      }

      <div role="status" aria-live="polite">
        {showMoral &&
          <div className={styles.moral}>
            <p>Congratulations, your MONKEY instance did quote {monkey.currentQuote!.work} by {monkey.currentQuote!.author}.</p>
            <p>
              But is that truly unexpected?<br/>
              What about this text? What about this program?<br/>
              And what about yourself?
            </p>
            <p>Isn&apos;t all of this just the latest character typed by this branch of the universe?</p>
            <p>ChAOS reading ChAOS&apos; writings.</p>
          </div>
        }
      </div>

    </div>
  );
};


export default MonkeyOutput;
