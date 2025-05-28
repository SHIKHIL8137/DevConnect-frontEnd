const ProjectStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "committed":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default ProjectStatusBadge;
