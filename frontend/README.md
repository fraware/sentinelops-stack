
# Proof Verification Dashboard

A modern React application for monitoring and exploring proof verification results in real-time. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- **Real-time Dashboard**: System health monitoring with auto-refresh
- **Proof Explorer**: Search and filter proof verification results
- **Audit Bundle Generation**: Export compliance reports in multiple formats
- **Kafka Connectivity**: Live status monitoring of message bus
- **Agent Updates**: OTA update management for verification agents

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query, Apollo GraphQL
- **Routing**: React Router DOM
- **Testing**: Vitest, React Testing Library
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd proof-verification-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── __tests__/      # Component tests
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configs
├── pages/              # Application pages/routes
└── test/               # Test setup and utilities
```

## Key Components

### Dashboard
- **SystemHealthCard**: Displays aggregate system status
- **RecentProofsTable**: Shows latest proof verification results
- **ProofTrendChart**: Visualizes PASS/FAIL trends over time
- **KafkaStatusBanner**: Real-time Kafka connectivity status

### Proof Explorer
- **Search & Filtering**: Debounced search with date range filters
- **ProofExplorerTable**: Sortable table with keyboard navigation
- **ProofDetailsDrawer**: Full JSON view with copy functionality

### Features
- **Debounced Inputs**: 300ms debounce on all text inputs
- **Keyboard Navigation**: Arrow keys, Enter, Escape support
- **Empty States**: Contextual illustrations for no data/errors
- **Auto-refresh**: 15-second intervals for live data

## API Integration

The application connects to a GraphQL API for proof data and REST endpoints for:
- `/export/{format}` - Audit bundle generation
- `/stream/status` - WebSocket for Kafka status
- `/ota/manifest` - Agent update information

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Component rendering and interactions
- Custom hooks functionality
- User interface behaviors
- Error handling scenarios

## Deployment

Build for production:
```bash
npm run build
```

The `dist` folder contains the production-ready application.

## Development Guidelines

- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement responsive design with Tailwind CSS
- Write tests for new components and utilities
- Use semantic HTML and ARIA labels for accessibility

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License.
