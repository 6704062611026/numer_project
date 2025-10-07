// src/utils/GraphicalMethod.js
import { evaluate } from "mathjs";

class GraphicalMethod {
  constructor(equation, xStart, xEnd, step = 0.1) {
    this.equation = equation;
    this.xStart = parseFloat(xStart);
    this.xEnd = parseFloat(xEnd);
    this.step = step;
  }

  evaluateAt(x) {
    try {
      return evaluate(this.equation, { x });
    } catch (err) {
      return NaN;
    }
  }

  generatePoints() {
    const points = [];
    for (let x = this.xStart; x <= this.xEnd; x += this.step) {
      const y = this.evaluateAt(x);
      points.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) });
    }
    return points;
  }
}

export default GraphicalMethod;
