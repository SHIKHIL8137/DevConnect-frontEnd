const NavItem = ({
  isOpen,
  icon,
  label,
  active = false,
  onClick = () => {},
}) => {
  return (
    <div
      className={`flex items-center px-4 py-3 mb-2 mx-2 rounded-xl cursor-pointer ${
        active ? "bg-blue-700 text-white" : "text-blue-200 hover:bg-blue-700/40"
      } transition-all duration-200`}
      onClick={onClick}
    >
      {icon}
      {isOpen && (
        <span
          className={`ml-3 font-medium ${
            active ? "text-white" : "text-blue-200"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
export default NavItem;
