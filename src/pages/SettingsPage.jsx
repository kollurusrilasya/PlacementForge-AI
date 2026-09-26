import React from 'react'
import { PageHeader, LightCard, PrimaryButton, Select } from '../components/common'
import { useToast } from '../context/ToastContext'

export function SettingsPage() {
  const toast = useToast()

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage platform preferences, simulation speeds, and privacy options."
        breadcrumbs={['Account', 'Settings']}
      />

      <LightCard className="p-6 space-y-5">
        <Select
          label="Default Interview Video Avatar"
          options={[
            { value: 'female', label: 'Female AI Interviewer (Sarah)' },
            { value: 'male', label: 'Male AI Interviewer (David)' },
          ]}
          defaultValue="female"
        />

        <Select
          label="Live Speech Recognition Language"
          options={[
            { value: 'en-US', label: 'English (United States)' },
            { value: 'en-IN', label: 'English (India)' },
            { value: 'en-GB', label: 'English (United Kingdom)' },
          ]}
          defaultValue="en-IN"
        />

        <div className="pt-4 flex justify-end">
          <PrimaryButton onClick={() => toast.show('Preferences saved (Mock)', { type: 'success' })}>
            Update Preferences
          </PrimaryButton>
        </div>
      </LightCard>
    </div>
  )
}

export default SettingsPage
