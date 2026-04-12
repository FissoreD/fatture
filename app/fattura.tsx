import { Table } from "react-bootstrap";
import { editable, fatt, fatt_line } from "./types";


export function pp_edit<T extends string | number>(p1: editable<T>, cast: ((s: string) => T), setter: ((a: editable<T>) => void), type: "number" | "text") {
  const editing = p1.editing
  const setEditing = (b: boolean) => {
    console.log("Set editing to", b)
    setter({ ...p1, editing: b })
  }

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


export const ppfattura = (setter: (f: fatt) => void, f: fatt) => {
  // const setterN = (x: editable<string>) => setter({ ...d, name: x })
  const setterL = (isbolla : boolean, idx: number) => (x: fatt_line) => {
    const ft = { ...f }
    isbolla ? ft.cnt.bolla.lines[idx] = x : ft.cnt.fatt.lines[idx] = x
    setter(ft)
  }

  const setterPrice = (isbolla: boolean) => (v: editable<number>) => {
    const ft = { ...f }
    isbolla ? ft.cnt.bolla.total = v : ft.cnt.fatt.total = v
    setter(ft)
  }

  return <Table bordered>
    <thead>
      <tr>
        <th>Prodotto</th>
        <th>Quantità</th>
      </tr>
    </thead>
    <tbody>
      {f.cnt.fatt.lines.map((f, idx) => ppfatt_line(setterL(false,idx))(f, idx))}
      {ppprezzo(f.cnt.fatt.total, setterPrice(false))}
      {f.cnt.bolla.lines.map((f, idx) => ppfatt_line(setterL(true,idx))(f, idx))}
      {ppprezzo(f.cnt.bolla.total, setterPrice(true))}
    </tbody>
  </Table>
}
