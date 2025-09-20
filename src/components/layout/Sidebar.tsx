import { NavLink } from 'react-router-dom'
import { X, Home, Calendar, Users, FileText, Settings } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: [1, 2, 3] // All roles
    },
    {
      name: 'My Leave Requests',
      href: '/leave-requests',
      icon: Calendar,
      roles: [3] // Employees only
    },
    {
      name: 'Team Requests',
      href: '/team-requests',
      icon: FileText,
      roles: [1, 2] // Admins and Managers
    },
    {
      name: 'All Requests',
      href: '/all-requests',
      icon: FileText,
      roles: [1] // Admins only
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: [1, 2] // Admins and Managers
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: [1] // Admins only
    }
  ]

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.roleId || 0)
  )

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent navigation={filteredNavigation} onClose={onClose} showCloseButton />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent navigation={filteredNavigation} />
      </div>
    </>
  )
}

interface SidebarContentProps {
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    roles: number[]
  }>
  onClose?: () => void
  showCloseButton?: boolean
}

function SidebarContent({ navigation, onClose, showCloseButton }: SidebarContentProps) {
  return (
    <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
      {/* Header with BT branding */}
      <div className="flex items-center justify-between p-6 bt-gradient">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-bt-purple font-bold text-lg">BT</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Leave System</h2>
            <p className="text-xs text-white opacity-80">BT Group</p>
          </div>
        </div>
        
        {showCloseButton && (
          <button
            type="button"
            className="p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2024 BT Group plc
        </p>
      </div>
    </div>
  )
}