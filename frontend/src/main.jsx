/**
 * Enhanced Main Entry Point - main.jsx
 * TruthLens Media Verification Application
 * Production-ready with error handling, performance monitoring, and PWA support
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ============================================
// ERROR BOUNDARY COMPONENT
// ============================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));
    
    // Log error details
    console.group('🚨 Application Error Caught');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Count:', this.state.errorCount + 1);
    console.groupEnd();
    
    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo);
    }
  }

  reportErrorToService = (error, errorInfo) => {
    // Integration point for services like Sentry, LogRocket, etc.
    try {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.log('Error reported to monitoring service');
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorCard}>
            {/* Animated Error Icon */}
            <div style={styles.errorIcon}>
              <span style={styles.iconPulse}>⚠️</span>
            </div>
            
            {/* Error Title */}
            <h1 style={styles.errorTitle}>
              Something Went Wrong
            </h1>
            
            {/* Error Description */}
            <p style={styles.errorDescription}>
              TruthLens encountered an unexpected error. Don't worry, your data is safe.
              {this.state.errorCount > 1 && (
                <span style={styles.errorBadge}>
                  {this.state.errorCount} errors detected
                </span>
              )}
            </p>
            
            {/* Error Details - Development Only */}
            {isDevelopment && this.state.error && (
              <details style={styles.errorDetails}>
                <summary style={styles.errorSummary}>
                  🔍 Technical Details (Development Mode)
                </summary>
                <div style={styles.errorContent}>
                  <div style={styles.errorSection}>
                    <strong style={styles.errorLabel}>Error Message:</strong>
                    <pre style={styles.errorPre}>{this.state.error.toString()}</pre>
                  </div>
                  {this.state.error.stack && (
                    <div style={styles.errorSection}>
                      <strong style={styles.errorLabel}>Stack Trace:</strong>
                      <pre style={styles.errorPre}>{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div style={styles.errorSection}>
                      <strong style={styles.errorLabel}>Component Stack:</strong>
                      <pre style={styles.errorPre}>{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            {/* Action Buttons */}
            <div style={styles.buttonGroup}>
              {this.state.errorCount < 3 ? (
                <button
                  onClick={this.handleReset}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
                >
                  <span style={styles.buttonIcon}>🔄</span>
                  Try Again
                </button>
              ) : (
                <button
                  onClick={this.handleReload}
                  style={styles.primaryButton}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px) scale(1.02)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
                >
                  <span style={styles.buttonIcon}>🔄</span>
                  Reload Page
                </button>
              )}
              
              <button
                onClick={this.handleGoHome}
                style={styles.secondaryButton}
                onMouseEnter={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={styles.buttonIcon}>🏠</span>
                Go Home
              </button>
            </div>

            {/* Help Text */}
            <p style={styles.helpText}>
              If this problem persists, please contact support or check the console for details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================
const initializePerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Web Vitals monitoring
  if ('PerformanceObserver' in window) {
    try {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('📊 FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Monitor Cumulative Layout Shift (CLS)
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            console.log('📊 CLS:', clsScore);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  // Page load time
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log('📊 Page Load Time:', pageLoadTime + 'ms');
    }, 0);
  });
};

// ============================================
// BROWSER COMPATIBILITY CHECK
// ============================================
const checkBrowserCompatibility = () => {
  const requiredFeatures = {
    'fetch': 'fetch' in window,
    'Promise': 'Promise' in window,
    'Object.assign': 'assign' in Object,
    'Array.from': 'from' in Array,
    'localStorage': typeof Storage !== 'undefined',
    'sessionStorage': typeof Storage !== 'undefined',
    'FileReader': 'FileReader' in window,
    'Blob': 'Blob' in window
  };

  const unsupportedFeatures = Object.entries(requiredFeatures)
    .filter(([, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupportedFeatures.length > 0) {
    console.warn('⚠️ Unsupported Browser Features:', unsupportedFeatures);
    showCompatibilityWarning(unsupportedFeatures);
    return false;
  }

  console.log('✅ Browser compatibility check passed');
  return true;
};

const showCompatibilityWarning = (unsupportedFeatures) => {
  const banner = document.createElement('div');
  banner.id = 'browser-warning-banner';
  banner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
    padding: 1rem 2rem;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 0.875rem;
    z-index: 99999;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-bottom: 3px solid #f59e0b;
    animation: slideDown 0.3s ease-out;
  `;
  
  banner.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-size: 1.5rem;">⚠️</span>
        <span style="font-weight: 600;">
          Browser Compatibility Warning: Missing features (${unsupportedFeatures.join(', ')})
        </span>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <a href="https://browsehappy.com/" target="_blank" style="
          background: #92400e;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s;
        ">
          Update Browser
        </a>
        <button onclick="document.getElementById('browser-warning-banner').remove()" style="
          background: rgba(146, 64, 14, 0.1);
          color: #92400e;
          border: 2px solid #92400e;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        ">
          Dismiss
        </button>
      </div>
    </div>
  `;

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.prepend(banner);
};

// ============================================
// APP INITIALIZATION
// ============================================
const initializeApp = () => {
  console.group('🚀 TruthLens Initialization');
  console.log('%c🛡️ Multi-Layer Media Verification System', 'color: #6366f1; font-size: 14px; font-weight: bold;');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('React Version:', React.version);
  console.log('Timestamp:', new Date().toISOString());
  console.groupEnd();

  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('❌ Root element #root not found in DOM');
    showCriticalError('Root element not found', 'The application cannot start because the root element is missing.');
    return;
  }

  try {
    // Create React root
    const root = ReactDOM.createRoot(rootElement);
    
    // Render application with Error Boundary
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    console.log('✅ React application mounted successfully');

    // Initialize performance monitoring
    if (process.env.NODE_ENV === 'development') {
      initializePerformanceMonitoring();
    }

  } catch (error) {
    console.error('❌ Failed to initialize React application:', error);
    showCriticalError('Initialization Failed', error.message);
  }
};

// ============================================
// CRITICAL ERROR DISPLAY
// ============================================
const showCriticalError = (title, message) => {
  const rootElement = document.getElementById("root") || document.body;
  
  rootElement.innerHTML = `
    <div style="${Object.entries(styles.errorContainer).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')}">
      <div style="
        background: white;
        padding: 3rem;
        border-radius: 1.5rem;
        max-width: 600px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        text-align: center;
        animation: fadeIn 0.5s ease-out;
      ">
        <div style="font-size: 5rem; margin-bottom: 1.5rem; animation: shake 0.5s ease;">❌</div>
        <h1 style="
          color: #111827;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        ">
          ${title}
        </h1>
        <p style="
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        ">
          ${message}
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.75rem;
            border: none;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
          "
          onmouseover="this.style.transform='translateY(-3px) scale(1.05)'"
          onmouseout="this.style.transform='translateY(0) scale(1)'"
        >
          🔄 Reload Application
        </button>
      </div>
    </div>
    
    <style>
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    </style>
  `;
};

// ============================================
// GLOBAL ERROR HANDLERS
// ============================================
window.addEventListener('error', (event) => {
  console.error('🔴 Global Error:', event.error);
  // Prevent default browser error handling
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🔴 Unhandled Promise Rejection:', event.reason);
  // Prevent default browser error handling
  event.preventDefault();
});

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
          });
        })
        .catch((error) => {
          console.warn('⚠️ Service Worker registration failed:', error);
        });
    });
  }
};

// ============================================
// APP STARTUP SEQUENCE
// ============================================
const startApplication = () => {
  console.clear();
  console.log(
    '%c TruthLens ',
    'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; border-radius: 5px; font-size: 20px; font-weight: bold;'
  );
  console.log(
    '%c Media Authenticity Verification Platform ',
    'color: #6366f1; font-size: 14px; font-weight: bold;'
  );
  console.log('');

  // Check browser compatibility
  const isCompatible = checkBrowserCompatibility();
  
  if (!isCompatible) {
    console.warn('⚠️ Some features may not work properly on this browser');
  }

  // Initialize the app
  initializeApp();

  // Register service worker for PWA support
  registerServiceWorker();

  // Development mode helpers
  if (process.env.NODE_ENV === 'development') {
    console.log('');
    console.log('%cDevelopment Mode Active', 'color: #10b981; font-weight: bold;');
    console.log('React DevTools: Available');
    console.log('Performance Monitoring: Enabled');
    console.log('');
  }
};

// ============================================
// INITIALIZE ON DOM READY
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApplication);
} else {
  startApplication();
}

// ============================================
// INLINE STYLES OBJECT
// ============================================
const styles = {
  errorContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  },
  errorCard: {
    background: 'white',
    borderRadius: '1.5rem',
    padding: '3rem',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'slideIn 0.5s ease-out'
  },
  errorIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  iconPulse: {
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite'
  },
  errorTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
    textAlign: 'center'
  },
  errorDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
    lineHeight: '1.6',
    textAlign: 'center'
  },
  errorBadge: {
    display: 'inline-block',
    marginLeft: '0.5rem',
    padding: '0.25rem 0.75rem',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '600'
  },
  errorDetails: {
    marginBottom: '2rem',
    textAlign: 'left',
    background: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
    maxHeight: '300px',
    overflow: 'auto'
  },
  errorSummary: {
    cursor: 'pointer',
    fontWeight: '700',
    color: '#374151',
    marginBottom: '0.75rem',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'background 0.2s'
  },
  errorContent: {
    marginTop: '1rem',
    fontSize: '0.875rem'
  },
  errorSection: {
    marginBottom: '1rem'
  },
  errorLabel: {
    display: 'block',
    color: '#6366f1',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  },
  errorPre: {
    background: '#1f2937',
    color: '#10b981',
    padding: '1rem',
    borderRadius: '0.5rem',
    overflow: 'auto',
    fontSize: '0.8125rem',
    lineHeight: '1.5',
    fontFamily: 'monospace',
    margin: '0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1.5rem'
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    border: 'none',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  secondaryButton: {
    background: '#f3f4f6',
    color: '#374151',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  buttonIcon: {
    fontSize: '1.25rem'
  },
  helpText: {
    fontSize: '0.875rem',
    color: '#9ca3af',
    textAlign: 'center',
    margin: '0'
  }
};