import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Lock, Mail, User as UserIcon } from 'lucide-react'
import { Modal } from './Modal'
import { Input } from './Input'
import { PrimaryButton } from './Button'
import { useUser } from '../../context/UserContext'
import { useToast } from '../../context/ToastContext'

export function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const { updateUser } = useUser()
  const toast = useToast()
  const navigate = useNavigate()

  const handleAuth = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (tab === 'register' && name) {
        updateUser({ name, email })
      }
      toast.show(
        tab === 'login'
          ? 'Welcome back to Placement Forge AI'
          : 'Account created successfully',
        { type: 'success' }
      )
      onClose()
      navigate('/dashboard')
    }, 450)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.show('Signed in as Demo Student (Sampath Srinivas)', { type: 'forge' })
      onClose()
      navigate('/dashboard')
    }, 350)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      className="p-0 overflow-hidden"
    >
      <div className="p-7">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center mx-auto mb-3 shadow-subtle">
            <Sparkles className="w-5 h-5 text-[#D95B14]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#111111]">
            Placement Forge AI
          </h2>
          <p className="text-xs text-[#6B6B6B] mt-1">
            {tab === 'login'
              ? 'Sign in to access your placement command center'
              : 'Create your student account to begin preparation'}
          </p>

          {/* Tab Selector */}
          <div className="flex rounded-[10px] bg-[#F4F4F1] p-1 mt-4 border border-[#E8E8E5]">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#111111] shadow-subtle'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#111111] shadow-subtle'
                  : 'text-[#6B6B6B] hover:text-[#111111]'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Demo Fast Login Pill */}
        <div className="mb-5 p-3 rounded-[12px] bg-[#FFF5EE] border border-[#FCD6BF] flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[#D95B14]">Fast Demo Access</p>
            <p className="text-[11px] text-[#6B6B6B]">Instant preloaded student profile</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs font-semibold px-2.5 py-1 rounded-[8px] bg-[#D95B14] text-white hover:bg-[#BF4D0C] transition-colors"
          >
            One-Click Demo
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-3.5">
          {tab === 'register' && (
            <Input
              label="Full Name"
              placeholder="e.g. Sampath Srinivas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={UserIcon}
              required
            />
          )}

          <Input
            label="College / Personal Email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <PrimaryButton
            type="submit"
            isLoading={loading}
            className="w-full mt-2"
          >
            {tab === 'login' ? 'Sign In' : 'Create Student Account'}
          </PrimaryButton>
        </form>

        <p className="text-[11px] text-center text-[#8E8E8A] mt-4">
          By signing in, you access Placement Forge AI in local demo mode.
        </p>
      </div>
    </Modal>
  )
}

export default AuthModal
