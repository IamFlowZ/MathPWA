# MathPWA - Scientific Calculator

[![Deploy to GitHub Pages](https://github.com/IamFlowZ/mathpwa/actions/workflows/deploy.yml/badge.svg)](https://github.com/IamFlowZ/mathpwa/actions/workflows/deploy.yml)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL%203.0-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

A powerful Progressive Web Application (PWA) providing scientific calculator functionality with graphing, statistics, and calculation history.

**Live Demo**: [https://IamFlowZ.github.io/mathpwa/](https://IamFlowZ.github.io/mathpwa/)

## Features

- **Scientific Calculator**: Full scientific calculator with trigonometric, logarithmic, and exponential functions
- **Basic Operations**: Addition, subtraction, multiplication, division, and more
- **Statistical Analysis**: Mean, median, mode, standard deviation, variance, and sum calculations
- **Function Graphing**: Interactive graph plotting with customizable ranges
- **Calculation History**: Persistent history with the ability to reuse previous calculations
- **Progressive Web App**: Install on any device and use offline
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Technology Stack

- **Framework**: [Preact](https://preactjs.com/) - Fast 3kB alternative to React
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast frontend tooling
- **Math Engine**: [Math.js](https://mathjs.org/) - Extensive math library
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - Zero-config PWA plugin
- **Language**: TypeScript with strict mode

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/IamFlowZ/mathpwa.git
cd mathpwa

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

The development server will start at `http://localhost:5173/`

### Building for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

The production build will be output to the `dist/` directory.

## Deployment

This project is configured for automatic deployment to GitHub Pages. Every push to the `main` branch triggers a GitHub Actions workflow that:

1. Runs all tests
2. Builds the production bundle
3. Deploys to GitHub Pages

### Manual Deployment

To deploy manually:

```bash
# Build with production settings
NODE_ENV=production npm run build

# The dist/ folder is ready for deployment
```

## Project Structure

```
mathpwa/
├── src/
│   ├── components/        # Preact components
│   │   ├── Calculator.tsx # Main calculator component
│   │   ├── Display.tsx    # Calculator display
│   │   ├── GraphView.tsx  # Graphing interface
│   │   ├── History.tsx    # Calculation history
│   │   ├── Keypad.tsx     # Calculator keypad
│   │   └── StatisticsView.tsx # Statistics interface
│   ├── hooks/             # Custom Preact hooks
│   │   ├── useCalculator.ts  # Calculator state management
│   │   ├── useGraph.ts       # Graph state management
│   │   └── useHistory.ts     # History persistence
│   ├── types/             # TypeScript type definitions
│   │   └── calculator.ts
│   ├── utils/             # Pure utility functions
│   │   ├── graphing.ts       # Canvas rendering logic
│   │   ├── math-engine.ts    # Math expression evaluation
│   │   └── statistics.ts     # Statistical calculations
│   ├── app.tsx            # Root component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project metadata
```

## Math Engine

### Logarithm Functions

The calculator translates user-friendly syntax to math.js functions:

- `log(x)` → `log10(x)` (base 10 logarithm)
- `ln(x)` → `log(x)` (natural logarithm)
- `log10(x)` and `log2(x)` → passed through unchanged

### Implicit Multiplication

The calculator supports implicit multiplication:

- `2π` → `2*pi`
- `3sin(x)` → `3*sin(x)`
- `5(2+3)` → `5*(2+3)`

Protected function names like `log10` and `log2` are not split during preprocessing.

### Angle Units

- **DEG mode**: Trigonometric functions accept degrees, inverse functions return degrees
- **RAD mode**: Standard radian input/output
- Conversion is handled via scope overrides in the evaluation engine

## PWA Features

- **Service Worker**: Automatically updates in the background
- **Offline Support**: Full functionality after first load
- **Install Prompt**: Add to home screen on mobile devices
- **Asset Caching**: All static resources are precached
- **Fast Loading**: Optimized bundle splitting with math.js in separate chunk

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Preact](https://preactjs.com/)
- Powered by [Math.js](https://mathjs.org/)
- Icons and PWA support by [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
