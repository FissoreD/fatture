import { JSX, ReactNode } from "react";
import { cliente, date, ditta, editable, empty_ditta, empty_fatt, fatt, fatt_bolla, fatt_cnt } from "./types";
import { Col, Container, Row } from "react-bootstrap";
import { date2str, labelAbsolutePosition, pp_edit_str } from "./tools";
import { zoomffatt } from "./fattura";

const pp_floating = (name: editable<string>, setter: (x: editable<string>) => void, cnt: ReactNode, key: number, adder: () => void, remove: () => void) => {
  return (
    <div className="mb-2 form-floating" key={key}>
      <div className="form-control" style={{ minHeight: "58px", height: "auto" }} >{cnt}</div>
      <label style={{ right: "50%", left: "unset", pointerEvents: "auto", cursor: "pointer", height:"auto" }} onClick={adder}>+</label>
      <label style={{ pointerEvents: "auto", right: "0%", left: "unset", height: "auto" }} onClick={remove}>x</label>
      <label style={{ pointerEvents: "auto", height: "auto" }} onClick={() => setter({...name, editing:true}) }>{pp_edit_str(name,setter)}</label>
    </div>
  )
}
  
export const ppfatt = (setter: (f: fatt) => void, remove:(n:number) => void, f: fatt, index: number) => {
  const setterZ = (zoom:boolean) => setter({ ...f, zoom })

  return <Row key={index} className="border rounded p-1 position-relative">
    {zoomffatt(setter,f, setterZ)}
    <Col style={{ cursor: "pointer" }} onClick={() => setterZ(!f.zoom)}>{date2str(f.date.value)}</Col>
    <Col style={{ cursor: "pointer" }} onClick={() => setterZ(!f.zoom)}>{f.cnt.fatt.total.value} €</Col>
    <Col style={{ cursor: "pointer" }} onClick={() => setterZ(!f.zoom)}>{f.cnt.bolla.total.value} €</Col>
    {labelAbsolutePosition({ right: 0, top: "-5pt" }, () => remove(f.id), "x")}
  </Row>
}

export const ppditta = (setter: ((d: ditta) => void), removeD: () => void) => (d: ditta, index: number)  : JSX.Element => {
  const setterF = (idx: number) => (x: fatt) => {
    const cnt = [...d.cnt]
    cnt[idx] = x
    setter({ ...d, cnt })
  }
  const removeF = (id: number) =>
    setter({ ...d, cnt: d.cnt.filter(e => e.id !== id) })

  const addF = () => setter({ ...d, cnt: [empty_fatt(), ...d.cnt] })

  const setterDName = (name: editable<string>) => setter({ ...d, name })

  let cnt = (
    <Container>
      <Row className="border rounded p-1 position-relative">
        <Col>Data</Col>
        <Col>Fattura</Col>
        <Col>Bolla</Col>
      </Row>
      {d.cnt.map((f, idx) => ppfatt(setterF(idx), removeF, f, idx))}
    </Container>
  )
  return pp_floating(d.name, setterDName, cnt, index, addF, removeD)
}

export const ppcliente = (removeC: () => void, setter: (c: cliente) => void, c: cliente, index: number) => {
  const setterD = (idx: number) => (d: ditta) => {
    const dt = [...c.ditte]
    dt[idx] = d
    setter({ ...c, ditte: dt })
  }

  const removeD = (idx: number) => () =>  
    setter({ ...c, ditte: c.ditte.filter((_, id) => id !== idx) })

  const ppditta_aux = (d: ditta, idx: number) : JSX.Element => {
    return ppditta(setterD(idx), removeD(idx))(d, idx)
  }

  const addC = () => setter({ ...c, ditte: [empty_ditta(), ...c.ditte] })

  const setterDName = (name: editable<string>) => setter({...c, name})

  return pp_floating(c.name, setterDName, c.ditte.map(ppditta_aux), index, addC, removeC)
}