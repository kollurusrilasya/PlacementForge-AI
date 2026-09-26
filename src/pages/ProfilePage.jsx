import React from 'react'
import { PageHeader, LightCard, Badge, PrimaryButton, Input } from '../components/common'
import { useUser } from '../context/UserContext'
import { useToast } from '../context/ToastContext'

export function ProfilePage() {
  const { user } = useUser()
  const toast = useToast()

  const handleSave = (e) => {
    e.preventDefault()
    toast.show('Profile updated successfully (Mock)', { type: 'success' })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Candidate Profile"
        subtitle="Manage your placement academic credentials, target packages, and verified skills."
        breadcrumbs={['Account', 'Profile']}
        badge={<Badge variant="success" dot>Profile Verified</Badge>}
      />

      <form onSubmit={handleSave} className="space-y-6">
        <LightCard className="p-6 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-[#E8E8E5]">
            <div className="w-14 h-14 rounded-full bg-[#111111] text-white flex items-center justify-center font-bold text-xl">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#111111]">{user?.name}</h2>
              <p className="text-xs text-[#6B6B6B]">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Input label="Full Name" defaultValue={user?.name} />
            <Input label="Email Address" defaultValue={user?.email} />
            <Input label="Current Institution" defaultValue={user?.college} />
            <Input label="Degree & Branch" defaultValue={user?.branch} />
            <Input label="Target Job Role" defaultValue={user?.targetRole} />
            <Input label="Target Compensation (CTC)" defaultValue={user?.targetPackage} />
          </div>

          <div className="pt-4 flex justify-end">
            <PrimaryButton type="submit">Save Profile Changes</PrimaryButton>
          </div>
        </LightCard>
      </form>
    </div>
  )
}

export default ProfilePage
