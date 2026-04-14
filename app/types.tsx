export type editable<T> = { editing: boolean, value: T }

export type fatt_line = { descr: editable<string>; qta: editable<string> }
export type date = string

export type fatt_cnt = { lines: fatt_line[], total: editable<number> }

export type fatt_bolla = { fatt: fatt_cnt, bolla: fatt_cnt }

export type fatt = { id: number; date: editable<date>; cnt: fatt_bolla; zoom: boolean }

export type ditta = { name: editable<string>; cnt: fatt[] }
export type cliente = { name: editable<string>; ditte: ditta[] }

export type position = { left?: number | string, right?: number | string, top?: number | string, bottom?: number | string }
