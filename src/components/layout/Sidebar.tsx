import { NavLink } from 'react-router-dom'
import { X, Home, Calendar, Users, FileText, Settings, ChevronRight, Bell, Shield } from 'lucide-react'
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
      roles: [1, 2, 3], // All roles
      description: 'Overview and quick actions'
    },
    {
      name: 'My Leave Requests',
      href: '/leave-requests',
      icon: Calendar,
      roles: [3], // Employees only
      description: 'Submit and track your leave'
    },
    {
      name: 'Team Requests',
      href: '/team-requests',
      icon: FileText,
      roles: [1, 2], // Admins and Managers
      description: 'Review team submissions'
    },
    {
      name: 'All Requests',
      href: '/all-requests',
      icon: FileText,
      roles: [1], // Admins only
      description: 'Company-wide leave overview'
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: [1, 2], // Admins and Managers
      description: 'Manage team members'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: [1], // Admins only
      description: 'System configuration'
    }
  ]

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.roleId || 0)
  )

  const getRoleBadge = () => {
    switch (user?.roleId) {
      case 1:
        return { name: 'Administrator', color: 'bg-red-500', icon: Shield }
      case 2:
        return { name: 'Manager', color: 'bg-blue-500', icon: Users }
      case 3:
        return { name: 'Employee', color: 'bg-green-500', icon: Calendar }
      default:
        return { name: 'User', color: 'bg-gray-500', icon: Users }
    }
  }

  const roleBadge = getRoleBadge()
  const RoleIcon = roleBadge.icon

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <SidebarContent 
          navigation={filteredNavigation} 
          onClose={onClose} 
          showCloseButton 
          user={user}
          roleBadge={roleBadge}
          RoleIcon={RoleIcon}
        />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <SidebarContent 
          navigation={filteredNavigation} 
          user={user}
          roleBadge={roleBadge}
          RoleIcon={RoleIcon}
        />
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
    description: string
  }>
  onClose?: () => void
  showCloseButton?: boolean
  user: any
  roleBadge: any
  RoleIcon: React.ComponentType<{ className?: string }>
}

function SidebarContent({ navigation, onClose, showCloseButton, user, roleBadge, RoleIcon }: SidebarContentProps) {
  return (
    <nav className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-xl" aria-label="Main navigation">
      {/* Enhanced Header with BT branding */}
      <header className="bt-gradient p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-bt-purple font-bold text-xl">BT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Leave System</h1>
                <p className="text-xs text-white opacity-80">BT Group plc</p>
              </div>
            </div>
            
            {showCloseButton && (
              <button
                type="button"
                className="p-2 rounded-xl text-white hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-bt-purple transition-colors"
                onClick={onClose}
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 ${roleBadge.color} rounded-full`}></div>
                  <p className="text-white opacity-80 text-sm">
                    {roleBadge.name}
                  </p>
                </div>
              </div>
              <RoleIcon className="h-5 w-5 text-white opacity-80" />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-bt-cyan opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      </header>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Navigation
          </h2>
        </div>
        
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 ${
                  isActive 
                    ? 'bt-gradient text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-bt-purple/10 hover:to-bt-blue/10 hover:text-bt-purple'
                }`
              }
              aria-describedby={`nav-desc-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-white bg-opacity-20 shadow-md' 
                        : 'bg-gray-100 group-hover:bg-bt-purple/10'
                    }`}>
                      <Icon className={`h-5 w-5 transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-gray-600 group-hover:text-bt-purple'
                      }`} />
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className={`text-xs transition-colors duration-200 ${
                        isActive ? 'text-white opacity-80' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-all duration-200 ${
                    isActive 
                      ? 'text-white transform rotate-90' 
                      : 'text-gray-400 group-hover:text-bt-purple group-hover:translate-x-1'
                  }`} />
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* Notifications Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-bt-orange/10 to-red-500/10 rounded-xl p-4 border border-bt-orange/20">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-bt-orange to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <p className="text-xs text-gray-600">
                {user?.roleId === 3 ? 'No pending updates' : '2 pending approvals'}
              </p>
            </div>
            <div className="h-6 w-6 bg-bt-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {user?.roleId === 3 ? '0' : '2'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-6 w-6 bg-bt-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">BT</span>
            </div>
            <span className="text-xs font-semibold text-gray-700">BT Group plc</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2024 All rights reserved
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <a 
              href="#help" 
              className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded px-1"
            >
              Help
            </a>
            <span>•</span>
            <a 
              href="#privacy" 
              className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded px-1"
            >
              Privacy
            </a>
            <span>•</span>
            <a 
              href="#support" 
              className="hover:text-bt-purple transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded px-1"
            >
              Support
            </a>
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Version 2.1.0 • Secure & Accessible
            </p>
          </div>
        </div>
      </footer>

      {/* Hidden descriptive text for screen readers */}
      {navigation.map((item) => (
        <div
          key={`desc-${item.name}`}
          id={`nav-desc-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
          className="sr-only"
        >
          {item.description}
        </div>
      ))}
    </nav>
  )
}