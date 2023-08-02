import {Instrument} from "../../common-leave-me";
import "./InstrumentReelItemIcon.css";

export interface InstrumentReelItemIconProps {
    instrument: Instrument;
}

function InstrumentReelItemIcon({ instrument }: InstrumentReelItemIconProps) {
    return (instrument.category === 'forex')
        ?  (
            <div className="instrument-reel-item-icon instrument-reel-item-icon--pair">
                <img src={`/${instrument.category}/${instrument.pair[0]}.svg`} />
                <img src={`/${instrument.category}/${instrument.pair[1]}.svg`} />
            </div>
        )
        : (
            <div className="instrument-reel-item-icon instrument-reel-item-icon--single">
                <img src={`/${instrument.category}/${instrument.code}.svg`}/>
            </div>
        )
}

export default InstrumentReelItemIcon;