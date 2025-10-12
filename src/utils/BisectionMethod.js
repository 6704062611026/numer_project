import { evaluate } from "mathjs";

class BisectionMethod {
  constructor(equation, xl, xr, tolerance, maxIterations = 50) {
    this.equation = equation;
    this.xl = parseFloat(xl);
    this.xr = parseFloat(xr);
    this.tolerance = parseFloat(tolerance);
    this.maxIterations = maxIterations;
    this.results = [];
  }

  evaluateAt(x) {
    return evaluate(this.equation, { x });
  }

  solve() {
    let iter = 0;
    let xL = this.xl;
    let xR = this.xr;
    let xm, fxl, fxr, fxm, error;

    this.results = [];

    do {
      xm = (xL + xR) / 2;
      fxl = this.evaluateAt(xL);
      fxr = this.evaluateAt(xR);
      fxm = this.evaluateAt(xm);

      if (fxm * fxr < 0) {
        xL = xm;
      } else {
        xR = xm;
      }

      error = Math.abs((xR - xL) / xm);

      this.results.push({
        iteration: iter + 1,
        xL: xL.toFixed(6),
        xR: xR.toFixed(6),
        xM: xm.toFixed(6),
        fXM: fxm.toFixed(6),
        error: error.toFixed(6),
      });

      iter++;
    } while (error > this.tolerance && iter < this.maxIterations);

    return this.results;
  }
}

export default BisectionMethod;
