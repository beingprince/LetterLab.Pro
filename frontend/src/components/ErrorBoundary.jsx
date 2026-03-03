import React from 'react';
import ErrorPage from '../pages/ErrorPage';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <ErrorPage code={500} message="An unexpected error occurred in the application." />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
