import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Calendar, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CreateLeaveRequestForm {
  leaveTypeId: number
  startDate: string
  endDate: string
  reason: string
}

export function CreateLeaveRequestPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateLeaveRequestForm>()

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
    setIsSubmitting(true)
    try {
      // Implement API call here
      console.log('Creating leave request:', data)
      // await leaveRequestsApi.create(data)
      navigate('/leave-requests')
    } catch (error) {
      console.error('Error creating leave request:', error)
    } finally {
      setIsSubmitting(false)
    }
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
                <option value="1">Annual Leave</option>
                <option value="2">Sick Leave</option>
                <option value="3">Personal Leave</option>
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
                  {...register('endDate', { required: 'End date is required' })}
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
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}