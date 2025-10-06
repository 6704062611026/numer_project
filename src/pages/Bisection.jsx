import React,{useState} from "react";
import {evaluate} from 'mathjs';
import '../App.css';
import Header from '../components/Header';
import Plot from 'react-plotly.js';




function Bisection(){
    const[equation,setEquation]=useState("x^3-x-2");
    const[xl,setXl]=useState(1);
    const[xr,setXr]=useState(2);
    const[tolerance,setTolerance]=useState(0.000001);
    const[results,setResults]=useState([]);
    


    const calculateBisection=()=>{
        let data=[];
        let iter = 0;
        let xL = parseFloat(xl);
        let xR = parseFloat(xr);
        let xm,fxl,fxr,fxm,error;

        do{
            xm = (xL+xR)/2;
            fxl=evaluate(equation,{x:xl});
            fxr=evaluate(equation,{x:xr});
            fxm=evaluate(equation,{x:xm});

            if(fxm*fxr<0){
                xL=xm;
            }else{
                xR=xm;
            }
            error=Math.abs((xR-xL)/xm);
            data.push({
                iteration: iter+1,
                xL: xL.toFixed(6),
                xR: xR.toFixed(6),
                xM: xm.toFixed(6),
                fXM: fxm.toFixed(6),
                error:error.toFixed(6),
            });

            iter++;
        }while(error>parseFloat(tolerance)&&iter<50);
       
        setResults(data);
    };
return (
  <>
    <Header />
    <div className="App" style={{ padding: '0rem' }}>
      <h1 style={{ color: "#1e3a8a" }}>Bisection Method</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>Equation:</label>
        <input value={equation} onChange={(e) => setEquation(e.target.value)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>XL:</label>
        <input type="number" value={xl} onChange={(e) => setXl(e.target.value)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>XR:</label>
        <input type="number" value={xr} onChange={(e) => setXr(e.target.value)} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Tolerance:</label>
        <input type="number" value={tolerance} onChange={(e) => setTolerance(e.target.value)} />
      </div>

      <button
        className="b"
        onClick={calculateBisection}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#1e3a8a",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        Calculate
      </button>

      {results.length > 0 && (
        <>
          <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Graph</h2>
          <div style={{ width: '600px', height: '400px', margin: '0 auto' }}>
            <Plot
              data={[
                {
                  x: results.map((row) => row.iteration),
                  y: results.map((row) => parseFloat(row.xM)),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'XM (Approximated Root)',
                  marker: { color: 'blue' },
                },
                {
                  x: results.map((row) => row.iteration),
                  y: results.map((row) => parseFloat(row.fXM)),
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'f(XM)',
                  marker: { color: 'red' },
                },
              ]}
              layout={{
                title: 'Bisection Method: Root Approximation & f(x)',
                xaxis: { title: 'Iteration' },
                yaxis: { title: 'Value' },
                autosize: true,
                height: 400,
                width: 600,
              }}
              style={{ margin: '0 auto' }}
            />
          </div>

          <h2 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Results</h2>
          <table border="1" cellPadding="8" style={{ marginTop: '1rem', width: '100%' }}>
            <thead style={{ backgroundColor: "#e0e7ff" }}>
              <tr>
                <th>Iteration</th>
                <th>XL</th>
                <th>XR</th>
                <th>XM</th>
                <th>f(XM)</th>
                <th>Error</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  <td>{row.iteration}</td>
                  <td>{row.xL}</td>
                  <td>{row.xR}</td>
                  <td>{row.xM}</td>
                  <td>{row.fXM}</td>
                  <td>{row.error}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  </>
);
}
export default Bisection;
