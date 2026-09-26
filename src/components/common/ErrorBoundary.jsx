import React from 'react'
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Placement Forge AI Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoDashboard = () => {
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E8E8E5] rounded-[16px] p-8 shadow-card text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-[#111111]">
                Something went wrong
              </h2>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                An unexpected error occurred while rendering this module. You can try reloading this component or return to the main dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#FAFAF9] border border-[#E8E8E5] rounded-[8px] text-[11px] font-mono text-zinc-600 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[#111111] text-white hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-subtle cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              <button
                onClick={this.handleGoDashboard}
                className="w-full sm:w-auto px-4 py-2.5 rounded-[10px] text-xs font-semibold bg-[#FAFAF9] text-[#111111] border border-[#E8E8E5] hover:bg-[#F0F0EC] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#6B6B6B]" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
