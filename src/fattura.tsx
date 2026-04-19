import { date, editable, empty_fatt_list, fatt, fatt_line, mk_editable } from "./types";
import { labelAbsolutePosition, pp_edit_nb, pp_edit_str } from "./tools";
import { Button, Form, Modal, Table } from "react-bootstrap";

const ppfatt_line = (setter: (f: fatt_line) => void, remove: () => void, f: fatt_line, index: number) => {
  const settDescr = (descr: editable<string>) => { setter({ ...f, descr }) }
  const settQta = (qta: editable<string>) => { setter({ ...f, qta }) }
  return <tr className="position-relative" key={`${index}`}>
    <td onClick={() => settDescr({ ...f.descr, editing: true })}>{pp_edit_str(f.descr, settDescr)}</td>
    <td onClick={() => settQta({...f.qta, editing:true})}>
      {pp_edit_str(f.qta, settQta)}
    </td>
    {labelAbsolutePosition({ right: 0, top: "-11pt" }, remove, "x")}
  </tr>
}

const ppprezzo = (f: editable<number>, adder: () => void, setter: ((a: editable<number>) => void)) => {
  const setEditTrue = () => {
    setter({...f, editing:true})
  }
  return <tr className="fw-bold">
    <td className="position-relative text-end">
      TOT
      {labelAbsolutePosition({ right: -5, top: -13 }, adder, "+")}
    </td>
    <td onClick={setEditTrue}>
      {pp_edit_nb(f, setter)}€
    </td>
  </tr>
}

export const ppfattura = (setter: (f: fatt) => void, f: fatt) => {
  const clone = (isbolla: boolean, lines: fatt_line[]) => {
    let cnt = { ...f.cnt }
    if (isbolla) cnt.bolla = { ...cnt.bolla, lines }
    else cnt.fatt = { ...cnt.fatt, lines }
    return {...f, cnt}
  }

  const setterL = (isbolla: boolean, idx: number) => (x: fatt_line) => {
    const lines = (isbolla ? f.cnt.bolla.lines : f.cnt.fatt.lines)
            .map((l, i) => i === idx ? x : l)
    setter(clone(isbolla, lines))
  }

  const adder = (isbolla: boolean) => () => {
    const lines = isbolla ? [empty_fatt_list(), ...f.cnt.bolla.lines] : [empty_fatt_list(), ...f.cnt.fatt.lines]
    console.log(lines)
    setter(clone(isbolla, lines))
  }

  const removeL = (isbolla: boolean, idx: number) => () => {
    const lines = (isbolla ? f.cnt.bolla.lines : f.cnt.fatt.lines)
        .filter((_, i) => i !== idx)
    setter(clone(isbolla, lines))
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
        Chiudi
      </Button>
    </Modal.Footer>
  </Modal>;
}
