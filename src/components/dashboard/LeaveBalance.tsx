import { Calendar, TrendingUp, TrendingDown, Target, Award, Clock } from 'lucide-react'
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
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Leave Balance</h2>
              <p className="text-white opacity-80 text-sm">Annual allocation overview</p>
            </div>
          </div>
        </div>
        <div className="card-body flex items-center justify-center h-64">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-gray-600 mt-4">Loading balance data...</p>
          </div>
        </div>
      </div>
    )
  }

  const totalDays = 25 // Standard annual leave
  const remainingDays = balance?.remainingLeave || 0
  const usedDays = totalDays - remainingDays
  const percentage = (remainingDays / totalDays) * 100
  const usagePercentage = (usedDays / totalDays) * 100

  const getBalanceStatus = () => {
    if (remainingDays > 20) return { color: 'text-green-600', status: 'Excellent', icon: Award }
    if (remainingDays > 15) return { color: 'text-blue-600', status: 'Good', icon: Target }
    if (remainingDays > 5) return { color: 'text-orange-600', status: 'Moderate', icon: Clock }
    return { color: 'text-red-600', status: 'Low', icon: TrendingDown }
  }

  const balanceStatus = getBalanceStatus()
  const StatusIcon = balanceStatus.icon

  const getRecommendation = () => {
    if (remainingDays > 20) {
      return {
        title: "Plan Your Breaks",
        message: "You have plenty of leave remaining. Consider planning a longer vacation or regular breaks throughout the year.",
        action: "Schedule Leave",
        color: "bg-green-500"
      }
    } else if (remainingDays > 15) {
      return {
        title: "Well Balanced",
        message: "You're on track with your leave usage. Remember to take time to recharge and maintain work-life balance.",
        action: "View Calendar",
        color: "bg-blue-500"
      }
    } else if (remainingDays > 5) {
      return {
        title: "Consider Planning",
        message: "You're using your leave well. Plan remaining days wisely to ensure you get proper rest.",
        action: "Plan Ahead",
        color: "bg-orange-500"
      }
    } else {
      return {
        title: "Use Remaining Days",
        message: "Don't forget to use your remaining leave before the year ends. Your wellbeing is important!",
        action: "Book Now",
        color: "bg-red-500"
      }
    }
  }

  const recommendation = getRecommendation()

  return (
    <div className="card overflow-hidden">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Annual Leave Balance</h2>
              <p className="text-white opacity-80 text-sm">Your allocation overview</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-white bg-white bg-opacity-20 text-sm font-medium`}>
              <StatusIcon className="h-4 w-4" />
              <span>{balanceStatus.status}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        {/* Enhanced Circular Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Usage circle (background) */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="#fee2e2"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${usagePercentage * 2.83} 283`}
                className="transition-all duration-1000 ease-out"
              />
              {/* Remaining circle (foreground) */}
              <circle
                cx="60"
                cy="60"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 2.83} 283`}
                className="transition-all duration-1000 ease-out"
                style={{ animationDelay: '0.3s' }}
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#5e2750" />
                  <stop offset="50%" stopColor="#00348e" />
                  <stop offset="100%" stopColor="#00bcd4" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-bt-purple mb-1">{remainingDays}</div>
                <div className="text-sm text-gray-600 font-medium">days left</div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(percentage)}% remaining</div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-bt-orange rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Enhanced Balance Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Total Allocation</span>
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalDays}</div>
              <div className="text-xs text-gray-600">days per year</div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Used</span>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-red-700">{usedDays}</div>
              <div className="text-xs text-red-600">{Math.round(usagePercentage)}% of total</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Remaining Balance</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-700">{remainingDays} days</div>
                <div className="text-xs text-green-600">Available to use</div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${balanceStatus.color}`}>{balanceStatus.status}</div>
                <div className="text-xs text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="font-medium">Annual Leave Usage</span>
            <span className="font-bold">{Math.round(usagePercentage)}% used</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-bt-purple via-bt-blue to-bt-cyan h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${usagePercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform skew-x-12 animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 days</span>
              <span>{totalDays} days</span>
            </div>
          </div>
        </div>

        {/* Enhanced Recommendations */}
        <div className={`relative rounded-2xl p-6 bg-gradient-to-br from-bt-purple/5 to-bt-blue/5 border border-bt-purple/20 overflow-hidden`}>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`h-10 w-10 ${recommendation.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{recommendation.title}</h4>
                <p className="text-sm text-gray-600">Personalized recommendation</p>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              {recommendation.message}
            </p>
            
            <div className="flex items-center justify-between">
              <button className="btn-primary text-sm px-4 py-2">
                {recommendation.action}
              </button>
              <div className="text-right">
                <div className="text-xs text-gray-500">Last updated</div>
                <div className="text-sm font-medium text-gray-700">Today</div>
              </div>
            </div>
          </div>
          
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-bt-purple opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-bt-cyan opacity-10 rounded-full translate-y-10 -translate-x-10"></div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-lg font-bold text-gray-900">3.5</div>
            <div className="text-xs text-gray-600">avg days/month</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-lg font-bold text-gray-900">2</div>
            <div className="text-xs text-gray-600">pending requests</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-lg font-bold text-gray-900">Dec 31</div>
            <div className="text-xs text-gray-600">year end</div>
          </div>
        </div>
      </div>
    </div>
  )
}