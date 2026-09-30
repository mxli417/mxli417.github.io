(function () {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function detectionProbability(rate, effort) {
    const safeRate = Math.max(0, rate);
    const safeEffort = Math.max(0, effort);

    return -Math.expm1(-safeRate * safeEffort);
  }

  function probabilityOfSuccess(params, t1, t2) {
    const p1 = params.p1;
    const p2 = 1 - p1;

    const q1 = detectionProbability(params.a1, t1);
    const q2 = detectionProbability(params.a2, t2);

    return p1 * q1 + p2 * q2;
  }

  function posteriorAfterFailure(params, t1, t2) {
    const p1 = params.p1;
    const p2 = 1 - p1;

    const log1 = Math.log(p1) - params.a1 * t1;
    const log2 = Math.log(p2) - params.a2 * t2;
    const offset = Math.max(log1, log2);
    const weight1 = Math.exp(log1 - offset);
    const weight2 = Math.exp(log2 - offset);
    return {
      p1Posterior: weight1 / (weight1 + weight2),
      p2Posterior: weight2 / (weight1 + weight2)
    };
  }

  function marginalReturnPerCost(params, drawer, effort) {
    if (drawer === 1) {
      return (
        params.p1 *
        params.a1 *
        Math.exp(-params.a1 * effort)
      ) / params.c1;
    }

    return (
      (1 - params.p1) *
      params.a2 *
      Math.exp(-params.a2 * effort)
    ) / params.c2;
  }

  function readNumber(id) {
    const element = document.getElementById(id);

    if (!element) {
      return NaN;
    }

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

  function validateParams(params) {
    const errors = [];

    if (!Number.isFinite(params.p1) || params.p1 <= 0 || params.p1 >= 1) {
      errors.push("Prior probability must be between 0 and 1.");
    }

    if (!Number.isFinite(params.budget) || params.budget <= 0) {
      errors.push("Search budget must be positive.");
    }

    if (!Number.isFinite(params.c1) || params.c1 <= 0) {
      errors.push("Cost in drawer 1 must be positive.");
    }

    if (!Number.isFinite(params.c2) || params.c2 <= 0) {
      errors.push("Cost in drawer 2 must be positive.");
    }

    if (!Number.isFinite(params.a1) || params.a1 <= 0) {
      errors.push("Detection rate in drawer 1 must be positive.");
    }

    if (!Number.isFinite(params.a2) || params.a2 <= 0) {
      errors.push("Detection rate in drawer 2 must be positive.");
    }

    return errors;
  }

  function findBestAllocation(params) {
    const logRatio = Math.log(params.p1) + Math.log(params.a1) - Math.log(params.c1)
      - Math.log1p(-params.p1) - Math.log(params.a2) + Math.log(params.c2);
    const t1 = clamp((logRatio + params.a2 * params.budget / params.c2)
      / (params.a1 + params.a2 * params.c1 / params.c2), 0, params.budget / params.c1);
    const t2 = Math.max(0, (params.budget - params.c1 * t1) / params.c2);
    return { t1: t1, t2: t2, value: probabilityOfSuccess(params, t1, t2) };
  }

  function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function colorForValue(value) {
    const v = clamp(value, 0, 1);

    const red = Math.round(245 - 145 * v);
    const green = Math.round(245 - 175 * v);
    const blue = Math.round(245 - 30 * v);

    return "rgb(" + red + "," + green + "," + blue + ")";
  }

  function drawHeatmap(params, optimum) {
    const canvas = document.getElementById("two-drawer-heatmap");

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;
    const padding = 52;

    const plotWidth = width - 2 * padding;
    const plotHeight = height - 2 * padding;

    const maxT1 = params.budget / params.c1;
    const maxT2 = params.budget / params.c2;

    ctx.clearRect(0, 0, width, height);

    const cellSize = 4;

    for (let x = 0; x <= plotWidth; x += cellSize) {
      for (let y = 0; y <= plotHeight; y += cellSize) {
        const t1 = (x / plotWidth) * maxT1;
        const t2 = ((plotHeight - y) / plotHeight) * maxT2;

        const cost = params.c1 * t1 + params.c2 * t2;
        const feasible = cost <= params.budget + 1e-9;

        if (feasible) {
          const value = probabilityOfSuccess(params, t1, t2);
          ctx.fillStyle = colorForValue(value);
        } else {
          ctx.fillStyle = "#eeeeee";
        }

        ctx.fillRect(padding + x, padding + y, cellSize, cellSize);
      }
    }

    drawGridAndAxes(ctx, width, height, padding, plotWidth, plotHeight, maxT1, maxT2);
    drawBudgetLine(ctx, height, padding, plotWidth, plotHeight);
    drawOptimum(ctx, height, padding, plotWidth, plotHeight, maxT1, maxT2, optimum);
    drawLegend(ctx, width, padding);
  }

  function drawGridAndAxes(ctx, width, height, padding, plotWidth, plotHeight, maxT1, maxT2) {
    ctx.save();

    ctx.strokeStyle = "#dddddd";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i += 1) {
      const x = padding + (i / 4) * plotWidth;
      const y = padding + (i / 4) * plotHeight;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.fillStyle = "#222222";
    ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

    ctx.fillText("0", padding - 14, height - padding + 16);
    ctx.fillText(maxT1.toFixed(1), width - padding - 24, height - padding + 16);
    ctx.fillText(maxT2.toFixed(1), padding - 42, padding + 4);

    ctx.fillText("effort in drawer 1", width / 2 - 45, height - 14);

    ctx.save();
    ctx.translate(18, height / 2 + 45);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("effort in drawer 2", 0, 0);
    ctx.restore();

    ctx.restore();
  }

  function drawBudgetLine(ctx, height, padding, plotWidth, plotHeight) {
    ctx.save();

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding + plotWidth, padding + plotHeight);
    ctx.stroke();

    ctx.restore();
  }

  function drawOptimum(ctx, height, padding, plotWidth, plotHeight, maxT1, maxT2, optimum) {
    const x = padding + (optimum.t1 / maxT1) * plotWidth;
    const y = height - padding - (optimum.t2 / maxT2) * plotHeight;

    ctx.save();

    ctx.fillStyle = "#c62828";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.restore();
  }

  function drawLegend(ctx, width, padding) {
    ctx.save();

    ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "#333333";
    ctx.fillText("red = optimum", width - padding - 110, padding - 18);
    ctx.fillText("grey = infeasible", width - padding - 110, padding - 2);

    ctx.restore();
  }

  function updateWidget() {
    const params = readParams();
    const result = document.getElementById("two-drawer-result");

    setText("two-drawer-p1-value", params.p1.toFixed(3));
    setText("two-drawer-p2-value", (1 - params.p1).toFixed(3));
    setText("two-drawer-budget-value", params.budget.toFixed(1));

    const errors = validateParams(params);

    if (errors.length > 0) {
      document.getElementById("two-drawer-heatmap").hidden = true;
      if (result) {
        result.innerHTML = errors.join("<br>");
      }
      return;
    }

    const optimum = findBestAllocation(params);
    document.getElementById("two-drawer-heatmap").hidden = false;

    const q1 = detectionProbability(params.a1, optimum.t1);
    const q2 = detectionProbability(params.a2, optimum.t2);

    const posterior = posteriorAfterFailure(params, optimum.t1, optimum.t2);

    const mr1 = marginalReturnPerCost(params, 1, optimum.t1);
    const mr2 = marginalReturnPerCost(params, 2, optimum.t2);

    drawHeatmap(params, optimum);

    if (result) {
      result.innerHTML =
        "<strong>Best feasible allocation</strong><br>" +
        "Drawer 1 effort: <strong>" + optimum.t1.toFixed(2) + "</strong><br>" +
        "Drawer 2 effort: <strong>" + optimum.t2.toFixed(2) + "</strong><br>" +
        "Cost used: <strong>" +
        (params.c1 * optimum.t1 + params.c2 * optimum.t2).toFixed(2) +
        "</strong> / " + params.budget.toFixed(2) + "<br>" +
        "Probability of detection: <strong>" +
        (100 * optimum.value).toFixed(1) + "%</strong><br>" +
        "Conditional detection in drawer 1: <strong>" +
        (100 * q1).toFixed(1) + "%</strong><br>" +
        "Conditional detection in drawer 2: <strong>" +
        (100 * q2).toFixed(1) + "%</strong><br>" +
        "Posterior after failed search: " +
        "p₁′ = <strong>" + posterior.p1Posterior.toFixed(3) + "</strong>, " +
        "p₂′ = <strong>" + posterior.p2Posterior.toFixed(3) + "</strong><br>" +
        "Marginal gain per cost at optimum: " +
        "drawer 1 = <strong>" + mr1.toFixed(4) + "</strong>, " +
        "drawer 2 = <strong>" + mr2.toFixed(4) + "</strong>";
    }
  }

  function initWidget() {
    const widget = document.getElementById("two-drawer-widget");

    if (!widget) {
      return;
    }

    document.getElementById("two-drawer-reset").addEventListener("click", function () {
      const defaults = { p1: 2 / 3, budget: 2, c1: 1, c2: 1, a1: 1, a2: 1 };
      Object.keys(defaults).forEach(function (key) {
        document.getElementById("two-drawer-" + key).value = defaults[key];
      });
      updateWidget();
    });

    const inputIds = [
      "two-drawer-p1",
      "two-drawer-budget",
      "two-drawer-c1",
      "two-drawer-c2",
      "two-drawer-a1",
      "two-drawer-a2"
    ];

    inputIds.forEach(function (id) {
      const element = document.getElementById(id);

      if (element) {
        element.addEventListener("input", updateWidget);
        element.addEventListener("change", updateWidget);
      }
    });

    updateWidget();
  }

  document.addEventListener("DOMContentLoaded", initWidget);
})();
