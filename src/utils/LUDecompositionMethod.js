function formatNumber(x) {
  if (Math.abs(x) < 1e-10) return "0";
  if (Number.isInteger(x)) return String(x);
  return parseFloat(x.toFixed(6)).toString();
}

export default function solveLUDecomposition(A, B) {
  const n = A.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const U = Array.from({ length: n }, () => Array(n).fill(0));
  const steps = [];

  // Step 1: LU Decomposition (Doolittle)
  for (let i = 0; i < n; i++) {
    L[i][i] = 1;

    // U row
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
      U[i][k] = A[i][k] - sum;
    }

    // L column
    for (let k = i + 1; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
      L[k][i] = (A[k][i] - sum) / U[i][i];
    }

    steps.push({
      latex: `\\text{After step } ${i + 1}:\\\\ L = \\begin{pmatrix}${L.map(r => r.map(formatNumber).join("&")).join("\\\\")}\\end{pmatrix},\\quad U = \\begin{pmatrix}${U.map(r => r.map(formatNumber).join("&")).join("\\\\")}\\end{pmatrix}`
    });
  }

  // Step 2: Forward substitution (Ly = B)
  const y = Array(n).fill(0);
  const forward = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < i; j++) sum += L[i][j] * y[j];
    y[i] = (B[i] - sum) / L[i][i];
    forward.push(`y_{${i + 1}} = (${B[i]} - ${sum}) / ${L[i][i]} = ${formatNumber(y[i])}`);
  }

  // Step 3: Back substitution (Ux = y)
  const x = Array(n).fill(0);
  const backward = [];
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) sum += U[i][j] * x[j];
    x[i] = (y[i] - sum) / U[i][i];
    backward.push(`x_{${i + 1}} = (${y[i]} - ${sum}) / ${U[i][i]} = ${formatNumber(x[i])}`);
  }
  backward.reverse();

  return { steps, forward, backward, solution: x.map(formatNumber) };
}
