import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

type TdCenter = { name: string; rowSpan?: number };

const TdC: React.FC<TdCenter> = ({ name, rowSpan }) => {
  return <td rowSpan={rowSpan || 1} className="align-middle text-center">{name}</td>;
};

export type editable<T> = { editing: boolean, cnt: T }

export type pair<T> = { fatt: T, bolla: T }
export type fatt_line = { descr: editable<string>; qta: editable<string> }
export type date = { d: number; m: number; y: number }

export type fatt = { id: number; date: editable<date>; cnt: pair<[fatt_line[], editable<number>]> }

export type ditta = { name: editable<string>; cnt: fatt[] }
export type cliente = { name: editable<string>; ditte: ditta[] }

const date2str = (d:date) => `${d.d}/${d.m}/${d.y}`

export function pp_edit<T extends string | number>(p1: editable<T>, cast: ((s: string) => T), setter: ((a: editable<T>) => void), type: "number" | "text") {
  const editing = p1.editing
  const setEditing = (b: boolean) => { setter({ ...p1, editing: b }) }

  const p = p1.cnt
  const setData = (b: T) => { setter({ ...p1, cnt: b }) }

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



const ppfatt_line = (setter: (f: fatt_line) => void) => (f: fatt_line, index: number) => {
  const settDescr = (descr: editable<string>) => { setter({ ...f, descr }) }
  const settQta = (qta: editable<string>) => { setter({ ...f, qta }) }
  return <tr key={`${index}`}>
    <td>{pp_edit_str(f.descr, settDescr)}</td>
    <td>{pp_edit_str(f.qta, settQta)} </td>
  </tr>
}

export const ppfatt = (name: string, len:number) => (setter: (f: fatt) => void, f: fatt, index: number) => {
  const setPB = (is_fatt:boolean) => (e: editable<number>) => {
    const fx = {...f}
    if (is_fatt) fx.cnt.fatt[1] = e
    else fx.cnt.bolla[1] = e
    setter(fx)
  }
  return <tr>
    {index === 0 ? <TdC rowSpan={len} name={name} /> : <></>}
    <td>{date2str(f.date.cnt)}</td>
    <td>{pp_edit_nb(f.cnt.fatt[1], setPB(true))}</td>
    <td>{pp_edit_nb(f.cnt.bolla[1], setPB(false))}</td>
  </tr>
}

export const ppditta = (setter: ((d: ditta) => void)) => (d: ditta, index: number) => {
  const setterN = (x: editable<string>) => setter({ ...d, name: x })
  const setterF = (idx: number) => (x: fatt) => {
    const cnt = [...d.cnt]
    cnt[idx] = x
    setter({ ...d, cnt })
  }
  return <Table bordered key={`${index}`}>
    <thead>
      <tr>
        <th>Ditta</th>
        <th>Data</th>
        <th>Fattura</th>
        <th>Bolla</th>
      </tr>
    </thead>
    <tbody>
      {d.cnt.map((f, idx) => ppfatt(d.name.cnt,d.cnt.length)(setterF(idx),f, idx))}
    </tbody>
  </Table>
}

export const ppcliente = (setter: (c: cliente) => void) => (c: cliente, index: number) => {
  const setterD = (idx: number) => (d: ditta) => {
    const dt = [...c.ditte]
    dt[idx] = d
    setter({ ...c, ditte: dt })
  }
  return <tr key={`${index}`}>
    <td className="align-middle text-center">{c.name.cnt}</td>
    <td>{c.ditte.map((d, idx) => ppditta(setterD(idx))(d, idx))}</td>
  </tr>
}