# Frontend - VeriMedia React Application

The frontend component of VeriMedia, built with React 19 and Vite for a modern, responsive user interface.

## Overview

This React application provides the user interface for the VeriMedia deepfake detection platform, featuring:
- Media upload and verification
- Real-time analysis results
- Cryptographic watermarking interface
- Responsive design with dark theme

## Tech Stack

- **React 19** - Component-based UI framework
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Router** - Client-side routing

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg                 # Application favicon
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Header.jsx         # Application header with navigation
│   │   │   └── Tabs.jsx           # Tab navigation component
│   │   ├── verify/
│   │   │   ├── UploadBox.jsx      # File upload interface
│   │   │   ├── VerifyInfoCards.jsx # Information display cards
│   │   │   ├── TrustScoreMeter.jsx # Trust score visualization
│   │   │   ├── VerificationResults.jsx # Analysis results display
│   │   │   └── LayerAnalysis.jsx  # Layer-by-layer analysis
│   │   ├── watermark/
│   │   │   └── WatermarkPanel.jsx # Watermarking interface
│   │   └── about/
│   │       └── SwissCheeseModel.jsx # About page component
│   ├── pages/
│   │   └── VeriMedia.jsx          # Main application page
│   ├── services/
│   │   └── api.js                 # API communication utilities
│   ├── utils/
│   │   └── mockAnalyzer.js        # Mock data for development
│   ├── hooks/
│   │   └── useMediaVerification.js # Custom React hooks
│   ├── App.jsx                    # Main application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global styles and utilities
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── postcss.config.js              # PostCSS configuration
├── README.md                      # This file
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite configuration
```

## Key Features

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Theme**: Modern dark gradient background with glassmorphism effects
- **Intuitive Navigation**: Tab-based interface for different functionalities

### Media Verification
- **Drag & Drop Upload**: Support for images and videos
- **Real-time Preview**: Instant display of uploaded content
- **Progress Indicators**: Loading states during analysis
- **Detailed Results**: Trust scores, confidence levels, and layer analysis

### Watermarking
- **C2PA Integration**: Cryptographic watermark embedding
- **File Processing**: Automatic metadata injection
- **Download Support**: Processed files with embedded watermarks

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```
Starts the development server on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Environment Variables

Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://localhost:5000/api
```

## API Integration

The frontend communicates with the backend API through the `api.js` service file, which handles:
- File uploads with FormData
- JSON responses for analysis results
- Error handling and user feedback

## Component Architecture

- **Pages**: Top-level route components
- **Components**: Reusable UI elements organized by feature
- **Services**: External API communication
- **Utils**: Helper functions and mock data
- **Hooks**: Custom React hooks for state management

## Styling

- **Tailwind CSS**: Utility-first approach for rapid UI development
- **Custom CSS**: Additional styles in `index.css`
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Use TypeScript for new components (if applicable)
3. Test on multiple browsers
4. Update documentation for new features

## Related Documentation

- [Main Project README](../README.md)
- [Backend API](../backend/README.md)
- [AI Service](../ai-service/README.md)

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
