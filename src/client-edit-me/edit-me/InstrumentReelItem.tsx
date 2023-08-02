import {Instrument} from "../../common-leave-me";
import {useEffect, useRef} from "react";
import "./InstrumentReelItem.css";
import InstrumentReelItemIcon from "./InstrumentReelItemIcon";

export interface InstrumentReelItemProps {
    instrument: Instrument;
}

function InstrumentReelItem({ instrument }: InstrumentReelItemProps) {
    const isForex = instrument.category === 'forex'
    const prevQuoteRef = useRef(instrument.lastQuote);
    const nDigits = isForex ? 2 : 1;
    const lastQuote = instrument.lastQuote.toFixed(nDigits);
    const priceDiff = instrument.lastQuote - prevQuoteRef.current;
    const relPriceDiff = (priceDiff / prevQuoteRef.current) * 100;
    const priceSign = relPriceDiff >= 0 ? "+" : "-";
    const strRelPriceDiff = Math.abs(relPriceDiff).toFixed(3);
    const priceStateClassName = instrument.lastQuote > prevQuoteRef.current
        ? 'instrument-reel-item__price--up'
        : (instrument.lastQuote < prevQuoteRef.current ? 'instrument-reel-item__price--down' : '');

    useEffect(() => {
        prevQuoteRef.current = instrument.lastQuote;
    }, [instrument.lastQuote]);

    return (
        <div className="instrument-reel-item">
            <InstrumentReelItemIcon key={instrument.code} instrument={instrument} />
            <div className="instrument-reel-item__name">{instrument.name}</div>
            <div className={`instrument-reel-item__price ${priceStateClassName}`}>{lastQuote}</div>
            <div className={`instrument-reel-item__price ${priceStateClassName}`}>
                <span>{priceSign}</span>{strRelPriceDiff}<span>%</span>
            </div>
        </div>
    );
}

export default InstrumentReelItem;