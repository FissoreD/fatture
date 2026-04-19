export type editable<T> = { editing: boolean, value: T }

export type fatt_line = { descr: editable<string>; qta: editable<string> }
export type date = string

export type fatt_cnt = { lines: fatt_line[], total: editable<number> }

export type fatt_bolla = { fatt: fatt_cnt, bolla: fatt_cnt }

export type fatt = { id: number; date: editable<date>; cnt: fatt_bolla; zoom: boolean }

export type ditta = { name: editable<string>; cnt: fatt[] }
export type cliente = { name: editable<string>; ditte: ditta[] }

export type position = { left?: number | string, right?: number | string, top?: number | string, bottom?: number | string }

export function mk_editable<T>(x: T): editable<T> {
  return { editing: false, value: x }
}

const empty_fatt_cnt = (): fatt_cnt => ({ lines: [], total: mk_editable(0) })
const empty_fatt_bolla = (): fatt_bolla => ({ fatt: empty_fatt_cnt(), bolla: empty_fatt_cnt() })
const now_date = (): editable<date> => {
  let n = new Date(Date.now())
  return mk_editable(n.toDateString())
}
export const empty_fatt = (): fatt => ({ cnt: empty_fatt_bolla(), date: now_date(), id: Date.now(), zoom: false })
export const empty_ditta = (): ditta => ({ name: mk_editable("xx"), cnt: [] })

export const empty_fatt_list = (): fatt_line => ({ descr: mk_editable("xx"), qta: mk_editable("xx") })

export const empty_client = () : cliente => ({name: mk_editable("xx"), ditte: []})
