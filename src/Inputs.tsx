import React, { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const Input = ({ children, ...props }: InputProps) => {
  return (
    <>
      <label htmlFor={props.id} className="text-sm">
        {children}
      </label>
      <input {...props} />
    </>
  );
};

export const DateInput = ({ ...props }: InputProps) => {
  return (
    <Input type="date" id="date" {...props}>
      Date
    </Input>
  );
};

export const TimeInput = ({ ...props }: InputProps) => {
  return (
    <Input type="time" id="time" {...props}>
      Time
    </Input>
  );
};

export const SelectInput: React.FC<TimeZoneSelectProps> = ({
  timeZones,
  ...props
}) => {
  const continents = [...new Set(timeZones.map((x) => x.continent))];
  const tzStrings = [...new Set(timeZones.map((x) => x.tzString))];
  return (
    <>
      <label htmlFor={props.id}>{props.children}</label>
      <select {...props}>
        {continents.map((x, i) => (
          <optgroup key={i} label={x}>
            {tzStrings.map((y, j) =>
              y.split("/")[0] === x ? <option key={j}>{y}</option> : null
            )}
          </optgroup>
        ))}
      </select>
    </>
  );
};

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type TimeZones = {
  continent: "America" | "Europe" | "Africa" | "Asia" | "Australia" | string;
  tzString: string;
  offsetSeconds?: number;
};

type TimeZoneSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  timeZones: TimeZones[];
};
