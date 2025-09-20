import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Users, TrendingUp, Plus } from 'lucide-react'
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

  if (balanceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bt-gradient rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-lg opacity-90">
              {isAdmin && "Manage your organization's leave requests"}
              {isManager && "Review and approve your team's leave requests"}
              {isEmployee && "View and manage your annual leave"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-20 w-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Calendar className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Leave Balance */}
        <StatsCard
          title="Annual Leave Balance"
          value={`${leaveBalance?.remainingLeave || 0} days`}
          icon={Calendar}
          color="bg-bt-purple"
          trend="+2 from last month"
        />

        {/* Pending Requests */}
        {(isAdmin || isManager) && (
          <StatsCard
            title="Pending Requests"
            value={pendingRequests?.length || 0}
            icon={Clock}
            color="bg-bt-orange"
            trend="Requires attention"
          />
        )}

        {/* My Requests (for employees) */}
        {isEmployee && (
          <StatsCard
            title="My Requests"
            value={myRequests?.length || 0}
            icon={Calendar}
            color="bg-bt-blue"
            trend="This year"
          />
        )}

        {/* Team Size (for managers) */}
        {isManager && (
          <StatsCard
            title="Team Members"
            value="8"
            icon={Users}
            color="bg-bt-blue"
            trend="Active employees"
          />
        )}

        {/* Total Users (for admins) */}
        {isAdmin && (
          <StatsCard
            title="Total Employees"
            value="156"
            icon={Users}
            color="bg-bt-blue"
            trend="Company wide"
          />
        )}

        {/* Approval Rate (for managers/admins) */}
        {(isAdmin || isManager) && (
          <StatsCard
            title="Approval Rate"
            value="94%"
            icon={TrendingUp}
            color="bg-green-500"
            trend="+5% from last month"
          />
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leave Balance Details */}
        <div className="lg:col-span-1">
          <LeaveBalance balance={leaveBalance} isLoading={balanceLoading} />
        </div>

        {/* Recent Requests */}
        <div className="lg:col-span-2">
          <RecentRequests
            requests={isEmployee ? myRequests : pendingRequests}
            isLoading={isEmployee ? myRequestsLoading : pendingLoading}
            type={isEmployee ? 'my' : 'pending'}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* New Leave Request */}
            <Link
              to="/leave-requests/create"
              className="flex items-center p-4 bg-bt-purple bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors group"
            >
              <div className="h-12 w-12 bg-bt-purple rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">New Request</h3>
                <p className="text-sm text-gray-600">Submit leave request</p>
              </div>
            </Link>

            {/* View All Requests */}
            <Link
              to="/leave-requests"
              className="flex items-center p-4 bg-bt-blue bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors group"
            >
              <div className="h-12 w-12 bg-bt-blue rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Requests</h3>
                <p className="text-sm text-gray-600">Manage your leave</p>
              </div>
            </Link>

            {/* Team Management (for managers/admins) */}
            {(isAdmin || isManager) && (
              <Link
                to="/users"
                className="flex items-center p-4 bg-bt-orange bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors group"
              >
                <div className="h-12 w-12 bg-bt-orange rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team</h3>
                  <p className="text-sm text-gray-600">Manage employees</p>
                </div>
              </Link>
            )}

            {/* Reports (for admins) */}
            {isAdmin && (
              <Link
                to="/reports"
                className="flex items-center p-4 bg-green-500 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors group"
              >
                <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reports</h3>
                  <p className="text-sm text-gray-600">Analytics & insights</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}