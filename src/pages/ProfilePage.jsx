
import React, { useEffect, useState } from 'react'
import { PageHeader, LightCard, Badge, PrimaryButton, Input } from '../components/common'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'
import { apiRequest } from '../services/api'

export function ProfilePage() {
  const { user, updateUser } = useUser()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    branch: '',
    targetRole: '',
    targetPackage: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch profile details when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/api/profile')

        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          college: data.user.college || '',
          branch: data.user.branch || '',
          targetRole: data.user.targetRole || '',
          targetPackage: data.user.targetPackage || '',
        })

        updateUser(data.user)
      } catch (error) {
        toast.show(error.message || 'Failed to load profile', {
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Update individual form fields
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Save profile details
  const handleSave = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      const data = await apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      })

      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        college: data.user.college || '',
        branch: data.user.branch || '',
        targetRole: data.user.targetRole || '',
        targetPackage: data.user.targetPackage || '',
      })

      updateUser(data.user)

      toast.show('Profile updated successfully!', {
        type: 'success',
      })
    } catch (error) {
      toast.show(error.message || 'Failed to update profile', {
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Candidate Profile"
        subtitle="Manage your placement academic credentials, target packages, and verified skills."
        breadcrumbs={['Account', 'Profile']}
        badge={<Badge variant="success" dot>Profile Verified</Badge>}
      />

      {loading ? (
        <LightCard className="p-6">
          <p className="text-sm text-[#6B6B6B]">Loading profile...</p>
        </LightCard>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <LightCard className="p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#E8E8E5]">
              <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xl">
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#111111]">
                  {formData.name}
                </h2>
                <p className="text-xs text-[#6B6B6B]">
                  {formData.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />

              <Input
                label="Email Address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />

              <Input
                label="Current Institution"
                value={formData.college}
                onChange={(e) => handleChange('college', e.target.value)}
              />

              <Input
                label="Degree & Branch"
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.target.value)}
              />

              <Input
                label="Target Job Role"
                value={formData.targetRole}
                onChange={(e) => handleChange('targetRole', e.target.value)}
              />

              <Input
                label="Target Compensation (CTC)"
                value={formData.targetPackage}
                onChange={(e) => handleChange('targetPackage', e.target.value)}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <PrimaryButton type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </PrimaryButton>
            </div>
          </LightCard>
        </form>
      )}
    </div>
  )
}

export default ProfilePage
