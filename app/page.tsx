"use client";

import 'bootstrap/dist/css/bootstrap.min.css';

import { cliente, ppcliente } from "./home";
import { Table } from 'react-bootstrap';
import { MouseEventHandler, useState } from 'react';

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
    <Table><tbody>{cts1.map((c, i) => ppcliente(setter(i))(c,i))}</tbody></Table>
  </>
}
