import { Button, Form, Modal, Table } from "react-bootstrap";
import { date, editable, fatt, fatt_line } from "./types";
import { date2str, labelAbsolutePosition, mk_editable, pp_edit_nb, pp_edit_str } from "./tools";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { CSSProperties, ReactNode } from "react";

const ppfatt_line = (setter: (f: fatt_line) => void, remove: () => void, f: fatt_line, index: number) => {
  const settDescr = (descr: editable<string>) => { setter({ ...f, descr }) }
  const settQta = (qta: editable<string>) => { setter({ ...f, qta }) }
  return <tr key={`${index}`}>
    <td>{pp_edit_str(f.descr, settDescr)}</td>
    <td className="position-relative">
      {pp_edit_str(f.qta, settQta)}
      {labelAbsolutePosition({ right: 0, top: "-11pt" }, remove, <IoCloseCircleSharp />)}
    </td>
  </tr>
}

const ppprezzo = (f: editable<number>, adder: () => void, setter: ((a: editable<number>) => void)) =>
  <tr className="fw-bold">
    <td className="text-end">TOT</td>
    <td className="position-relative">
      {pp_edit_nb(f, setter)}€
      {labelAbsolutePosition({ left: -10, top: -15 }, adder, <IoMdAddCircle />)}
    </td>
  </tr>

const fatt_list = () : fatt_line => ({descr: mk_editable("xx"), qta: mk_editable("xx")})

export const ppfattura = (setter: (f: fatt) => void, f: fatt) => {
  const setterL = (isbolla: boolean, idx: number) => (x: fatt_line) => {
    const lines = isbolla ? [...f.cnt.bolla.lines] : [...f.cnt.fatt.lines]
    lines[idx] = x
    let cnt = { ...f.cnt }
    if (isbolla) cnt.bolla = { ...cnt.bolla, lines }
    else cnt.fatt = { ...cnt.fatt, lines }
    setter({ ...f, cnt })
  }

  const adder = (isbolla: boolean) => () => {
    const lines = isbolla ? [fatt_list(), ...f.cnt.bolla.lines] : [fatt_list(), ...f.cnt.fatt.lines]
    let cnt = { ...f.cnt }
    if (isbolla) cnt.bolla = { ...cnt.bolla, lines }
    else cnt.fatt = { ...cnt.fatt, lines }
    setter({ ...f, cnt })
  }

  const removeL = (isbolla: boolean, idx: number) => () => {
    const lines = (isbolla ? f.cnt.bolla.lines : f.cnt.fatt.lines)
        .filter((_, i) => i !== idx)

    let cnt = { ...f.cnt }
    if (isbolla) cnt.bolla = { ...cnt.bolla, lines }
    else cnt.fatt = { ...cnt.fatt, lines }
    setter({ ...f, cnt })
  }

  const setterPrice = (isbolla: boolean) => (total: editable<number>) => {
    let cnt = { ...f.cnt }
    if (isbolla) cnt.bolla = { ...cnt.bolla, total }
    else cnt.fatt = { ...cnt.fatt, total }
    setter({ ...f, cnt })
  }

  const mapper = (b:boolean) => (f: fatt_line, i: number) => ppfatt_line(setterL(b, i), removeL(b, i), f, i)

  return <Table bordered>
    <thead>
      <tr>
        <th>Prodotto</th>
        <th>Quantità</th>
      </tr>
    </thead>
    <tbody>
      {f.cnt.fatt.lines.map(mapper(false))}
      {ppprezzo(f.cnt.fatt.total, adder(false), setterPrice(false))}
      {f.cnt.bolla.lines.map(mapper(true))}
      {ppprezzo(f.cnt.bolla.total, adder(true), setterPrice(true))}
    </tbody>
  </Table>
}

export const ppdate = (d: editable<date>, setter: ((d: editable<date>) => void)) => {
  const setEdit = (editing: boolean) => () => { setter({ ...d, editing }) }
  const setDate = (value: string) => setter({ editing:false, value })
  return d.editing ?
    <Form.Group>
      <Form.Control type="date"
        value={d.value}
        onChange={(e) => setDate(e.target.value)} />
    </Form.Group> :
    <span onClick={setEdit(true)}>{new Date(d.value).toLocaleDateString()}</span>
}

export const zoomffatt = (setter: (f: fatt) => void, f: fatt, setZoom: (b: boolean) => void) => {
  let setDate = (date: editable<date>) => {
    setter({...f, date})
  }
  let handleClose = () => setZoom(false)
  return <Modal show={f.zoom} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Fattura del {ppdate(f.date, setDate)} </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {ppfattura(setter, f)}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>;
}
