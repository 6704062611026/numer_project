// src/utils/GraphicalMethod.js
import { evaluate } from "mathjs";

class GraphicalMethod {
  constructor(equation, xStart, xEnd, step = 0.1, tolerance = 1e-6, maxDepth = 10) {
    this.equation = equation;
    this.xStart = parseFloat(xStart);
    this.xEnd = parseFloat(xEnd);
    this.step = step;
    this.tolerance = tolerance;
    this.maxDepth = maxDepth;
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
      points.push({
        x: parseFloat(x.toFixed(6)),
        y: parseFloat(y.toFixed(10)),
      });
    }
    return points;
  }

  findRootByZoomIn() {
    const recursiveSearch = (xStart, xEnd, step, depth) => {
      let closestX = null;
      let closestY = Infinity;

      for (let x = xStart; x <= xEnd; x += step) {
        const y = this.evaluateAt(x);
        if (!isNaN(y) && Math.abs(y) < Math.abs(closestY)) {
          closestX = x;
          closestY = y;
        }
      }

      if (Math.abs(closestY) <= this.tolerance || depth >= this.maxDepth) {
        return { x: parseFloat(closestX.toFixed(8)), y: parseFloat(closestY.toFixed(10)) };
      }

      const newStart = closestX - step;
      const newEnd = closestX + step;
      const newStep = step / 10;

      return recursiveSearch(newStart, newEnd, newStep, depth + 1);
    };

    return recursiveSearch(this.xStart, this.xEnd, this.step, 0);
  }

  appendErrorFromEstimatedRoot(points, estimatedRoot) {
    return points.map((point) => {
      const error = Math.abs((point.x - estimatedRoot) / estimatedRoot);
      return {
        ...point,
        error: parseFloat(error.toFixed(6)),
      };
    });
  }
}

export default GraphicalMethod;
