import { Menu, Bell, User, LogOut, Settings, HelpCircle, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false)
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1: return 'Administrator'
      case 2: return 'Manager'
      case 3: return 'Employee'
      default: return 'User'
    }
  }

  const getRoleColor = (roleId: number) => {
    switch (roleId) {
      case 1: return 'bg-red-500'
      case 2: return 'bg-blue-500'
      case 3: return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getUserInitials = () => {
    if (user?.email) {
      const name = user.email.split('@')[0]
      return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase()
    }
    return 'U'
  }

  const mockNotifications = [
    {
      id: 1,
      title: 'Leave Request Approved',
      message: 'Your annual leave request for Dec 25-29 has been approved.',
      time: '2 hours ago',
      type: 'success',
      unread: true
    },
    {
      id: 2,
      title: 'Team Meeting Reminder',
      message: 'Monthly team sync scheduled for tomorrow at 10 AM.',
      time: '5 hours ago',
      type: 'info',
      unread: true
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'Scheduled maintenance this weekend from 2-4 AM.',
      time: '1 day ago',
      type: 'warning',
      unread: false
    }
  ]

  const unreadCount = mockNotifications.filter(n => n.unread).length

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40" role="banner">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-bt-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 transition-all duration-200"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded="false"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Enhanced BT Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              {/* BT Logo */}
              <div className="relative">
                <div className="h-10 w-10 bt-gradient rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">BT</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Annual Leave System</h1>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500">BT Group</p>
                  <span className="text-gray-300">•</span>
                  <p className="text-sm font-medium text-bt-purple">
                    {getRoleName(user?.roleId || 0)} Portal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced Navigation */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button
                type="button"
                className="p-2 rounded-xl text-gray-600 hover:text-bt-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 transition-all duration-200"
                aria-label="Help and support"
                title="Help & Support"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                className="p-2 rounded-xl text-gray-600 hover:text-bt-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 transition-all duration-200"
                aria-label="System settings"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* Enhanced Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                className="relative p-2 rounded-xl text-gray-600 hover:text-bt-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 transition-all duration-200"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label={`View notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                aria-expanded={notificationsOpen}
                aria-haspopup="true"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold" aria-hidden="true">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {mockNotifications.length > 0 ? (
                      mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 hover:bg-gray-50 border-l-4 transition-colors cursor-pointer ${
                            notification.type === 'success' ? 'border-green-400' :
                            notification.type === 'warning' ? 'border-orange-400' :
                            'border-blue-400'
                          } ${notification.unread ? 'bg-blue-50' : ''}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${notification.title}: ${notification.message}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`h-2 w-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No notifications</p>
                      </div>
                    )}
                  </div>
                  
                  {mockNotifications.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-bt-purple hover:text-bt-purple-dark font-medium focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 rounded-lg py-1">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="flex items-center space-x-3 p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-offset-2 transition-all duration-200 max-w-xs"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                aria-label="User account menu"
              >
                <div className="relative">
                  <div className={`h-10 w-10 ${getRoleColor(user?.roleId || 0)} rounded-xl flex items-center justify-center shadow-md`}>
                    <span className="text-white font-semibold text-sm">
                      {getUserInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                
                <div className="hidden md:block text-left min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.email?.split('@')[0] || 'User'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 ${getRoleColor(user?.roleId || 0)} rounded-full`}></div>
                    <p className="text-xs text-gray-500 truncate">
                      {getRoleName(user?.roleId || 0)}
                    </p>
                  </div>
                </div>
                
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  dropdownOpen ? 'transform rotate-180' : ''
                }`} />
              </button>

              {/* Enhanced dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-bt-purple/5 to-bt-blue/5">
                    <div className="flex items-center space-x-3">
                      <div className={`h-12 w-12 ${getRoleColor(user?.roleId || 0)} rounded-xl flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.email || 'user@bt.com'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 w-2 ${getRoleColor(user?.roleId || 0)} rounded-full`}></div>
                          <p className="text-xs text-gray-600">
                            {getRoleName(user?.roleId || 0)} • BT Group
                          </p>
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          ● Online
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        // Navigate to profile
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-inset"
                      role="menuitem"
                    >
                      <User className="h-5 w-5 mr-3 text-gray-500" />
                      <div className="text-left">
                        <div className="font-medium">Profile Settings</div>
                        <div className="text-xs text-gray-500">Manage your account</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        // Navigate to preferences
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-inset"
                      role="menuitem"
                    >
                      <Settings className="h-5 w-5 mr-3 text-gray-500" />
                      <div className="text-left">
                        <div className="font-medium">Preferences</div>
                        <div className="text-xs text-gray-500">Customize your experience</div>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        // Show help
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-bt-purple focus:ring-inset"
                      role="menuitem"
                    >
                      <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                      <div className="text-left">
                        <div className="font-medium">Help & Support</div>
                        <div className="text-xs text-gray-500">Get assistance</div>
                      </div>
                    </button>
                  </div>
                  
                  {/* Sign out */}
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        logout()
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                      role="menuitem"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Sign Out</div>
                        <div className="text-xs text-red-500">End your session securely</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Breadcrumb navigation for better context */}
      <div className="hidden lg:block bg-gray-50 border-t border-gray-200 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 h-10 text-sm" aria-label="Breadcrumb">
          <a href="/dashboard" className="text-gray-500 hover:text-bt-purple transition-colors">
            Dashboard
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">
            Current Page
          </span>
        </nav>
      </div>
    </header>
  )
}