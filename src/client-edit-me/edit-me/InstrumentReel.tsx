/**
 * ☑️ You can edit MOST of this file to add your own styles.
 */

/**
 * ✅ You can add/edit these imports
 */
import {Instrument, InstrumentSymbol} from "../../common-leave-me";
import {InstrumentSocketClient, Subscription} from "./InstrumentSocketClient";
import InstrumentReelItem from "./InstrumentReelItem";
import "./InstrumentReel.css";
import React, {useCallback, useEffect, useRef, useState} from "react";

/**
 * ❌ Please do not edit this
 */
const client = new InstrumentSocketClient();

/**
 * ❌ Please do not edit this hook name & args
 */
function useInstruments(instrumentSymbols: InstrumentSymbol[]) {
  /**
   * ✅ You can edit inside the body of this hook
   */
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  // Генерируем подписочку, сеттер инструментов и будет хэндлером, т.е. будет вызываться когда придут данные с серва
  const subscription: Subscription = {
    symbols: instrumentSymbols,
    handler: setInstruments,
  }

  useEffect(() => client.subscribe(subscription), [...instrumentSymbols]);

  return instruments;
}

export interface InstrumentReelProps {
  instrumentSymbols: InstrumentSymbol[];
}

function InstrumentReel({ instrumentSymbols }: InstrumentReelProps) {
  /**
   * ❌ Please do not edit this
   */
  const instruments = useInstruments(instrumentSymbols);

  /**
   * ✅ You can edit from here down in this component.
   * Please feel free to add more components to this file or other files if you want to.
   */
  const animationRef = useRef<Animation>();
  const reelRef = useRef<HTMLDivElement>(null);

  const nDuplicates = Math.ceil(5 / instruments.length);
  // Параметром 4000 можно регулировать скорость, чем выше значение, тем медленнее
  const duration = instrumentSymbols.length * 4000

  useEffect(() => {
    if (!reelRef.current || !instrumentSymbols.length) {
      return
    }

    animationRef.current?.cancel();
    animationRef.current = reelRef.current.animate(
        [
          { transform: `translateX(0px)` },
          {
            transform: `translateX(-${reelRef.current.clientWidth/2}px)`,
          },
        ],
        {
          duration: duration,
          iterations: Infinity,
          easing: "linear",
        }
    );
  }, [reelRef.current, ...instrumentSymbols]);

  const onMouseEnter = useCallback(() => animationRef.current?.pause(), []);
  const onMouseLeave = useCallback(() => animationRef.current?.play(), []);

  if (!instrumentSymbols.length) {
    return <div className="instrument-reel__container instrument-reel--empty">Unknown instruments</div>;
  }

  if (!instruments.length) {
    return <div className="instrument-reel__container instrument-reel--empty">Loading</div>;
  }

  const reelItems = []
  // повторяем блоки. Грязный хак, чтобы полоска не выглядело пусто при малом кол-ве инструментов
  for (let i = 0; i < nDuplicates; i++) {
    const duplicatedReelItems = instruments.map((instrument) => (
        <InstrumentReelItem key={instrument.code + "-" + i} instrument={instrument} />
    ))
    reelItems.push(...duplicatedReelItems)
  }

  return (
      <div className="instrument-reel__container">
        <div ref={reelRef}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
              className="instrument-reel instrument-reel--animate">
          {reelItems}
        </div>
      </div>
  );
}

export default InstrumentReel;
