export function LeaveRequestFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            className="input-field"
            placeholder="From"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            className="input-field"
            placeholder="To"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Leave Type
        </label>
        <select className="select-field">
          <option value="">All Types</option>
          <option value="annual">Annual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="personal">Personal Leave</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Department
        </label>
        <select className="select-field">
          <option value="">All Departments</option>
          <option value="hr">Human Resources</option>
          <option value="it">Information Technology</option>
          <option value="finance">Finance</option>
          <option value="marketing">Marketing</option>
        </select>
      </div>
    </div>
  )
}