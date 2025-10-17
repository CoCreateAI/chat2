"use client"

import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { User, Settings, LogOut, Upload } from 'lucide-react'

export function UserMenu() {
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleSettings = () => {
    setIsOpen(false)
    router.push('/settings')
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 w-10 rounded-full p-0 relative"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[var(--color-secondary-custom,oklch(0.97_0_0))] flex items-center justify-center">
                <User className="h-5 w-5 text-[var(--color-primary-custom,oklch(0.205_0_0))]" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="end">
          <div className="flex flex-col">
            {/* User Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-[var(--color-secondary-custom,oklch(0.97_0_0))] flex items-center justify-center">
                      <User className="h-6 w-6 text-[var(--color-primary-custom,oklch(0.205_0_0))]" />
                    </div>
                  )}
                  <button
                    onClick={triggerFileInput}
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-[var(--color-primary-custom,oklch(0.205_0_0))] hover:opacity-90 flex items-center justify-center text-white shadow-md transition-opacity"
                    title="Alterar foto"
                  >
                    <Upload className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={handleSettings}
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
