import "./Header.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("selected-method");
    if (saved) {
      setSelectedPath(saved);
    } else {
      setSelectedPath(location.pathname);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("selected-method")) {
      setSelectedPath(location.pathname);
    }
  }, [location.pathname]);

  const handleSelect = (e) => {
    const selected = e.target.value;
    setSelectedPath(selected);
    localStorage.setItem("selected-method", selected);
    navigate(selected);
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
              localStorage.removeItem("selected-method");
            }}
            style={{ color: "white", textDecoration: "none", marginRight: "20px" }}
          >
            Home
          </Link>

          <Link
            to="/history"
            className="nav-link"
            style={{ color: "white", textDecoration: "none" }}
          >
            History
          </Link>
        </h2>
      </nav>
 {location.pathname !== "/history" && (
        <div className="s">
          <select onChange={handleSelect} value={selectedPath}>
            <option value="/graphical">Graphical method</option>
            <option value="/bisection">Bisection method</option>
            <option value="/false-position">False position method</option>
            <option value="/one-point">One-point Iteration method</option>
            <option value="/newton">Newton-Raphson method</option>
            <option value="/secant">Secant method</option>
          </select>
        </div>
      )}
    </>
  );
}

export default Header;
