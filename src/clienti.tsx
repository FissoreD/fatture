import { JSX, ReactNode } from "react";
import { cliente, date, ditta, editable, fatt, fatt_bolla, fatt_cnt } from "./types";
import { Col, Container, FloatingLabel, Row } from "react-bootstrap";
import { date2str, labelAbsolutePosition, mk_editable, pp_edit_str } from "./tools";
import { zoomffatt } from "./fattura";

const pp_floating = (name: editable<string>, setter: (x: editable<string>) => void, cnt: ReactNode, key?: number, add?: ReactNode) => {
  return (
    <div className="mb-2 form-floating" key={key}>
      <div className="form-control" style={{ minHeight: "58px", height: "auto" }} >
        {cnt}
      </div>
      {add ? <label style={{ right: "50%", left: "unset" }}>{add}</label> : <></>}
      <label style={{ pointerEvents: "auto" }} onClick={() => setter({...name, editing:true}) }>{pp_edit_str(name,setter)}</label>
    </div>
  )
}
  
export const ppfatt = (setter: (f: fatt) => void, remove:(n:number) => void, f: fatt, index: number) => {
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
          <Col>{f.cnt.fatt.total.value} €</Col>
          <Col>{f.cnt.bolla.total.value} €</Col>
        </Row>
        {labelAbsolutePosition({ right: 0, top: "-5pt" }, () => remove(f.id), <span>x</span>)}
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

const add_fatt = (adder: (v: void) => void) => <div style={{ pointerEvents: "auto", cursor: "pointer" }} onClick={e => adder()}>+</div>

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

  const setterDName = (name: editable<string>) => setter({ ...d, name })

  let cnt = (
    <Container>
      <Row>
        <Col>
          <Container className="border rounded p-1 m-1 position-relative">
            <Row>
              <Col>Data</Col>
              <Col>Fattura</Col>
              <Col>Bolla</Col>
            </Row>
          </Container>
          </Col>
      </Row>
      {d.cnt.map((f, idx) => ppfatt(setterF(idx), removeF, f, idx))}
    </Container>
  )
  return pp_floating(d.name, setterDName, cnt, index, add_fatt(addF))
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

  const setterDName = (name: editable<string>) => setter({...c, name})

  return pp_floating(c.name, setterDName, c.ditte.map(ppditta_aux),index)
}