function formatNumber(x) {
  if (Math.abs(x) < 1e-10) return "0";
  if (Number.isInteger(x)) return String(x);
  return parseFloat(x.toFixed(6)).toString();
}

export default function solveCholesky(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const steps = [];

  // ตรวจสอบว่า symmetric หรือไม่
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (A[i][j] !== A[j][i]) {
        return { error: "Matrix A is not symmetric. Cholesky cannot be applied." };
      }
    }
  }

  try {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }

        if (i === j) {
          const val = A[i][i] - sum;
          if (val <= 0) {
            return { error: "Matrix is not positive definite. Cholesky failed." };
          }
          L[i][j] = Math.sqrt(val);
          steps.push(
            `L_{${i + 1}${j + 1}} = \\sqrt{A_{${i + 1}${i + 1}} - \\sum_{k=1}^{${j}} L_{${i + 1}k}^2} = \\sqrt{${A[i][i]} - ${formatNumber(sum)}} = ${formatNumber(L[i][j])}`
          );
        } else {
          L[i][j] = (A[i][j] - sum) / L[j][j];
          steps.push(
            `L_{${i + 1}${j + 1}} = \\frac{A_{${i + 1}${j + 1}} - \\sum_{k=1}^{${j}} L_{${i + 1}k}L_{${j + 1}k}}{L_{${j + 1}${j + 1}}} = \\frac{${A[i][j]} - ${formatNumber(sum)}}{${formatNumber(
              L[j][j]
            )}} = ${formatNumber(L[i][j])}`
          );
        }
      }
    }
  } catch (e) {
    return { error: "Error computing Cholesky decomposition." };
  }

  const Llatex = `\\begin{pmatrix}${L.map(r => r.map(formatNumber).join("&")).join("\\\\")}\\end{pmatrix}`;
  const LT = L[0].map((_, i) => L.map(row => row[i]));
  const LTlatex = `\\begin{pmatrix}${LT.map(r => r.map(formatNumber).join("&")).join("\\\\")}\\end{pmatrix}`;

  return { steps, Llatex, LTlatex };
}
