import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";

type TdCenter = { name: string; };

const TdC: React.FC<TdCenter> = ({ name }) => {
  return <td className="align-middle text-center">{name}</td>;
};

export type editable<T> = { editing: boolean, cnt: T }

export type pair<T> = { fatt: T, bolla: T }
export type fatt_line = { descr: editable<string>; qta: editable<string> }
export type date = { d: number; m: number; y: number }
export type fatt = { id: number; date: editable<date>; cnt: pair<[fatt_line[], editable<number>]> }

export type ditta = { name: editable<string>; cnt: fatt[] }
export type cliente = { name: editable<string>; ditte: ditta[] }

// export function ppair<T extends string | number>(p: pair<T>) {
//   return <Container><Row>
//     <Col> {p.bolla} </Col>
//     <Col> {p.bolla} </Col>
//   </Row></Container>
// }

export function pp_edit<T extends string | number>(p1: editable<T>, cast: ((s: string) => T), setter: ((a: editable<T>) => void), type: "number" | "text") {
  // const [editing, setEditing] = useState(false);
  // const [p, setData] = useState(p1);
  // const editing = false
  // const setEditing = (x: any) => { return }
  // const p = p1
  // const setData = (x: any) => { return }

  // if (!editing || !p) {return <>ERROR</>}

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

const ppprezzo = (f: editable<number>, setter: ((a: editable<number>) => void)) =>
  <tr className="fw-bold">
    <td className="text-end">TOT</td>
    <td>{pp_edit_nb(f, setter)}€</td>
  </tr>


export const ppfatt = (setter: (f: fatt) => void) => (f: fatt, index: number) => {
  // const setterN = (x: editable<string>) => setter({ ...d, name: x })
  const setterL = (idx: number) => (x: fatt_line) => {
    const ft = { ...f }
    ft.cnt.fatt[0][idx] = x
    setter(ft)
  }

  const setterB = (idx: number) => (x: fatt_line) => {
    const ft = { ...f }
    ft.cnt.bolla[0][idx] = x
    setter(ft)
  }

  return <Table key={`${index}`} bordered>
    <thead>
      <tr>
        <th>Prodotto</th>
        <th>Quantità</th>
      </tr>
    </thead>
    <tbody>
      {f.cnt.fatt[0].map((f, idx) => ppfatt_line(setterL(idx))(f, idx))}
      {ppprezzo(f.cnt.fatt[1], e => f.cnt.fatt[1] = e)}
      {f.cnt.bolla[0].map((f, idx) => ppfatt_line(setterB(idx))(f, idx))}
      {ppprezzo(f.cnt.bolla[1], e => f.cnt.bolla[1] = e)}
    </tbody>
  </Table>
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
        <th>Content</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        {/* <TdC name={d.name} /> */}
        <td>{pp_edit_str(d.name, setterN)}</td>
        <td>{d.cnt.map((f, idx) => ppfatt(setterF(idx))(f, idx))}</td>
      </tr>
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