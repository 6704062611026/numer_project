import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Graphical from "./pages/Graphical";
import Bisection from "./pages/Bisection";
import FalsePosition from "./pages/FalsePosition";
import OnePoint from "./pages/OnePoint";
import TaylorSeries from "./pages/TaylorSeries";
import NewtonRaphson from "./pages/NewtonRaphson";
import Secant from "./pages/Secant";
import CramersRule from "./pages/CramersRule";
import GaussEli from "./pages/GaussEli";
import GaussJor from "./pages/GaussJor";
import MatrixInversion from "./pages/MatrixInversion";
import LUDecomposition from "./pages/LUDecomposition";
import CholeskyDecomposition from "./pages/CholeskyDecomposition";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphical" element={<Graphical />} />
        <Route path="/bisection" element={<Bisection />} />
        <Route path="/false-position" element={<FalsePosition />} />
        <Route path="/one-point" element={<OnePoint />} />
        <Route path="/taylor" element={<TaylorSeries />} />
        <Route path="/newton" element={<NewtonRaphson />} />
        <Route path="/secant" element={<Secant />} />
        <Route path="/cramers" element={<CramersRule />} />
        <Route path="/gaussEli" element={<GaussEli />} />
        <Route path="/gaussJor" element={<GaussJor />} />
        <Route path="/matrixI" element={<MatrixInversion />} />
        <Route path="/LU" element={<LUDecomposition />} />
        <Route path="/cholesky" element={<CholeskyDecomposition />} />

      </Routes>
    </Router>
  );
}

export default App;
