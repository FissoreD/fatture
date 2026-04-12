import { JSX, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { TdC } from "./tools";

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

type printer = (n:number) => JSX.Element

const pp_cspan = (name: string, len: number) => (idx:number) =>
  idx === 0 ? <TdC rowSpan={len} name={name} /> : <></>

export const ppfatt = (pp_cname: printer,pp_dname: printer) => (setter: (f: fatt) => void, f: fatt, index: number) => {
  const setPB = (is_fatt:boolean) => (e: editable<number>) => {
    const fx = {...f}
    if (is_fatt) fx.cnt.fatt[1] = e
    else fx.cnt.bolla[1] = e
    setter(fx)
  }
  return <tr>
    {pp_cname(index)}
    {pp_dname(index)}
    <td>{date2str(f.date.cnt)}</td>
    <td>{pp_edit_nb(f.cnt.fatt[1], setPB(true))}</td>
    <td>{pp_edit_nb(f.cnt.bolla[1], setPB(false))}</td>
  </tr>
}

export const ppditta = (pp_cname: printer) => (setter: ((d: ditta) => void)) => (d: ditta, index: number) => {
  const setterN = (x: editable<string>) => setter({ ...d, name: x })
  const setterF = (idx: number) => (x: fatt) => {
    const cnt = [...d.cnt]
    cnt[idx] = x
    setter({ ...d, cnt })
  }
  return d.cnt.map((f, idx) => ppfatt((e => pp_cname(index+e)), pp_cspan(d.name.cnt, d.cnt.length))(setterF(idx), f, idx))
}

function tot_row (c: cliente) {
  let l = 0
  c.ditte.forEach(d => l += d.cnt.length);
  return l
}

export const ppcliente = (setter: (c: cliente) => void) => (c: cliente, index: number) => {
  const setterD = (idx: number) => (d: ditta) => {
    const dt = [...c.ditte]
    dt[idx] = d
    setter({ ...c, ditte: dt })
  }

  const ppditta_aux = (d:ditta, idx:number) =>
    ppditta(pp_cspan(c.name.cnt, tot_row(c)))(setterD(idx))(d, idx)

  return c.ditte.map(ppditta_aux)
}