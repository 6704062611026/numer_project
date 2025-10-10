// Gaussian elimination with step recording for display as LaTeX
// Input: A: n x n array, B: length n array
// Output: { forward: [steps], upperMatrixLatex: ..., backSubstitution: [...], solution: [...] }

function cloneMatrix(A) {
  return A.map(row => row.map(v => v));
}

function matrixToLatex(A, B) {
  // produce LaTeX pmatrix for augmented matrix [A|B]
  const rows = A.map((r, i) => r.map(v => formatNumber(v)).join(" & ") + " & " + formatNumber(B[i]));
  return `\\begin{pmatrix} ${rows.join(" \\\\ ")} \\end{pmatrix}`;
}

function formatNumber(x) {
  if (x === 0) return "0";
  if (!isFinite(x)) return x.toString();
  // show as rational-ish if integer or fixed decimal otherwise
  if (Math.abs(Math.round(x) - x) < 1e-12) return String(Math.round(x));
  return Number.parseFloat(x).toFixed(6).replace(/\.?0+$/, "");
}

export default function solveGauss(Ainput, Binput) {
  const n = Ainput.length;
  const A = cloneMatrix(Ainput);
  const B = Binput.slice();

  const forward = []; // array of step objects {type, latex, matrixLatex}
  // Use partial pivoting: for each pivot column k, find max abs pivot at or below k and swap
  for (let k = 0; k < n - 1; k++) {
    // pivot selection
    let maxRow = k;
    let maxVal = Math.abs(A[k][k]);
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(A[i][k]) > maxVal) {
        maxVal = Math.abs(A[i][k]);
        maxRow = i;
      }
    }
    if (maxRow !== k) {
      // swap rows k and maxRow
      const tmpRow = A[k];
      A[k] = A[maxRow];
      A[maxRow] = tmpRow;
      const tmpB = B[k];
      B[k] = B[maxRow];
      B[maxRow] = tmpB;

      const latex = `R_${k+1} \\leftrightarrow R_{${maxRow+1}}`;
      forward.push({
        type: "swap",
        latex,
        matrixLatex: matrixToLatex(A, B)
      });
    }

    // if pivot is zero (or near zero), skip (singular or dependent)
    const pivot = A[k][k];
    if (Math.abs(pivot) < 1e-12) {
      // can't eliminate with zero pivot
      continue;
    }

    // elimination for rows below pivot
    for (let i = k + 1; i < n; i++) {
      const factor = A[i][k] / pivot;
      // perform row_i = row_i - factor * row_k
      for (let j = k; j < n; j++) {
        A[i][j] = A[i][j] - factor * A[k][j];
        // clean tiny rounding noise
        if (Math.abs(A[i][j]) < 1e-12) A[i][j] = 0;
      }
      B[i] = B[i] - factor * B[k];
      if (Math.abs(B[i]) < 1e-12) B[i] = 0;

      const latexFactor = `R_{${i+1}} \\leftarrow R_{${i+1}} - (${formatNumber(factor)}) R_{${k+1}}`;
      forward.push({
        type: "factor",
        latex: `\\text{factor: } \\; a_{${i+1},${k+1}} / a_{${k+1},${k+1}} = ${formatNumber(A[i][k] + factor * A[k][k])} / ${formatNumber(pivot)} = ${formatNumber(factor)}`,
        // note: above expression tries to mimic "factor: ..." but we also provide the row op explicitly:
        detail: latexFactor,
        matrixLatex: matrixToLatex(A, B)
      });
    }
  }

  // record the final upper triangular augmented matrix
  const upperMatrixLatex = matrixToLatex(A, B);

  // Back substitution
  const x = Array(n).fill(0);
  const backSubstitution = [];

  // check for zero diagonal element -> singular or infinite solutions
  let singular = false;
  for (let i = 0; i < n; i++) {
    if (Math.abs(A[i][i]) < 1e-12) {
      singular = true;
      break;
    }
  }

  if (singular) {
    backSubstitution.push(`\\text{Matrix is singular or has zero pivot(s); back substitution cannot proceed reliably.}`);
    return {
      forward,
      upperMatrixLatex,
      backSubstitution,
      solution: []
    };
  }

  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    let terms = [];
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * x[j];
      terms.push(`${formatNumber(A[i][j])} \\cdot x_{${j+1}}`);
    }
    const rhs = B[i] - sum;
    const xi = rhs / A[i][i];
    x[i] = xi;
    // prepare LaTeX line
    // example: x_3 = b_3 / a_33 = 0.1125
    const line1 = `x_{${i+1}} = \\dfrac{b_{${i+1}} - (${terms.join(" + ") || "0"})}{${formatNumber(A[i][i])}} = \\dfrac{${formatNumber(B[i])} - (${formatNumber(sum)})}{${formatNumber(A[i][i])}} = ${formatNumber(xi)}`;
    backSubstitution.push(line1);
  }

  return {
    forward,
    upperMatrixLatex,
    backSubstitution,
    solution: x
  };
}
