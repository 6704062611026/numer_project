function cloneMatrix(A) {
  return A.map((r) => [...r]);
}

function formatNumber(x) {
  if (Math.abs(x) < 1e-12) return "0";
  if (Number.isInteger(x)) return String(x);
  return parseFloat(x.toFixed(6)).toString();
}

function matrixToLatex(A, B) {
  const rows = A.map(
    (r, i) => r.map((v) => formatNumber(v)).join(" & ") + " & " + formatNumber(B[i])
  );
  return `\\begin{pmatrix} ${rows.join(" \\\\ ")} \\end{pmatrix}`;
}

export default function solveGaussJordan(Ainput, Binput) {
  const A = cloneMatrix(Ainput);
  const B = [...Binput];
  const n = A.length;
  const steps = [];

  for (let i = 0; i < n; i++) {
    // Pivot selection (partial pivot)
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    if (maxRow !== i) {
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [B[i], B[maxRow]] = [B[maxRow], B[i]];
      steps.push({
        latex: `R_{${i + 1}} \\leftrightarrow R_{${maxRow + 1}}`,
        matrixLatex: matrixToLatex(A, B),
      });
    }

    // Normalize pivot row
    const pivot = A[i][i];
    if (Math.abs(pivot) < 1e-12) continue;
    for (let j = 0; j < n; j++) A[i][j] /= pivot;
    B[i] /= pivot;

    steps.push({
      latex: `\\text{Make pivot } a_{${i + 1},${i + 1}} = 1 \\;\\Rightarrow\\; R_{${i + 1}} = R_{${i + 1}} / ${formatNumber(pivot)}`,
      matrixLatex: matrixToLatex(A, B),
    });

    // Eliminate other rows
    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = A[k][i];
      for (let j = 0; j < n; j++) A[k][j] -= factor * A[i][j];
      B[k] -= factor * B[i];

      steps.push({
        latex: `R_{${k + 1}} \\leftarrow R_{${k + 1}} - (${formatNumber(
          factor
        )}) R_{${i + 1}}`,
        matrixLatex: matrixToLatex(A, B),
      });
    }
  }

  const finalMatrixLatex = matrixToLatex(A, B);
  const solution = B;

  return { steps, finalMatrixLatex, solution };
}
