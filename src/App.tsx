import React, { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

function App() {
  const [instant, setInstant] = useState(Temporal.Now.instant());
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [offset, setOffset] = useState(
    Temporal.Now.timeZone().getOffsetNanosecondsFor(Temporal.Now.instant()) /
      1e9
  );
  const [dateTime, setDateTime] = useState(date + time - offset);
  const outString = useRef({
    date: date,
    time: time,
    offset: offset,
    selected: dateTime,
    now: instant.epochSeconds,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setInstant(Temporal.Now.instant());
      setDateTime(date + time - offset);
    });
    return () => clearInterval(interval);
  });

  const handleDatePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDate(evt.target.valueAsNumber / 1000);
  };

  const handleTimePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTime(evt.target.valueAsNumber / 1000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <input type={"date"} onChange={handleDatePicker}></input>
          <input type={"time"} onChange={handleTimePicker}></input>
        </p>
        <pre>{JSON.stringify(outString, null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
