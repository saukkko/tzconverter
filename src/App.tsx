import React, { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

function App() {
  const [instant, setInstant] = useState(Temporal.Now.instant());
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const offsetSeconds = useRef(
    Temporal.Now.timeZone().getOffsetNanosecondsFor(Temporal.Now.instant()) /
      1e9
  );
  const [dateTime, setDateTime] = useState(date + time - offsetSeconds.current);

  useEffect(() => {
    const interval = setInterval(() => {
      setInstant(Temporal.Now.instant());
      setDateTime(date + time - offsetSeconds.current);
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
        <pre>
          date: {date}
          <br />
          time: {time}
          <br />
          sel: {dateTime}
          <br />
          cur: {instant.epochSeconds}
        </pre>
      </header>
    </div>
  );
}

export default App;
