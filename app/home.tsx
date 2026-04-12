import { JSX } from "react";
import { date2str, pp_edit_nb, TdC } from "./tools";
import { zoomffatt } from "./fattura";
import { cliente, ditta, editable, fatt } from "./types";

type printer = (n:number) => JSX.Element

const pp_cspan = (name: string, len: number) => (idx:number) =>
  idx === 0 ? <TdC rowSpan={len} name={name} /> : <></>

export const ppfatt = (pp_cname: printer,pp_dname: printer) => (setter: (f: fatt) => void, remove:(n:number) => void, f: fatt, index: number) => {
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
  return <tr key={index}>
    {zoomffatt(setter,f, setterZ)}
    {pp_cname(index)}
    {pp_dname(index)}
    <td>{date2str(f.date.value)}</td>
    {/* <td>{pp_edit_nb(f.cnt.fatt.total, setterF(false))}</td> */}
    <td>{f.cnt.fatt.total.value}</td>
    <td>{f.cnt.bolla.total.value}</td>
    <td style={{ cursor: "pointer" }} onClick={() => remove(f.id)}>RM</td>
    <td style={{ cursor: "pointer" }} onClick={() => setterZ(!f.zoom)}>ZOOM </td>
  </tr>
}

export const ppditta = (pp_cname: printer) => (setter: ((d: ditta) => void)) => (d: ditta, index: number) => {
  const setterF = (idx: number) => (x: fatt) => {
    const cnt = [...d.cnt]
    cnt[idx] = x
    setter({ ...d, cnt })
  }
  const removeF = (id: number) => {
    const cnt = d.cnt.filter(e => e.id !== id)
    setter({ ...d, cnt })

  }
  if (d.cnt.length === 0) return <tr key={index}>{pp_cname(index)}</tr>
  return d.cnt.map((f, idx) => ppfatt((e => pp_cname(index+e)), pp_cspan(d.name.value, d.cnt.length))(setterF(idx), removeF, f, idx))
}

function tot_row (c: cliente) {
  let l = 0
  c.ditte.forEach(d => l += d.cnt.length || 1);
  return l
}

export const ppcliente = (setter: (c: cliente) => void) => (c: cliente, index: number) => {
  const setterD = (idx: number) => (d: ditta) => {
    const dt = [...c.ditte]
    dt[idx] = d
    setter({ ...c, ditte: dt })
  }

  const ppditta_aux = (d: ditta, idx: number) => {
    return ppditta(pp_cspan(c.name.value, tot_row(c)))(setterD(idx))(d, idx)
  }

  return c.ditte.map(ppditta_aux)
}