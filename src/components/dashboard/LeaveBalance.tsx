import { Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

interface LeaveBalanceProps {
  balance: any
  isLoading: boolean
}

export function LeaveBalance({ balance, isLoading }: LeaveBalanceProps) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white">Leave Balance</h2>
        </div>
        <div className="card-body flex items-center justify-center h-48">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  const totalDays = 25 // Standard annual leave
  const remainingDays = balance?.remainingLeave || 0
  const usedDays = totalDays - remainingDays
  const percentage = (remainingDays / totalDays) * 100

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-white" />
          <h2 className="text-xl font-semibold text-white">Leave Balance</h2>
        </div>
      </div>
      <div className="card-body">
        {/* Circular Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#5e2750"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.14} 314`}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-bt-purple">{remainingDays}</div>
                <div className="text-sm text-gray-600">days left</div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Total Allocation</span>
            <span className="text-sm font-bold text-gray-900">{totalDays} days</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Used</span>
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-bold text-red-700">{usedDays} days</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Remaining</span>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold text-green-700">{remainingDays} days</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Annual Leave Usage</span>
            <span>{Math.round(((usedDays / totalDays) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-bt-purple to-bt-blue h-3 rounded-full transition-all duration-300"
              style={{ width: `${(usedDays / totalDays) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 p-4 bg-bt-purple bg-opacity-10 rounded-lg">
          <h4 className="text-sm font-semibold text-bt-purple mb-2">Recommendation</h4>
          <p className="text-sm text-gray-700">
            {remainingDays > 15 
              ? "You have plenty of leave remaining. Consider planning a longer break!"
              : remainingDays > 5 
              ? "You're on track with your leave usage. Remember to take time to recharge."
              : "Don't forget to use your remaining leave before the year ends!"
            }
          </p>
        </div>
      </div>
    </div>
  )
}