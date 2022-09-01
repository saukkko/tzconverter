import "./app.css";
import React, { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { DateInput, TimeInput, SelectInput } from "./Inputs";

function App() {
  const tzToOffsetSeconds = (tz: Temporal.TimeZone) =>
    tz.getOffsetNanosecondsFor(now.instant()) / 1e9;

  const [now, setNow] = useState(Temporal.Now);
  const [date, setDate] = useState(0);
  const [time, setTime] = useState(0);
  const [tz, setTz] = useState<Temporal.TimeZone>(now.timeZone());
  const [offset, setOffset] = useState(tzToOffsetSeconds(tz));
  const [dateTime, setDateTime] = useState(date + time - offset);
  const dateData = useMemo(() => {
    return {
      date: date,
      time: time,
      tzOffset: offset,
      tzName: tz.toString(),
      epochTimeISO: Temporal.Instant.fromEpochSeconds(dateTime).toString(),
      epochTime: dateTime,
    };
  }, [dateTime, tz, offset]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Temporal.Now);
      setOffset(tzToOffsetSeconds(tz));
      setDateTime(date + time - offset);
    });
    return () => clearInterval(interval);
  });

  const timeZones = [
    "UTC",
    "Africa/Algiers",
    "Africa/El_Aaiun",
    "Africa/Tripoli",
    "Europe/Helsinki",
    "Europe/London",
    "America/Los_Angeles",
    "America/Phoenix",
    "America/New_York",
    "Asia/Tokyo",
    "Australia/Sydney",
    "Africa/Cairo",
  ];

  const handleDatePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDate(evt.target.valueAsNumber / 1000);
  };

  const handleTimePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTime(evt.target.valueAsNumber / 1000);
  };

  const handleTimeZoneSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setTz(new Temporal.TimeZone(evt.target.value));
  };

  const tzData = timeZones
    .map((x) => {
      return {
        continent: x.split("/")[0],
        tzString: x,
        offsetSeconds: tzToOffsetSeconds(new Temporal.TimeZone(x)),
      };
    })
    .sort((a, b) => a.offsetSeconds - b.offsetSeconds);

  return (
    <div className="md:container md:mx-auto p-2">
      <h1 className="text-2xl font-semibold">Hi!</h1>
      <p>
        This app will eventually convert some timezones and display{" "}
        <span className="line-through">interesting</span> useless data about it.
        But for now it just lists stuff.
      </p>
      <div className="my-2">
        <fieldset className="rounded border-slate-900 border-2 p-2">
          <legend className="mx-5 px-1 text-sm">
            Local time (your computer)
          </legend>
          <p>
            <DateInput onChange={handleDatePicker} />
            <TimeInput onChange={handleTimePicker} />
            <SelectInput
              onChange={handleTimeZoneSelect}
              timeZones={tzData}
              id="tz"
            >
              Timezone
            </SelectInput>
          </p>
        </fieldset>
        <pre>{JSON.stringify(dateData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
