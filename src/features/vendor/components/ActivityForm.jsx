const ActivityForm = ({ activity, onChange }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Heading *
        </label>
        <input
          type="text"
          name="heading"
          value={activity.heading}
          onChange={(e) => onChange('heading', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          name="description"
          value={activity.description}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time *
        </label>
        <input
          type="time"
          name="time"
          value={activity.time}
          onChange={(e) => onChange('time', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={activity.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  );
};

export default ActivityForm;