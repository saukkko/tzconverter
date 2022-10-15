import "./app.css";
import React, { useEffect, useMemo, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import _ from "lodash";
import { DateInput, TimeInput, DataListInput } from "./Inputs";
import { timeZones } from "./utils/timezones";

const tz = Temporal.Now.timeZone();

function App() {
  const getOffset = (
    fromTz?: Temporal.TimeZone,
    toTz?: Temporal.TimeZoneLike
  ) => {
    if (!fromTz) fromTz = tz;
    if (!toTz) toTz = new Temporal.TimeZone("UTC");

    return (
      fromTz.getOffsetNanosecondsFor(
        Temporal.Now.zonedDateTimeISO(toTz).toInstant()
      ) / 1e9
    );
  };

  const [now, setNow] = useState(Temporal.Now);
  const [compareTz, setCompareTz] = useState(now.timeZone());

  const [date, setDate] = useState(
    now.instant().epochSeconds - (now.instant().epochSeconds % 86400)
  );
  const [time, setTime] = useState(
    now.instant().epochSeconds - date + getOffset(compareTz)
  );
  const dateData = useMemo(() => {
    return {
      currentEpochTime: now.instant().epochSeconds,
      homeTzOffset: getOffset(tz),
      homeTzName: tz.toString(),
      selectedTzOffset: getOffset(compareTz),
      selectedTzName: compareTz.toString(),
      selectedDate: date,
      selectedTime: time,
      selectedEpochTimeISO: Temporal.Instant.fromEpochSeconds(
        date + time - getOffset(compareTz)
      ).toString(),
      selectedEpochTime: date + time - getOffset(compareTz),
    };
  }, [date, time, compareTz]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Temporal.Now);
    });
    return () => clearInterval(interval);
  });

  const nanToZero = (v: number) => (isNaN(v) ? 0 : v);

  const handleDatePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setDate(nanToZero(evt.target.valueAsNumber) / 1000);
  };

  const handleTimePicker = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTime(nanToZero(evt.target.valueAsNumber) / 1000);
  };

  const handleTimeZoneSelect = (evt: React.ChangeEvent<HTMLInputElement>) => {
    timeZones.includes(evt.target.value)
      ? setCompareTz(new Temporal.TimeZone(evt.target.value))
      : setCompareTz(compareTz);
  };

  timeZones.push("UTC");
  const tzData = _.uniqBy(
    _.sortBy(
      timeZones.map((x) => {
        return {
          continent: x.split("/")[0],
          tzString: x,
          offsetSeconds: getOffset(new Temporal.TimeZone(x), "UTC"),
        };
      }),
      ["offsetSeconds", "tzString"]
    ),
    "tzString"
  );
  // .sort((a, b) => a.offsetSeconds - b.offsetSeconds);

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
          <p className="my-1">
            <DateInput
              onChange={handleDatePicker}
              value={Temporal.PlainDate.from(
                Temporal.Instant.fromEpochSeconds(date).toString({
                  timeZone: "UTC",
                })
              ).toString()}
            />
            <TimeInput
              onChange={handleTimePicker}
              value={Temporal.PlainTime.from(
                Temporal.Instant.fromEpochSeconds(time).toString({
                  timeZone: "UTC",
                })
              ).toString({ smallestUnit: "minute" })}
            />
            {/*             <SelectInput
              defaultValue={tz.toString()}
              onChange={handleTimeZoneSelect}
              timeZones={tzData}
              id="tz"
            >
              Timezone
            </SelectInput>
          </p>
          <p className="my-1"> */}
            <DataListInput
              timeZones={tzData}
              now={now}
              inputProps={{
                type: "search",
                id: "zonelist",
                list: "zones",
                defaultValue: tz.toString(),
                onChange: handleTimeZoneSelect,
              }}
              dataListProps={{
                id: "zones",
              }}
            ></DataListInput>
          </p>
        </fieldset>
        <pre>{JSON.stringify(dateData, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
