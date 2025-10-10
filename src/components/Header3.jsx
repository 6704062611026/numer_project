import "./Header3.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Header3() {
  const navigate = useNavigate();
  const location = useLocation();

  
  const options = [
    { label: "SimpleRegression Method", path: "/simple" },
    { label: "MultipleRegression Method", path: "/multi" },
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
          <option value="/simple">Simple Regression</option>
          <option value="/multi">Multiple Regression</option>
        </select>
      </div>
    </>
  );
}

export default Header3;
