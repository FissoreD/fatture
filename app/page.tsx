"use client";

import 'bootstrap/dist/css/bootstrap.min.css';

import { cliente, ditta, editable, fatt, fatt_cnt, fatt_line, ppcliente } from "./home";
import { Container, Table } from 'react-bootstrap';
import { MouseEventHandler, useState } from 'react';
import { TdH } from './tools';

function mk_editable<T>(x:T) : editable<T> {
  return { editing: false, value:x}
}

const l1: fatt_line = { descr: mk_editable("burrata"), qta: mk_editable("10 pz") }
const l2: fatt_line = { descr: mk_editable("jambon"), qta: mk_editable("10 pz") }
const l3: fatt_line = { descr: mk_editable("prosciutto"), qta: mk_editable("10 pz") }
const l4: fatt_line = { descr: mk_editable("latte"), qta: mk_editable("10 l") }
const l5: fatt_line = { descr: mk_editable("olio"), qta: mk_editable("10 l") }
const l6: fatt_line = { descr: mk_editable("fichi"), qta: mk_editable("10 l") }

const date = mk_editable({ d: 10, m: 1, y: 1 })
const mk_fatt = (lines: fatt_line[], total:editable<number>) : fatt_cnt => {return {lines, total}}

function nb () {
  let n = 0
  return () => n++
}

const n = nb()

const f1: fatt = { id: n(), date, cnt: { fatt: mk_fatt([l1], mk_editable(0)), bolla: mk_fatt([l1],mk_editable(1)) } }
const f2: fatt = { id: n(), date, cnt: { fatt: mk_fatt([l2, l3], mk_editable(1)), bolla: mk_fatt([l1],mk_editable(1)) } }
const f3: fatt = { id: n(), date, cnt: { fatt: mk_fatt([l4, l5, l6], mk_editable(2)), bolla: mk_fatt([l1],mk_editable(1)) } }

const ic: ditta = { name: mk_editable("italcorse"), cnt: [f1,f3] }
const pm: ditta = { name: mk_editable("petitmarche"), cnt: [f2] }

const c1: cliente = { name: mk_editable("Antoine"), ditte: [ic, pm] }
const c2: cliente = { name: mk_editable("Noel"), ditte: [ic] }

const cts = [c1,c2]

const DownloadJsonButton = (cts: cliente[]) => {
  const handleDownload: MouseEventHandler<HTMLButtonElement> = () => {
    const data = cts;

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  return (
    <button className="btn btn-primary" onClick={handleDownload}>
      Download JSON
    </button>
  );
};

function JsonLoader(data:cliente[], setter:((c:cliente[]) => void)) {
  const [error, setError] = useState<string | null>(null);

  const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File is", file)
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      // ⚠️ TypeScript cast (compile-time only)
      const typedData = parsed as cliente[];
      console.log("AAAA", typedData)

      setError(null);
      setter(typedData);
    } catch (err) {
      setError("Invalid JSON file");
      setter([]);
    }
    // TODO: better error menagement
  };

  return (
    <div className="container mt-3">
      <h4>Load JSON File</h4>

      {/* Bootstrap styled file input */}
      <input
        type="file"
        accept="application/json"
        className="form-control mb-3"
        onChange={handleFileLoad}
      />

      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

const l: cliente[] = []

export default function Home() {
  const [cts1, setCts] = useState(l);
  const setter = (i:number) =>  (c:cliente) => {
    const cts = [...cts1];
    cts[i] = c;
    setCts(cts)
  }
  return <>
    {DownloadJsonButton(cts1)}
    {JsonLoader(cts1,setCts)}
    <Table>
      <thead>
        <tr>
          <TdH name='Cliente'/>
          <TdH name='Ditta'/>
          <th>Data</th>
          <th>Fattura</th>
          <th>Bolla</th>
        </tr>
      </thead>
      <tbody>{cts1.map((c, i) => ppcliente(setter(i))(c, i))}</tbody>
    </Table>
  </>
}
