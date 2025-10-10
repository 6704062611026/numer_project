import "./Header1.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header1() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const options = [
    { label: "Cramer's Rule method", path: "/cramer" },
    { label: "Gauss Elimination method", path: "/gauss-elimination" },
    { label: "Gauss Jordan Elimination method", path: "/gauss-jordan" },
    { label: "Matrix Inversion method", path: "/matrix-inversion" },
    { label: "LU Decomposition method", path: "/lu-decomposition" },
    { label: "Cholesky Decomposition method", path: "/cholesky" },
    { label: "Jacobi iteration method", path: "/jacobi"},
    { label: "Gauss-Seidel Iteration method", path: "/gaussseidel"},
    { label: "Conjugate Gradient method", path: "/conjugate"}
  ];

  const [selectedPath, setSelectedPath] = useState("");

  
  useEffect(() => {
    const saved = localStorage.getItem("selected-linear-method");
    if (saved) {
      setSelectedPath(saved);
    } else {
      setSelectedPath(location.pathname);
    }
  }, []);

 
  useEffect(() => {
    if (!localStorage.getItem("selected-linear-method")) {
      setSelectedPath(location.pathname);
    }
  }, [location.pathname]);

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelectedPath(value);
    localStorage.setItem("selected-linear-method", value);
    navigate(value);
  };

  return (
    <>
      <nav>
        <h1 style={{ color: "white" }}>Numerical</h1>
        <h2>
          <Link
  to="/"
  className="nav-link"
  onClick={() => {
    
    localStorage.removeItem("selected-linear-method");    
  }}
>
  Home
</Link>

        </h2>
      </nav>
      <div className="s">
        <select onChange={handleSelect} value={selectedPath}>
          <option value="/cramers">Cramer's Rule</option>
          <option value="/gaussEli">Gauss Elimination</option>
          <option value="/gaussJor">Gauss Jordan Elimination</option>
          <option value="/matrixI">Matrix Inversion Method</option>
          <option value="/LU">LU Decomposition Method</option>
          <option value="/cholesky">Cholesky Decomposition Method</option>
          <option value="/jacobi">Jacobi iteration method</option>
          <option value="/gaussseidel">Gauss Seidel Iteration method</option>
          <option value="/conjugate">ConjugateGradient method</option>
        </select>
      </div>
    </>
  );
}

export default Header1;
