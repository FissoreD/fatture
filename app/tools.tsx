import { date, editable } from "./types";

type TdCenter = { name: string; rowSpan?: number };

export const TdC: React.FC<TdCenter> = ({ name, rowSpan }) => {
  return <td rowSpan={rowSpan || 1} className="align-middle text-center">{name}</td>;
};

export const TdH: React.FC<TdCenter> = ({ name }) => {
  return <th className="align-middle text-center">{name}</th>;
};

export function pp_edit<T extends string | number>(p1: editable<T>, cast: ((s: string) => T), setter: ((a: editable<T>) => void), type: "number" | "text") {
  const editing = p1.editing
  const setEditing = (b: boolean) => { setter({ ...p1, editing: b }) }

  const p = p1.value
  const setData = (b: T) => { setter({ ...p1, value: b }) }

  const exit = () => { setEditing(false) }

  return <> {editing ? (
    <input
      autoFocus
      type={type}
      value={p}
      onChange={(e) => setData(cast(e.target.value))}
      onBlur={exit}
      onKeyDown={(e) => e.key === "Enter" && exit()}
      className="form-control"
    />
  ) : (
    <span onClick={() => setEditing(true)} style={{ cursor: "pointer" }}>
      {p}
    </span>
  )} </>
}

export function pp_edit_nb(p1: editable<number>, setter: ((a: editable<number>) => void)) {
  return pp_edit(p1, parseFloat, setter, "number")
}

export function pp_edit_str(p1: editable<string>, setter: ((a: editable<string>) => void)) {
  return pp_edit(p1, e => e, setter, "text")
}

export const date2str = (d: date) => `${d.d}/${d.m}/${d.y}`

export function mk_editable<T>(x:T) : editable<T> {
  return { editing: false, value:x}
}
