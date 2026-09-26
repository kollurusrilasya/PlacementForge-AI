import React from 'react'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '../components/common'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 text-center">
      <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D95B14]">
        404 — Not Found
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-[#111111] mt-2">
        Page does not exist
      </h1>
      <p className="text-sm text-[#6B6B6B] mt-2 max-w-sm">
        The placement path or page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <PrimaryButton>Return to Dashboard</PrimaryButton>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
