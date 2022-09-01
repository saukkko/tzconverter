import React, { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";

function App() {
  const [now, setNow] = useState(Temporal.Now);
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [offset, setOffset] = useState(
    now.timeZone().getOffsetNanosecondsFor(now.instant()) / 1e9
  );
  const [dateTime, setDateTime] = useState(date + time - offset);
  const dateData = useMemo(() => {
    return {
      date: date,
      time: time,
      tzOffset: offset,
      tzName: now.timeZone().toString(),
      timestamp: dateTime,
      timestampISO: Temporal.Instant.fromEpochSeconds(dateTime).toString(),
    };
  }, [dateTime, now]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Temporal.Now);
      setOffset(now.timeZone().getOffsetNanosecondsFor(now.instant()) / 1e9);
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
        <pre>{JSON.stringify(dateData, null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
