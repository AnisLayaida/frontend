import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Users, TrendingUp, Plus, Award, Target, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { leaveRequestsApi, usersApi } from '../../services/api'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { RecentRequests } from '../../components/dashboard/RecentRequests'
import { LeaveBalance } from '../../components/dashboard/LeaveBalance'

export function DashboardPage() {
  const { user } = useAuth()

  // Fetch user's leave balance
  const { data: leaveBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ['leaveBalance', user?.userId],
    queryFn: () => usersApi.getLeaveBalance(user!.userId),
    enabled: !!user?.userId
  })

  // Fetch pending requests (for managers/admins)
  const { data: pendingRequests, isLoading: pendingLoading } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: () => leaveRequestsApi.getPending(),
    enabled: user?.roleId === 1 || user?.roleId === 2 // Admin or Manager
  })

  // Fetch user's own requests (for employees)
  const { data: myRequests, isLoading: myRequestsLoading } = useQuery({
    queryKey: ['myRequests', user?.userId],
    queryFn: () => leaveRequestsApi.getMyRequests(user!.userId),
    enabled: !!user?.userId
  })

  const isEmployee = user?.roleId === 3
  const isManager = user?.roleId === 2
  const isAdmin = user?.roleId === 1

  const getUserName = () => {
    if (user?.email) {
      return user.email.split('@')[0].charAt(0).toUpperCase() + 
             user.email.split('@')[0].slice(1)
    }
    return 'User'
  }

  const getRoleTitle = () => {
    if (isAdmin) return 'Administrator'
    if (isManager) return 'Manager'
    return 'Employee'
  }

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-label="Loading dashboard">
        <LoadingSpinner size="large" />
        <span className="sr-only">Loading dashboard data</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 bt-fade-in">
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Enhanced Welcome Header */}
      <header className="bt-gradient rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold text-white">
                    {getUserName().charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {getUserName()}!
                  </h1>
                  <p className="text-xl opacity-90 font-medium">
                    {getRoleTitle()} • BT Group
                  </p>
                </div>
              </div>
              <p className="text-lg opacity-90 max-w-2xl leading-relaxed">
                {isAdmin && "Oversee organizational leave management and ensure smooth operations across all departments."}
                {isManager && "Review team requests, maintain optimal staffing levels, and support your team's work-life balance."}
                {isEmployee && "Manage your annual leave requests and maintain a healthy work-life balance with BT's flexible leave system."}
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="h-32 w-32 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
                  <Calendar className="h-16 w-16 text-white opacity-80" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-bt-orange rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {new Date().getDate()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bt-cyan opacity-10 rounded-full translate-y-32 -translate-x-32"></div>
      </header>

      {/* Enhanced Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Leave Balance */}
          <div className="stats-card bt-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                  Annual Leave Balance
                </p>
                <p className="text-4xl font-bold text-gray-900 mb-1">
                  {leaveBalance?.remainingLeave || 0}
                </p>
                <p className="text-lg font-medium text-gray-600">
                  days remaining
                </p>
                <div className="mt-3 flex items-center">
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Well managed</span>
                  </div>
                </div>
              </div>
              <div className="stats-icon bg-gradient-to-br from-bt-purple to-bt-blue">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Pending Requests (for managers/admins) */}
          {(isAdmin || isManager) && (
            <div className="stats-card bt-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Pending Requests
                  </p>
                  <p className="text-4xl font-bold text-orange-600 mb-1">
                    {pendingRequests?.length || 0}
                  </p>
                  <p className="text-lg font-medium text-gray-600">
                    need review
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center text-sm text-orange-600 font-medium">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Urgent attention</span>
                    </div>
                  </div>
                </div>
                <div className="stats-icon bg-gradient-to-br from-bt-orange to-red-500">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* My Requests (for employees) */}
          {isEmployee && (
            <div className="stats-card bt-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    My Requests
                  </p>
                  <p className="text-4xl font-bold text-bt-blue mb-1">
                    {myRequests?.length || 0}
                  </p>
                  <p className="text-lg font-medium text-gray-600">
                    this year
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center text-sm text-bt-blue font-medium">
                      <Activity className="h-4 w-4 mr-1" />
                      <span>Active tracking</span>
                    </div>
                  </div>
                </div>
                <div className="stats-icon bg-gradient-to-br from-bt-blue to-bt-cyan">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Team Size (for managers) */}
          {isManager && (
            <div className="stats-card bt-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Team Members
                  </p>
                  <p className="text-4xl font-bold text-bt-purple mb-1">
                    8
                  </p>
                  <p className="text-lg font-medium text-gray-600">
                    direct reports
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center text-sm text-bt-purple font-medium">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Active team</span>
                    </div>
                  </div>
                </div>
                <div className="stats-icon bg-gradient-to-br from-bt-purple to-purple-600">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Total Users (for admins) */}
          {isAdmin && (
            <>
              <div className="stats-card bt-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Total Employees
                    </p>
                    <p className="text-4xl font-bold text-bt-purple mb-1">
                      156
                    </p>
                    <p className="text-lg font-medium text-gray-600">
                      company wide
                    </p>
                    <div className="mt-3 flex items-center">
                      <div className="flex items-center text-sm text-bt-purple font-medium">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Growing team</span>
                      </div>
                    </div>
                  </div>
                  <div className="stats-icon bg-gradient-to-br from-bt-purple to-purple-600">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="stats-card bt-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                      Approval Rate
                    </p>
                    <p className="text-4xl font-bold text-green-600 mb-1">
                      94%
                    </p>
                    <p className="text-lg font-medium text-gray-600">
                      this quarter
                    </p>
                    <div className="mt-3 flex items-center">
                      <div className="flex items-center text-sm text-green-600 font-medium">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+5% improvement</span>
                      </div>
                    </div>
                  </div>
                  <div className="stats-icon bg-gradient-to-br from-green-500 to-green-600">
                    <Award className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Approval Rate (for managers only) */}
          {isManager && !isAdmin && (
            <div className="stats-card bt-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Approval Rate
                  </p>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    96%
                  </p>
                  <p className="text-lg font-medium text-gray-600">
                    team average
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Excellent rate</span>
                    </div>
                  </div>
                </div>
                <div className="stats-icon bg-gradient-to-br from-green-500 to-green-600">
                  <Award className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Employee Wellbeing Score (for employees) */}
          {isEmployee && (
            <div className="stats-card bt-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                    Work-Life Score
                  </p>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    8.5
                  </p>
                  <p className="text-lg font-medium text-gray-600">
                    out of 10
                  </p>
                  <div className="mt-3 flex items-center">
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <Target className="h-4 w-4 mr-1" />
                      <span>Healthy balance</span>
                    </div>
                  </div>
                </div>
                <div className="stats-icon bg-gradient-to-br from-green-500 to-green-600">
                  <Activity className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Grid */}
      <section id="main-content" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leave Balance Details */}
        <div className="lg:col-span-1 bt-bounce-in">
          <LeaveBalance balance={leaveBalance} isLoading={balanceLoading} />
        </div>

        {/* Recent Requests */}
        <div className="lg:col-span-2 bt-bounce-in" style={{ animationDelay: '0.2s' }}>
          <RecentRequests
            requests={isEmployee ? myRequests : pendingRequests}
            isLoading={isEmployee ? myRequestsLoading : pendingLoading}
            type={isEmployee ? 'my' : 'pending'}
          />
        </div>
      </section>

      {/* Enhanced Quick Actions */}
      <section aria-labelledby="quick-actions-heading" className="bt-slide-up">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h2 id="quick-actions-heading" className="text-xl font-semibold text-white">
                  Quick Actions
                </h2>
              </div>
              <div className="text-white opacity-75 text-sm">
                Streamline your workflow
              </div>
            </div>
          </div>
          
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* New Leave Request */}
              <Link
                to="/leave-requests/create"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-bt-purple/10 to-bt-blue/10 rounded-2xl hover:from-bt-purple/20 hover:to-bt-blue/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-bt-purple/20"
                aria-describedby="new-request-desc"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-bt-purple to-bt-blue rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">New Request</h3>
                <p id="new-request-desc" className="text-sm text-gray-600 text-center leading-relaxed">
                  Submit a new annual leave request with our streamlined process
                </p>
              </Link>

              {/* View All Requests */}
              <Link
                to="/leave-requests"
                className="group flex flex-col items-center p-6 bg-gradient-to-br from-bt-blue/10 to-bt-cyan/10 rounded-2xl hover:from-bt-blue/20 hover:to-bt-cyan/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-bt-blue/20"
                aria-describedby="view-requests-desc"
              >
                <div className="h-16 w-16 bg-gradient-to-br from-bt-blue to-bt-cyan rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">View Requests</h3>
                <p id="view-requests-desc" className="text-sm text-gray-600 text-center leading-relaxed">
                  {isEmployee ? "Manage and track your leave requests" : "Review pending team requests"}
                </p>
              </Link>

              {/* Team Management (for managers/admins) */}
              {(isAdmin || isManager) && (
                <Link
                  to="/users"
                  className="group flex flex-col items-center p-6 bg-gradient-to-br from-bt-orange/10 to-red-500/10 rounded-2xl hover:from-bt-orange/20 hover:to-red-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-bt-orange/20"
                  aria-describedby="team-management-desc"
                >
                  <div className="h-16 w-16 bg-gradient-to-br from-bt-orange to-red-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Team Management</h3>
                  <p id="team-management-desc" className="text-sm text-gray-600 text-center leading-relaxed">
                    {isAdmin ? "Manage all employees and departments" : "Oversee your team members"}
                  </p>
                </Link>
              )}

              {/* Reports (for admins) */}
              {isAdmin && (
                <Link
                  to="/reports"
                  className="group flex flex-col items-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-green-500/20"
                  aria-describedby="reports-desc"
                >
                  <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Analytics</h3>
                  <p id="reports-desc" className="text-sm text-gray-600 text-center leading-relaxed">
                    View comprehensive reports and insights
                  </p>
                </Link>
              )}

              {/* Employee Benefits (for employees) */}
              {isEmployee && (
                <Link
                  to="/benefits"
                  className="group flex flex-col items-center p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg border border-purple-500/20"
                  aria-describedby="benefits-desc"
                >
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">Benefits</h3>
                  <p id="benefits-desc" className="text-sm text-gray-600 text-center leading-relaxed">
                    Explore your BT employee benefits
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tips Section */}
      <section aria-labelledby="tips-heading" className="bt-fade-in">
        <div className="card bg-gradient-to-br from-bt-cyan/5 to-bt-blue/5 border border-bt-cyan/20">
          <div className="card-body">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gradient-to-br from-bt-cyan to-bt-blue rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 id="tips-heading" className="text-xl font-bold text-gray-900">
                Pro Tips for Leave Management
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-bt-green rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Plan Ahead</h3>
                  <p className="text-sm text-gray-600">
                    Submit requests at least 2 weeks in advance for optimal approval chances.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-bt-orange rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Team Coverage</h3>
                  <p className="text-sm text-gray-600">
                    Coordinate with teammates to ensure smooth operations during your absence.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-bt-purple rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Use Your Days</h3>
                  <p className="text-sm text-gray-600">
                    Remember to take regular breaks for your wellbeing and productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}