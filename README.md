# Deal or No Deal 🎲

A faithful recreation of the classic TV game show "Deal or No Deal" built with modern web technologies. Test your luck and strategy in this exciting game of chance!

## 🎮 How to Play

1. **Start the Game**: Click "Start Game" to begin
2. **Select Your Box**: Choose one box from the 26 available - this will be your box
3. **Open Boxes**: Each round, open the required number of boxes to reveal money values
4. **Banker's Offer**: After each round, the banker will make an offer based on remaining values
5. **Deal or No Deal**: Decide whether to accept the banker's offer or continue playing
6. **Final Reveal**: When only a few boxes remain, see what's in your chosen box!

## 🚀 Features

- **Authentic Gameplay**: Follows traditional Deal or No Deal TV show rules
- **26 Money Values**: From 1¢ to $1,000,000 - original US/UK show amounts
- **Smart Banker Algorithm**: Realistic offers based on remaining box values
- **Beautiful Interface**: Custom SVG graphics with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility First**: Full keyboard navigation and screen reader support
- **Visual Feedback**: Clear indicators for eliminated, remaining, and your box
- **Complete Game Flow**: Start, play, deal/no deal decisions, and game over states

## 🔧 CI/CD & Quality Assurance

This project uses a **single consolidated GitHub Actions workflow** (`main.yml`) that handles all aspects of continuous integration and deployment:

### 🚀 Unified CI/CD Pipeline

**✅ Quality Gate (All PRs & Pushes)**
- **ESLint**: Code quality and style enforcement
- **TypeScript**: Type safety validation
- **Jest Tests**: Unit & integration test execution
- **Coverage Reporting**: Comprehensive test coverage metrics

**📦 Build Process**
- **Production Build**: Vite build with optimizations
- **Artifact Storage**: Build files stored for 30 days
- **Build Validation**: Ensures deployable artifacts

**🌍 Automated Deployment**
- **GitHub Pages**: Automatic deployment from `main` branch
- **Zero-downtime**: Seamless production updates
- **Environment Protection**: Dedicated Pages environment

### 💬 Smart PR Comments

For every pull request, the workflow automatically comments with:
- ✅/❌ **Status overview** for all quality checks
- 📊 **Coverage metrics** with color-coded badges (🟢 Excellent ≥80%, 🟡 Good ≥60%, 🔴 Needs improvement <60%)
- 🔍 **Detailed failure reports** with expandable error logs
- 🔄 **Updates on new commits** (replaces previous comment)

### 🎯 Quality Standards

- **Test Coverage**: Target 80%+ for all metrics
- **Type Safety**: 100% TypeScript compliance required
- **Code Quality**: ESLint with strict rules (max 1 warning allowed)
- **Build Success**: Production builds must complete successfully

### ⚡ Performance Features

- **Smart Concurrency**: Cancels previous runs on new commits
- **Conditional Steps**: Only deploys from `main` branch pushes
- **Artifact Caching**: Speeds up builds with dependency caching
- **Parallel Jobs**: Test and build stages run efficiently

This streamlined approach ensures **consistent quality**, **fast feedback**, and **reliable deployments** while minimizing GitHub Actions minutes usage.

## 🛠 Tech Stack

- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS Modules** - Component-scoped styling
- **Jest + React Testing Library** - Comprehensive testing
- **GitHub Actions** - Automated CI/CD
- **GitHub Pages** - Free hosting

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/kylehodgetts/deal-or-no-deal.git

# Navigate to project directory
cd deal-or-no-deal

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173/deal-or-no-deal/ in your browser
```

## 🧪 Development

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗 Architecture

### Component Structure
```
src/
├── components/
│   ├── Box/              # Individual game box with SVG graphics
│   ├── GameBoard/        # 26-box grid layout
│   ├── GameControls/     # Start/Deal/No Deal controls
│   └── MoneyBoard/       # Money values display
├── hooks/
│   └── useGame.tsx       # Game state management
├── types/
│   └── game.ts           # TypeScript interfaces
└── utils/
    └── gameLogic.ts      # Game constants and algorithms
```

### State Management
- **React Context + useReducer** for centralized game state
- **Type-safe actions** for all game transitions
- **Helper functions** for game logic calculations

### Testing Strategy
- **78 comprehensive tests** covering all components and logic
- **100% TypeScript coverage** for type safety
- **Accessibility testing** for inclusive design
- **Integration tests** for complete game flows

## 🎯 Game Logic

### Money Values
26 boxes containing values from the original TV show:
- **Low**: 1¢, $1, $5, $10, $25, $50, $75, $100, $200, $300, $400, $500, $750
- **High**: $1K, $5K, $10K, $25K, $50K, $75K, $100K, $200K, $300K, $400K, $500K, $750K, $1M

### Banker Algorithm
The banker's offer is calculated using:
- **Base calculation**: 85-90% of average remaining values
- **Risk adjustment**: Lower offers when high values remain
- **Round adjustment**: Slightly higher offers in later rounds
- **Psychology factors**: Realistic variation to match TV show

### Round Structure
Traditional Deal or No Deal progression:
- Round 1: Open 6 boxes
- Round 2: Open 5 boxes
- Round 3: Open 4 boxes
- Round 4: Open 3 boxes
- Subsequent: Open 2-1 boxes until final decision

## 🚀 Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions:

1. **Push to main branch** triggers deployment
2. **Tests run** to ensure code quality
3. **Build process** creates optimized production bundle
4. **Deploy to GitHub Pages** makes it live

Visit the live app: [https://kylehodgetts.github.io/deal-or-no-deal/](https://kylehodgetts.github.io/deal-or-no-deal/)

## 🧪 Testing

```bash
# Run all tests
npm test

# Test with coverage report
npm test -- --coverage

# Run specific test file
npm test Box.test.tsx

# Run tests in watch mode for development
npm run test:watch
```

Current test coverage: **78 tests passing** across all components and game logic.

## 🎨 Customization

The game is built with customization in mind:

- **CSS Modules** make styling changes safe and scoped
- **TypeScript interfaces** make adding features type-safe
- **Component architecture** allows easy feature additions
- **Configurable constants** in `utils/gameLogic.ts`

## 📱 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Original "Deal or No Deal" TV show for the game concept
- React and TypeScript communities for excellent documentation
- Vite team for the fantastic build tool
- GitHub for free hosting via GitHub Pages

---

**Built with ❤️ by Kyle Hodgetts**

*Deal or No Deal? The choice is yours!* 🎲
