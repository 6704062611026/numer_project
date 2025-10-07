import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';


function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: "Root of Equation", path: "/graphical" },
    { name: "Linear Algebra Equation", path: "/cramers" },
    { name: "Interpolation", path: "/newtonI" },
    { name: "Extrapolation", path: "/simple" },
    { name: "Integration", path: "/trapezoidal" },
    { name: "Differentiation", path: "/differentiation" },
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">Numerical Method</h1>
      <p className="home-subtitle">Select a category to begin</p>

      <div className="category-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(cat.path)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
