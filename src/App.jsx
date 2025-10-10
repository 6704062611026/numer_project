import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Graphical from "./pages/Graphical";
import Bisection from "./pages/Bisection";
import FalsePosition from "./pages/FalsePosition";
import OnePoint from "./pages/OnePoint";
import NewtonRaphson from "./pages/NewtonRaphson";
import Secant from "./pages/Secant";
import CramersRule from "./pages/CramersRule";
import GaussEli from "./pages/GaussEli";
import GaussJor from "./pages/GaussJor";
import MatrixInversion from "./pages/MatrixInversion";
import LUDecomposition from "./pages/LUDecomposition";
import CholeskyDecomposition from "./pages/CholeskyDecomposition";
import Jacobi from "./pages/Jacobi";
import GaussSeidel from "./pages/GaussSeidel";
import ConjugateGradient from "./pages/ConjugateGradient";
import NewtonInterpolation from "./pages/NewtonInterpolation";
import LagrangeInterpolation from "./pages/LagrangeInterpolation";
import SplineInterpolation from "./pages/SplineInterpolation";
import SimpleRegression from "./pages/SimpleRegression";
import MultipleRegression from "./pages/MultipleRegression";
import SimpleTrapezoidalIntegration from "./pages/Simpletrapezoidal";
import CompositeTrapezoidalIntegration from "./pages/CompositeTrapezoidal";
import SingleSimpsonIntegration from "./pages/SingleSimpsonIntegration";
import CompositeSimpsonIntegration from "./pages/CompositeSimson";
import NumericalDifferentiation from "./pages/NumericalDifferentiation";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graphical" element={<Graphical />} />
        <Route path="/bisection" element={<Bisection />} />
        <Route path="/false-position" element={<FalsePosition />} />
        <Route path="/one-point" element={<OnePoint />} />
        <Route path="/newton" element={<NewtonRaphson />} />
        <Route path="/secant" element={<Secant />} />
        <Route path="/cramers" element={<CramersRule />} />
        <Route path="/gaussEli" element={<GaussEli />} />
        <Route path="/gaussJor" element={<GaussJor />} />
        <Route path="/matrixI" element={<MatrixInversion />} />
        <Route path="/LU" element={<LUDecomposition />} />
        <Route path="/cholesky" element={<CholeskyDecomposition />} />
        <Route path="/jacobi" element={<Jacobi/>}/>
        <Route path="/gaussseidel" element={<GaussSeidel/>}/>
        <Route path="/conjugate" element={<ConjugateGradient/>}/>
        <Route path="/newtonI" element={<NewtonInterpolation/>}/>
        <Route path="/lagrange" element={<LagrangeInterpolation/>}/>
        <Route path="/splineI" element={<SplineInterpolation/>}/>
        <Route path="/simple" element={<SimpleRegression/>}/>
        <Route path="/multi" element={<MultipleRegression/>}/>
        <Route path="/trapezoidal" element={<SimpleTrapezoidalIntegration/>}/>
        <Route path="/compositetrapezoidal" element={<CompositeTrapezoidalIntegration/>}/>
        <Route path="/singlesimpson" element={<SingleSimpsonIntegration/>}/>
        <Route path="/compositesimpson" element={<CompositeSimpsonIntegration/>}/>
        <Route path="/numer" element={<NumericalDifferentiation/>}/>
      </Routes>
    </Router>
  );
}

export default App;
