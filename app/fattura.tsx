import { Button, Form, Modal, Table } from "react-bootstrap";
import { date, editable, fatt, fatt_line } from "./types";
import { date2str, pp_edit_nb, pp_edit_str } from "./tools";
import { IoCloseCircleSharp } from "react-icons/io5";


const ppfatt_line = (setter: (f: fatt_line) => void, remove: () => void, f: fatt_line, index: number) => {
  const settDescr = (descr: editable<string>) => { setter({ ...f, descr }) }
  const settQta = (qta: editable<string>) => { setter({ ...f, qta }) }
  return <tr key={`${index}`}>
    <td>{pp_edit_str(f.descr, settDescr)}</td>
    <td className="position-relative">{pp_edit_str(f.qta, settQta)}
      <label className="b-0 m-0 p-0 align-middle text-center" style={{ pointerEvents: "auto", cursor: "pointer", position: "absolute", right: 0, top: "-11pt", width: "auto" }} onClick={remove}><IoCloseCircleSharp /></label>
    </td>
  </tr>
}

const ppprezzo = (f: editable<number>, setter: ((a: editable<number>) => void)) =>
  <tr className="fw-bold">
    <td className="text-end">TOT</td>
    <td>{pp_edit_nb(f, setter)}€</td>
  </tr>


export const ppfattura = (setter: (f: fatt) => void, f: fatt) => {
  const setterL = (isbolla: boolean, idx: number) => (x: fatt_line) => {
    const lines = isbolla ? [...f.cnt.bolla.lines] : [...f.cnt.fatt.lines]
    lines[idx] = x
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

  return <Table bordered>
    <thead>
      <tr>
        <th>Prodotto</th>
        <th>Quantità</th>
      </tr>
    </thead>
    <tbody>
      {f.cnt.fatt.lines.map((f, idx) => ppfatt_line(setterL(false,idx), removeL(false, idx), f, idx))}
      {ppprezzo(f.cnt.fatt.total, setterPrice(false))}
      {f.cnt.bolla.lines.map((f, idx) => ppfatt_line(setterL(true,idx), removeL(true, idx), f, idx))}
      {ppprezzo(f.cnt.bolla.total, setterPrice(true))}
    </tbody>
  </Table>
}

export const ppdate = (d: editable<date>, setter: ((d: editable<date>) => void)) => {
  const setEdit = (editing: boolean) => { setter({ ...d, editing }) }
  const setDate = (value: string) => setter({ editing:false, value })
  return d.editing ?
    <Form.Group>
      <Form.Control type="date"
        value={d.value}
        onChange={(e) => setDate(e.target.value)} />
    </Form.Group> :
    <span onClick={() => setEdit(true)}>{new Date(d.value).toLocaleDateString()}</span>
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
