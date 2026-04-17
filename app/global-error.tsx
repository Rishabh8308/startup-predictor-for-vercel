"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3 text-white">Something went wrong!</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            We encountered an unexpected error while trying to process your request. 
            The ML service might be temporarily unavailable.
          </p>
          
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl shadow-lg transition-all border border-cyan-400/30"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
