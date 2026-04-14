import { JSX, ReactNode } from "react";
import { date2str, labelAbsolutePosition, mk_editable } from "./tools";
import { zoomffatt } from "./fattura";
import { cliente, date, ditta, editable, fatt, fatt_bolla, fatt_cnt } from "./types";
import { IoCloseCircleSharp } from "react-icons/io5";
import { Col, Container, FloatingLabel, Row } from "react-bootstrap";
import { IoMdAddCircle } from "react-icons/io";

const pp_floating = (name: string, cnt: ReactNode, key?: number, add?:ReactNode) =>
  <FloatingLabel className="mb-2" key={key} label={name} >
    <div
      className={`form-control`}
      style={{ minHeight: "58px", height: "auto" }}
    >
      {cnt}
    </div>
    {add ? <label style={{ right: "50%", left: "unset" }}>{add}</label> : <></>}
  </FloatingLabel>

export const ppfatt = (setter: (f: fatt) => void, remove:(n:number) => void, f: fatt, index: number) => {
  const setterF = (isbolla:boolean) => (total: editable<number>) => {
    // let cnt = { ...f.cnt }
    // if (isbolla) cnt.bolla = { ...cnt.bolla, total }
    // else cnt.fatt = { ...cnt.fatt, total }
    // setter({ ...f, cnt })
  }
  const setterZ = (zoom:boolean) =>{
    const fx = { ...f, zoom }
    setter(fx)
  }

  return <Row key={index}>
    {zoomffatt(setter,f, setterZ)}
    <Col>
      <Container className="border rounded p-1 m-1 position-relative">
        <Row style={{ cursor: "pointer" }} onClick={() => setterZ(!f.zoom)}>
          <Col>{date2str(f.date.value)}</Col>
          <Col>{f.cnt.fatt.total.value}</Col>
          <Col>{f.cnt.bolla.total.value}</Col>
        </Row>
        {labelAbsolutePosition({ right: 0, top: "-50%" }, () => remove(f.id), <IoCloseCircleSharp />)}
      </Container>
    </Col>
  </Row>
}

const empty_fatt_cnt = () : fatt_cnt => ({lines: [], total: mk_editable(0)})
const empty_fatt_bolla = (): fatt_bolla => ({ fatt: empty_fatt_cnt(), bolla: empty_fatt_cnt() })
const now_date = (): editable<date> => {
  let n = new Date(Date.now())
  return mk_editable(n.toDateString())
}
const empty_fatt = (): fatt => ({ cnt: empty_fatt_bolla(), date: now_date(), id: Date.now(), zoom: false })

const add_fatt = (adder: (v: void) => void) => <IoMdAddCircle style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={e => adder()} />

export const ppditta = (setter: ((d: ditta) => void)) => (d: ditta, index: number)  : JSX.Element => {
  const setterF = (idx: number) => (x: fatt) => {
    const cnt = [...d.cnt]
    cnt[idx] = x
    setter({ ...d, cnt })
  }
  const removeF = (id: number) => {
    const cnt = d.cnt.filter(e => e.id !== id)
    setter({ ...d, cnt })

  }
  const addF = () => {
    const cnt = [empty_fatt(), ...d.cnt]
    console.log("Old length is", d.cnt.length, "New length is", cnt.length)
    setter({ ...d, cnt })
  }
  let cnt = (
      <Container> {d.cnt.map((f, idx) => ppfatt(setterF(idx), removeF, f, idx))} </Container>
  )
  return pp_floating(d.name.value, cnt, index, add_fatt(addF))
}

export const ppcliente = (setter: (c: cliente) => void, c: cliente, index: number) => {
  const setterD = (idx: number) => (d: ditta) => {
    const dt = [...c.ditte]
    dt[idx] = d
    setter({ ...c, ditte: dt })
  }

  const ppditta_aux = (d: ditta, idx: number) : JSX.Element => {
    return ppditta(setterD(idx))(d, idx)
  }

  return pp_floating(c.name.value, c.ditte.map(ppditta_aux),index)
}