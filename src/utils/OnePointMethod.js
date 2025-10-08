// src/utils/OnePointMethod.js
import { evaluate } from "mathjs";

class OnePointMethod {
  constructor(equation, initialGuess, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.initialGuess = parseFloat(initialGuess);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
  }

  evaluateAt(x) {
    return evaluate(this.equation, { x });
  }

  solve() {
    let iter = 0;
    let xOld = this.initialGuess;
    let xNew, error;

    this.results = [];

    do {
      xNew = this.evaluateAt(xOld);
      error = Math.abs((xNew - xOld) / xNew);

      this.results.push({
        iteration: iter + 1,
        xOld: xOld.toFixed(6),
        xNew: xNew.toFixed(6),
        error: error.toFixed(6),
      });

      xOld = xNew;
      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

export default OnePointMethod;
