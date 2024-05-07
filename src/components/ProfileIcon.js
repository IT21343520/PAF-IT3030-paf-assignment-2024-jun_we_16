//get user name and genarate a profile icon
export const ProfileIcon = ({ user, color, textColor, size }) => {
  //   console.log(user, color);
  return (
    <div className="flex items-center">
      <div
        className="flex items-center justify-center h-10 w-10 bg-gray-200 rounded-full "
        style={{
          backgroundColor: color,
          width: size,
          height: size,
        }}
      >
        <span
          className="text-lg font-semibold text-gray-600 uppercase"
          style={{
            color: textColor,
          }}
        >
          {user[0]}
          {user[1]}
        </span>
      </div>
    </div>
  );
};
