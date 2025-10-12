import "./Header2.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header2() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const options = [
    { label: "Newton's Divided Differences Interpolation Method", path: "/newtonI" },
    { label: "Lagrange Interpolation Method", path: "/lagrange" },
    { label: "Spline Interpolation Method", path: "/splineI" },
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
      <div className="s">
        <select onChange={handleSelect} value={selectedPath}>
          <option value="/newtonI">Newton's Divided Differences</option>
          <option value="/lagrange">Lagrange Interpolation</option>
          <option value="/splineI">Spline Interpolation</option>
        </select>
      </div>
    </>
  );
}

export default Header2;
