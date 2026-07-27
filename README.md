# ⚡ ZERO GRAVITY — The Bikers Destination

> Premium Superbike Modification Studio, Custom Builds & Accessories Platform.

**ZERO GRAVITY** is a state-of-the-art web application engineered for motorcycle enthusiasts and superbike owners. Built using **TanStack Start**, **React 19**, **Vite**, and **Tailwind CSS v4**, the application delivers a high-performance, dark-themed, glassmorphic UI with dynamic micro-animations, interactive booking, and direct WhatsApp commerce integration.

---

## ✨ Key Features

- 🏍️ **Custom Builds Showcase**: Interactive display of bespoke cafe racers, trackers, and streetfighter modifications with high-resolution imagery.
- ⚙️ **Services & Upgrades**: Comprehensive catalog for performance modifications, ECU remapping, exhaust upgrades, suspension tuning, and routine diagnostics.
- 🛠️ **Accessories Store & Cart**: Browse premium motorcycle gear, parts, and accessories with real-time cart state management.
- 💬 **Direct WhatsApp Commerce**: Single-click checkout enabling customers to book appointments or order accessories directly via WhatsApp.
- 🎨 **Modern Futuristic Aesthetic**: Dark-mode canvas with neon accents, dynamic hero animations, and fluid transitions powered by `motion`.
- ⚡ **Lightning Fast SSR Architecture**: Powered by TanStack Start, React 19, Vite 8, and TypeScript.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/latest) (SSR + File-based Routing)
- **UI Core**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom CSS Animations
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **UI Components**: Radix UI Primitives, Shadcn UI patterns

---

## 📁 Project Structure

```
Zero-Gravity/
└── zero_gravity/
    ├── src/
    │   ├── assets/             # High-resolution bike images & branding assets
    │   ├── components/         # Reusable UI components (Nav, Hero, Cart, Services, Footer)
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Accessories catalog, cart state & WhatsApp helpers
    │   └── routes/             # TanStack file-based routes
    │       ├── index.tsx       # Main landing page (Hero, Services, Showcase, FAQ)
    │       ├── accessories.tsx # Accessories store page
    │       ├── book-service.tsx# Interactive service booking page
    │       └── cart.tsx        # Cart & order review view
    ├── package.json
    ├── tsconfig.json
    └── vite.config.ts
```

---

## 🚀 Quick Start

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** installed on your machine.

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MadhukarKS/Zero-Gravity.git
   cd Zero-Gravity/zero_gravity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`.

---

## 📜 Available Scripts

Inside the `zero_gravity` project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement |
| `npm run build` | Builds the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run format` | Formats code with Prettier |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
