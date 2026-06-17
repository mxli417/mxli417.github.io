(function () {
  function detection(rate, effort) {
    return 1 - Math.exp(-rate * Math.max(0, effort));
  }

  function probabilityOfSuccess(p1, a1, t1, a2, t2) {
    const p2 = 1 - p1;

    return (
      p1 * detection(a1, t1) +
      p2 * detection(a2, t2)
    );
  }

  function posteriorAfterFailedSearch(p1, a1, t1, a2, t2) {
    const p2 = 1 - p1;

    const miss1 = 1 - detection(a1, t1);
    const miss2 = 1 - detection(a2, t2);

    const denominator = p1 * miss1 + p2 * miss2;

    if (denominator <= 0) {
      return {
        p1Posterior: NaN,
        p2Posterior: NaN
      };
    }

    return {
      p1Posterior: (p1 * miss1) / denominator,
      p2Posterior: (p2 * miss2) / denominator
    };
  }

  function bruteForceOptimum(params) {
    const {
      p1,
      budget,
      c1,
      c2,
      a1,
      a2
    } = params;

    let best = {
      t1: 0,
      t2: 0,
      value: probabilityOfSuccess(p1, a1, 0, a2, 0)
    };

    const maxT1 = budget / c1;
    const step = Math.max(maxT1 / 500, 0.005);

    for (let t1 = 0; t1 <= maxT1; t1 += step) {
      const remainingBudget = budget - c1 * t1;

      if (remainingBudget < 0) {
        continue;
      }

      const t2 = remainingBudget / c2;
      const value = probabilityOfSuccess(p1, a1, t1, a2, t2);

      if (value > best.value) {
        best = {
          t1,
          t2,
          value
        };
      }
    }

    return best;
  }

  function readNumber(id) {
    const element = document.getElementById(id);
    return Number.parseFloat(element.value);
  }

  function readParams() {
    return {
      p1: readNumber("two-drawer-p1"),
      budget: readNumber("two-drawer-budget"),
      c1: readNumber("two-drawer-c1"),
      c2: readNumber("two-drawer-c2"),
      a1: readNumber("two-drawer-a1"),
      a2: readNumber("two-drawer-a2")
    };
  }

  function writeText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function validateParams(params) {
    const errors = [];

    if (!(params.p1 > 0 && params.p1 < 1)) {
      errors.push("The prior probability p₁ must be between 0 and 1.");
    }

    if (!(params.budget > 0)) {
      errors.push("The search budget must be positive.");
    }

    if (!(params.c1 > 0 && params.c2 > 0)) {
      errors.push("Search costs c₁ and c₂ must be positive.");
    }

    if (!(params.a1 > 0 && params.a2 > 0)) {
      errors.push("Detection rates a₁ and a₂ must be positive.");
    }

    return errors;
  }

  function colorForValue(value) {
    const clamped = Math.max(0, Math.min(1, value));

    const red = Math.round(255 - 160 * clamped);
    const green = Math.round(255 - 190 * clamped);
    const blue = Math.round(255 - 40 * clamped);

    return `rgb(${red}, ${green}, ${blue})`;
  }

  function drawAxes(ctx, width, height, padding, maxT1, maxT2) {
    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.fillStyle = "#222";
    ctx.font = "12px system-ui, sans-serif";

    ctx.fillText("t₁: effort in drawer 1", width / 2 - 55, height - 10);

    ctx.save();
    ctx.translate(15, height / 2 + 55);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("t₂: effort in drawer 2", 0, 0);
    ctx.restore();

    ctx.fillText("0", padding - 12, height - padding + 16);
    ctx.fillText(maxT1.toFixed(1), width - padding - 20, height - padding + 16);
    ctx.fillText(maxT2.toFixed(1), padding - 34, padding + 4);

    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;

    for (let i = 1; i <= 4; i++) {
      const x = padding + (i / 4) * plotWidth;
      const y = height - padding - (i / 4) * plotHeight;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
  }

  function drawHeatmap(params, optimum) {
    const canvas = document.getElementById("two-drawer-heatmap");

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const padding = 48;

    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const {
      p1,
      budget,
      c1,
      c2,
      a1,
      a2
    } = params;

    const maxT1 = budget / c1;
    const maxT2 = budget / c2;

    ctx.clearRect(0, 0, width, height);

    const cellSize = 4;

    for (let px = 0; px <= plotWidth; px += cellSize) {
      for (let py = 0; py <= plotHeight; py += cellSize) {
        const t1 = (px / plotWidth) * maxT1;
        const t2 = ((plotHeight - py) / plotHeight) * maxT2;

        const feasible = c1 * t1 + c2 * t2 <= budget + 1e-9;

        if (!feasible) {
          ctx.fillStyle = "#f0f0f0";
        } else {
          const value = probabilityOfSuccess(p1, a1, t1, a2, t2);
          ctx.fillStyle = colorForValue(value);
        }

        ctx.fillRect(padding + px, padding + py, cellSize, cellSize);
      }
    }

    drawAxes(ctx, width, height, padding, maxT1, maxT2);

    // Budget line: c1 * t1 + c2 * t2 = B
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const xIntercept = padding + plotWidth;
    const yIntercept = height - padding - plotHeight;

    ctx.beginPath();
    ctx.moveTo(padding, yIntercept);
    ctx.lineTo(xIntercept, height - padding);
    ctx.stroke();

    // Optimum point
    const ox = padding + (optimum.t1 / maxT1) * plotWidth;
    const oy = height - padding - (optimum.t2 / maxT2) * plotHeight;

    ctx.fillStyle = "#c62828";
    ctx.beginPath();
    ctx.arc(ox, oy, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, 6, 0, 2 * Math.PI);
    ctx.stroke();

    // Legend
    ctx.fillStyle = "#333";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("red dot = optimum", width - padding - 115, padding - 15);
    ctx.fillText("grey = infeasible", width - padding - 115, padding);
  }

  function updateWidget() {
    const params = readParams();

    writeText("two-drawer-p1-value", params.p1.toFixed(2));
    writeText("two-drawer-p2-value", (1 - params.p1).toFixed(2));
    writeText("two-drawer-budget-value", params.budget.toFixed(1));

    const errors = validateParams(params);
    const resultElement = document.getElementById("two-drawer-result");

    if (errors.length > 0) {
      if (resultElement) {
        resultElement.innerHTML = errors.join("<br>");
      }
      return;
    }

    const optimum = bruteForceOptimum(params);

    const q1 = detection(params.a1, optimum.t1);
    const q2 = detection(params.a2, optimum.t2);

    const posterior = posteriorAfterFailedSearch(
      params.p1,
      params.a1,
      optimum.t1,
      params.a2,
      optimum.t2
    );

    drawHeatmap(params, optimum);

    if (resultElement) {
      resultElement.innerHTML = `
        <strong>Optimal allocation under the current budget:</strong><br>
        Drawer 1 effort: <strong>${optimum.t1.toFixed(2)}</strong><br>
        Drawer 2 effort: <strong>${optimum.t2.toFixed(2)}</strong><br>
        Cost used: <strong>${(params.c1 * optimum.t1 + params.c2 * optimum.t2).toFixed(2)}</strong>
        out of ${params.budget.toFixed(2)}<br>
        Probability of success: <strong>${(100 * optimum.value).toFixed(1)}%</strong><br>
        Detection probability in drawer 1: <strong>${(100 * q1).toFixed(1)}%</strong><br>
        Detection probability in drawer 2: <strong>${(100 * q2).toFixed(1)}%</strong><br>
        Posterior after a failed search:
        p₁′ = <strong>${posterior.p1Posterior.toFixed(3)}</strong>,
        p₂′ = <strong>${posterior.p2Posterior.toFixed(3)}</strong>
      `;
    }
  }

  function initWidget() {
    const widget = document.getElementById("two-drawer-widget");

    if (!widget) {
      return;
    }

    [
      "two-drawer-p1",
      "two-drawer-budget",
      "two-drawer-c1",
      "two-drawer-c2",
      "two-drawer-a1",
      "two-drawer-a2"
    ].forEach(function (id) {
      const element = document.getElementById(id);

      if (element) {
        element.addEventListener("input", updateWidget);
      }
    });

    updateWidget();
  }

  document.addEventListener("DOMContentLoaded", initWidget);
})();