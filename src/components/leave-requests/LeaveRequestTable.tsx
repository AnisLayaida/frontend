import { CheckCircle, XCircle, Clock, AlertCircle, Eye, MoreHorizontal } from 'lucide-react'
import type { LeaveRequest } from '../../types'

interface LeaveRequestTableProps {
  requests: LeaveRequest[]
  userRole: number
  onApprove: (requestId: number) => void
  onReject: (requestId: number) => void
  onCancel: (requestId: number) => void
}

export function LeaveRequestTable({ 
  requests, 
  userRole, 
  onApprove, 
  onReject, 
  onCancel 
}: LeaveRequestTableProps) {
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
        <p className="text-gray-600">No leave requests match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {userRole !== 3 && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Leave Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dates
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Days
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request.leaveRequestId} className="hover:bg-gray-50">
              {userRole !== 3 && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.user.firstName} {request.user.surname}
                  </div>
                  <div className="text-sm text-gray-500">{request.user.email}</div>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {request.leaveType.leaveType}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {calculateDays(request.startDate, request.endDate)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(request.status)}
                  <span className={getStatusClass(request.status)}>
                    {request.status}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {request.reason || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    className="text-bt-purple hover:text-bt-purple-dark p-1"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {(userRole === 1 || userRole === 2) && request.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onApprove(request.leaveRequestId)}
                        className="text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(request.leaveRequestId)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 border border-red-300 rounded hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {userRole === 3 && request.status === 'Pending' && (
                    <button
                      onClick={() => onCancel(request.leaveRequestId)}
                      className="text-gray-600 hover:text-gray-800 text-xs font-medium px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    className="text-gray-400 hover:text-gray-600 p-1"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}