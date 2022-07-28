import { FallbackProps } from "react-error-boundary";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div>
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
        </div>
    )
}

export default ErrorFallback