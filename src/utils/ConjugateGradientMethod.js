function dotProduct(a, b) {
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}

function matrixVectorMultiply(A, x) {
  return A.map(row => dotProduct(row, x));
}

function vectorSubtract(a, b) {
  return a.map((v, i) => v - b[i]);
}

function vectorAdd(a, b) {
  return a.map((v, i) => v + b[i]);
}

function scalarMultiply(v, scalar) {
  return v.map(val => val * scalar);
}

function norm(v) {
  return Math.sqrt(dotProduct(v, v));
}

function solveConjugateGradient(A, b, tol = 1e-8, maxIter = 100) {
  const n = b.length;
  let x = Array(n).fill(0); // เริ่มต้นด้วย x0 = 0
  let r = vectorSubtract(b, matrixVectorMultiply(A, x));
  let p = [...r];
  let rsOld = dotProduct(r, r);
  const steps = [];

  for (let iter = 0; iter < maxIter; iter++) {
    const Ap = matrixVectorMultiply(A, p);
    const alpha = rsOld / dotProduct(p, Ap);
    x = vectorAdd(x, scalarMultiply(p, alpha));
    r = vectorSubtract(r, scalarMultiply(Ap, alpha));

    const rsNew = dotProduct(r, r);
    const beta = rsNew / rsOld;

    steps.push({
      iteration: iter + 1,
      alpha,
      beta,
      x: `[${x.map(v => v.toFixed(6)).join(", ")}]`,
      r: `[${r.map(v => v.toFixed(6)).join(", ")}]`,
      p: `[${p.map(v => v.toFixed(6)).join(", ")}]`
    });

    if (Math.sqrt(rsNew) < tol) break;

    p = vectorAdd(r, scalarMultiply(p, beta));
    rsOld = rsNew;
  }

  return {
    steps,
    solution: x
  };
}

export default solveConjugateGradient;
