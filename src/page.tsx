import { cliente, ditta, editable, fatt, fatt_cnt, fatt_line } from "./types";
import { useRef, useState } from 'react';
import { mk_editable } from './tools';
import { ppcliente } from './clienti';
import { Col, Container, Nav, Navbar } from 'react-bootstrap';

const l1: fatt_line = { descr: mk_editable("burrata"), qta: mk_editable("10 pz") }
const l2: fatt_line = { descr: mk_editable("jambon"), qta: mk_editable("10 pz") }
const l3: fatt_line = { descr: mk_editable("prosciutto"), qta: mk_editable("10 pz") }
const l4: fatt_line = { descr: mk_editable("latte"), qta: mk_editable("10 l") }
const l5: fatt_line = { descr: mk_editable("olio"), qta: mk_editable("10 l") }
const l6: fatt_line = { descr: mk_editable("fichi"), qta: mk_editable("10 l") }

const date = mk_editable("2026-04-17")
const mk_fatt = (lines: fatt_line[], total:editable<number>) : fatt_cnt => {return {lines, total}}

function nb () {
  let n = 0
  return () => n++
}

const n = nb()

const f1: fatt = { id: n(), zoom:false, date, cnt: { fatt: mk_fatt([l1], mk_editable(0)), bolla: mk_fatt([l1],mk_editable(1)) } }
const f2: fatt = { id: n(), zoom:false, date, cnt: { fatt: mk_fatt([l2, l3], mk_editable(1)), bolla: mk_fatt([l1],mk_editable(1)) } }
const f3: fatt = { id: n(), zoom:false, date, cnt: { fatt: mk_fatt([l4, l5, l6], mk_editable(2)), bolla: mk_fatt([l1],mk_editable(1)) } }

const ic: ditta = { name: mk_editable("italcorse"), cnt: [f1,f3] }
const pm: ditta = { name: mk_editable("petitmarche"), cnt: [f2] }

const c1: cliente = { name: mk_editable("Antoine"), ditte: [ic, pm] }
const c2: cliente = { name: mk_editable("Noel"), ditte: [ic] }

const xxx = [c1,c2]

const DownloadJsonButton = (cts: cliente[]) => {
  const handleDownload = () => {
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


  return <div onClick={handleDownload}> Salva </div>;
};

function JsonLoader(setter: ((c: cliente[]) => void)) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("File is", file)
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const typedData = parsed as cliente[];
      setter(typedData);
    } catch (err) {
      setter([]);
    }
  };

  return (
    <>
      {/* <FaUpload onClick={() => inputRef.current?.click()} /> */}
      <div onClick={() => inputRef.current?.click()}> Apri </div>

      <div className="container mt-3 d-none">
        <h4>Load JSON File</h4>

        {/* Bootstrap styled file input */}
        <input
          type="file"
          accept="application/json"
          className="form-control mb-3"
          onChange={handleFileLoad}
          ref={inputRef} 
        />
      </div>
    </>
  );
}

const l: cliente[] = []

export default function Home() {
  const [cts1, setCts] = useState(l);
  const setter = (idx:number) => (c:cliente) => setCts(cts1.map((c1,i) => i === idx ? c : c1))
  return <>
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Fatture</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#link">{JsonLoader(setCts)}</Nav.Link>
            <Nav.Link href="#home">{DownloadJsonButton(cts1)}</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <Container className='d-flex justify-content-center'>
    <Col style={{maxWidth: 500}}>
      {cts1.map((c, i) => ppcliente(setter(i), c, i))}
    </Col>
    </Container>
  </>
}
