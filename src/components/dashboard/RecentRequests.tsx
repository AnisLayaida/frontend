import { Clock, Calendar, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import type { LeaveRequest } from '../../types'

interface RecentRequestsProps {
  requests?: LeaveRequest[]
  isLoading: boolean
  type: 'my' | 'pending'
}

export function RecentRequests({ requests = [], isLoading, type }: RecentRequestsProps) {
  const title = type === 'my' ? 'My Recent Requests' : 'Pending Approvals'
  const emptyMessage = type === 'my' 
    ? 'No leave requests found. Create your first request!'
    : 'No pending requests requiring your attention.'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'Cancelled':
        return <AlertCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'status-approved'
      case 'Rejected':
        return 'status-rejected'
      case 'Pending':
        return 'status-pending'
      case 'Cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
        </div>
        <div className="card-body flex items-center justify-center h-48">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
          <Link
            to="/leave-requests"
            className="text-white hover:text-gray-200 text-sm font-medium"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div className="card-body">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{emptyMessage}</p>
            {type === 'my' && (
              <Link to="/leave-requests/create" className="btn-primary">
                Create Request
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.slice(0, 5).map((request) => (
              <div
                key={request.leaveRequestId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(request.status)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">
                        {request.leaveType.leaveType}
                      </p>
                      <span className={getStatusClass(request.status)}>
                        {request.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </span>
                      <span>
                        {calculateDays(request.startDate, request.endDate)} day(s)
                      </span>
                      {type === 'pending' && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{request.user.firstName} {request.user.surname}</span>
                        </div>
                      )}
                    </div>
                    {request.reason && (
                      <p className="text-sm text-gray-500 mt-1 italic">
                        "{request.reason}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {type === 'pending' && request.status === 'Pending' && (
                    <>
                      <button
                        className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 border border-green-300 rounded-md hover:bg-green-50 transition-colors"
                        onClick={() => {
                          // Handle approve - implement in parent component
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                        onClick={() => {
                          // Handle reject - implement in parent component
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  <Link
                    to={`/leave-requests/${request.leaveRequestId}`}
                    className="text-bt-purple hover:text-bt-purple-dark text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
            
            {requests.length > 5 && (
              <div className="text-center pt-4 border-t border-gray-200">
                <Link
                  to="/leave-requests"
                  className="text-bt-purple hover:text-bt-purple-dark font-medium"
                >
                  View {requests.length - 5} more requests
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}