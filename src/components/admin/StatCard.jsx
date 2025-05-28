const StatCard = ({ title, value, icon, color }) => {
  const bgColor = `bg-${color}-100`;
  const borderColor = `border-${color}-200`;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm  ${borderColor} overflow-hidden relative`}
    >
      <div
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 ${bgColor}`}
      ></div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-500 mb-2 font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
