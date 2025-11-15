import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register all used components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

//
// Rounded bars plugin
//
const RoundedBarPlugin = {
  id: "roundedBar",
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar) => {
        const { x, y, base, width } = bar;
        const height = base - y;
        const radius = Math.min(6, Math.abs(height / 2), Math.abs(width / 2));

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = dataset.backgroundColor || "#000";

        const left = x - width / 2;
        const right = x + width / 2;
        const top = y;
        const bottom = base;

        ctx.moveTo(left + radius, bottom);
        ctx.lineTo(right - radius, bottom);
        ctx.quadraticCurveTo(right, bottom, right, bottom - radius);
        ctx.lineTo(right, top + radius);
        ctx.quadraticCurveTo(right, top, right - radius, top);
        ctx.lineTo(left + radius, top);
        ctx.quadraticCurveTo(left, top, left, top + radius);
        ctx.lineTo(left, bottom - radius);
        ctx.quadraticCurveTo(left, bottom, left + radius, bottom);

        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    });
  }
};
Chart.register(RoundedBarPlugin);

//
// Colors and fonts
//
const mode = "light";
const fonts = { base: "Open Sans" };
const colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529"
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340"
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent"
};

//
// Chart global defaults
//
function chartOptions() {
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.color =
    mode === "dark" ? colors.gray[700] : colors.gray[600];
  Chart.defaults.font.family = fonts.base;
  Chart.defaults.font.size = 13;

  Chart.defaults.layout = { padding: 0 };

  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.legend.position = "bottom";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.padding = 16;

  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.backgroundColor = colors.theme.primary;

  Chart.defaults.elements.line.tension = 0.4;
  Chart.defaults.elements.line.borderWidth = 4;
  Chart.defaults.elements.line.borderColor = colors.theme.primary;
  Chart.defaults.elements.line.backgroundColor = colors.transparent;
  Chart.defaults.elements.line.borderCapStyle = "round";

  Chart.defaults.elements.rectangle.backgroundColor = colors.theme.warning;

  Chart.defaults.elements.arc.backgroundColor = colors.theme.primary;
  Chart.defaults.elements.arc.borderColor =
    mode === "dark" ? colors.gray[800] : colors.white;
  Chart.defaults.elements.arc.borderWidth = 4;

  Chart.defaults.plugins.tooltip.enabled = true;
  Chart.defaults.plugins.tooltip.mode = "index";
  Chart.defaults.plugins.tooltip.intersect = false;

  // Scale defaults
  Chart.defaults.scales.linear.grid = {
    color: mode === "dark" ? colors.gray[900] : colors.gray[300],
    borderDash: [2],
    drawTicks: false,
    lineWidth: 0,
    zeroLineWidth: 0
  };
  Chart.defaults.scales.linear.ticks = {
    beginAtZero: true,
    padding: 10,
    callback: (value) => (value % 10 === 0 ? value : null)
  };

  Chart.defaults.scales.category.grid = {
    drawBorder: false,
    drawOnChartArea: false,
    drawTicks: false
  };
  Chart.defaults.scales.category.ticks = { padding: 20 };

  return Chart.defaults;
}

//
// Helper to merge options deeply
//
function parseOptions(parent, options) {
  for (const key in options) {
    if (typeof options[key] === "object" && options[key] !== null) {
      parseOptions(parent[key], options[key]);
    } else {
      parent[key] = options[key];
    }
  }
}

//
// Chart examples
//
const chartExample1 = {
  options: {
    scales: {
      y: {
        grid: {
          color: colors.gray[900],
          zeroLineColor: colors.gray[900]
        },
        ticks: {
          callback: (value) => (value % 10 === 0 ? `$${value}k` : null)
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y}k`
        }
      }
    }
  },
  data1: () => ({
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        backgroundColor: colors.theme.primary,
        data: [0, 20, 10, 30, 15, 40, 20, 60]
      }
    ]
  }),
  data2: () => ({
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        backgroundColor: colors.theme.primary,
        data: [0, 20, 5, 25, 10, 30, 15, 40]
      }
    ]
  })
};

const chartExample2 = {
  options: {
    scales: {
      y: {
        ticks: {
          callback: (value) => (value % 10 === 0 ? value : null)
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => context.parsed.y
        }
      }
    }
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        backgroundColor: colors.theme.warning,
        data: [25, 20, 30, 22, 17, 29],
        maxBarThickness: 10
      }
    ]
  }
};

export { chartOptions, parseOptions, chartExample1, chartExample2 };
