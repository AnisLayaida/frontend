import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Filter, Search, Calendar, Download } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { leaveRequestsApi } from '../../services/api'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import { LeaveRequestTable } from '../../components/leave-requests/LeaveRequestTable'
import { LeaveRequestFilters } from '../../components/leave-requests/LeaveRequestFilters'
import type { LeaveRequest } from '../../types'

export function LeaveRequestsPage() {
  const { user } = useAuth()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const isEmployee = user?.roleId === 3
  const isManager = user?.roleId === 2
  const isAdmin = user?.roleId === 1
  
  // Determine which requests to fetch based on route and role
  const isTeamRequests = location.pathname.includes('team-requests')
  const isAllRequests = location.pathname.includes('all-requests')

  // Fetch requests based on user role and current route
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['requests', user?.roleId, user?.userId, location.pathname],
    queryFn: () => {
      if (isAllRequests && isAdmin) {
        return leaveRequestsApi.getAll()
      } else if (isTeamRequests && (isManager || isAdmin)) {
        return leaveRequestsApi.getPending()
      } else if (isEmployee) {
        return leaveRequestsApi.getMyRequests(user!.userId)
      } else {
        return leaveRequestsApi.getPending()
      }
    },
    enabled: !!user?.userId
  })

  // Filter requests based on search and status
  const filteredRequests = requests?.filter((request: LeaveRequest) => {
    const matchesSearch = searchTerm === '' || 
      request.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter

    return matchesSearch && matchesStatus
  }) || []

  const getPageTitle = () => {
    if (isAllRequests) return 'All Leave Requests'
    if (isTeamRequests) return 'Team Leave Requests' 
    if (isEmployee) return 'My Leave Requests'
    return 'Leave Requests'
  }

  const getPageDescription = () => {
    if (isAllRequests) return 'Manage all leave requests across the organization'
    if (isTeamRequests) return 'Review and approve your team\'s leave requests'
    if (isEmployee) return 'View and manage your annual leave requests'
    return 'Manage leave requests'
  }

  const handleApprove = async (requestId: number) => {
    try {
      await leaveRequestsApi.approve(requestId)
      refetch()
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      await leaveRequestsApi.reject(requestId)
      refetch()
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const handleCancel = async (requestId: number) => {
    try {
      await leaveRequestsApi.cancel(requestId)
      refetch()
    } catch (error) {
      console.error('Error cancelling request:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600">{getPageDescription()}</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{filteredRequests.length} request(s)</span>
              </div>
              {isEmployee && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>•</span>
                  <span>{filteredRequests.filter(r => r.status === 'Pending').length} pending</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Export Button */}
            <button
              onClick={() => {
                console.log('Export requests')
              }}
              className="btn-outline flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* New Request Button (for employees) */}
            {isEmployee && (
              <Link to="/leave-requests/create" className="btn-primary flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>New Request</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-field"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-outline flex items-center space-x-2 ${showFilters ? 'bg-bt-purple text-white' : ''}`}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <LeaveRequestFilters />
          </div>
        )}
      </div>

      {/* Statistics Cards (for managers and admins) */}
      {(isManager || isAdmin) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{requests?.length || 0}</p>
              </div>
              <div className="h-12 w-12 bg-bt-purple rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests?.filter(r => r.status === 'Pending').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests?.filter(r => r.status === 'Approved').length || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-bt-purple">
                  {requests?.length ? 
                    Math.round((requests.filter(r => r.status === 'Approved').length / requests.length) * 100) 
                    : 0}%
                </p>
              </div>
              <div className="h-12 w-12 bg-bt-blue rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <LeaveRequestTable
          requests={filteredRequests}
          userRole={user?.roleId || 3}
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}