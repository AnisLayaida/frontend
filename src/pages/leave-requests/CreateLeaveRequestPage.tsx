import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, ArrowLeft, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { leaveRequestsApi, leaveTypesApi } from '../../services/api'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'
import type { CreateLeaveRequestData } from '../../types'

interface CreateLeaveRequestForm {
  leaveTypeId: number
  startDate: string
  endDate: string
  reason: string
}

export function CreateLeaveRequestPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [submitError, setSubmitError] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateLeaveRequestForm>()

  // Fetch leave types
  const { data: leaveTypes = [], isLoading: leaveTypesLoading } = useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => leaveTypesApi.getAll()
  })

  // Create leave request mutation
  const createRequestMutation = useMutation({
    mutationFn: (data: CreateLeaveRequestData) => leaveRequestsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
      navigate('/leave-requests')
    },
    onError: (error: any) => {
      setSubmitError(error.response?.data?.error?.message || 'Failed to create leave request')
    }
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const calculateDays = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const onSubmit = async (data: CreateLeaveRequestForm) => {
    if (!user?.userId) return
    
    setSubmitError('')
    
    const requestData: CreateLeaveRequestData = {
      userId: user.userId,
      leaveTypeId: Number(data.leaveTypeId),
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason || undefined
    }

    createRequestMutation.mutate(requestData)
  }

  const validateEndDate = (endDate: string) => {
    if (!startDate || !endDate) return true
    return new Date(endDate) >= new Date(startDate) || 'End date must be after start date'
  }

  if (leaveTypesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-4">
          <Link
            to="/leave-requests"
            className="p-2 rounded-lg text-gray-600 hover:text-bt-purple hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Leave Request</h1>
            <p className="text-gray-600">Submit a new annual leave request</p>
          </div>
        </div>
      </div>

      <div className="card max-w-2xl mx-auto">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Leave Request Details</h2>
          </div>
        </div>
        
        <div className="card-body">
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                {...register('leaveTypeId', { required: 'Leave type is required' })}
                className="select-field"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type: any) => (
                  <option key={type.leaveTypeId} value={type.leaveTypeId}>
                    {type.leaveType}
                  </option>
                ))}
              </select>
              {errors.leaveTypeId && (
                <p className="mt-1 text-sm text-red-600">{errors.leaveTypeId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="input-field"
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  {...register('endDate', { 
                    required: 'End date is required',
                    validate: validateEndDate
                  })}
                  className="input-field"
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {calculateDays() > 0 && (
              <div className="p-4 bg-bt-purple bg-opacity-10 rounded-lg">
                <p className="text-sm text-bt-purple font-medium">
                  Total days requested: {calculateDays()} day(s)
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                {...register('reason')}
                rows={4}
                className="input-field"
                placeholder="Provide additional details about your leave request..."
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Link to="/leave-requests" className="btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="btn-primary flex items-center space-x-2"
              >
                {createRequestMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}