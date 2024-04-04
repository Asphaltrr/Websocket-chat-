import { useState } from "react";

function AvatarSelector({ onSelect }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const avatars = [
    "/avatar1.jpg",
    "/avatar2.jpg",
    "/avatar3.jpg",
    "/avatar4.jpg",
    "/avatar5.jpg",
    "/avatar6.jpg",
    "/avatar7.jpg",
    "/avatar9.jpg",
  ];

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect(avatar);
  };

  return (
    <div className="avatar-selector">
      {avatars.map((avatar, index) => (
        <img
          className={
            avatar === selectedAvatar ? "avatarPicSelected" : "avatarPic"
          }
          key={index}
          src={avatar}
          alt={`Avatar ${index}`}
          onClick={() => handleSelect(avatar)}
        />
      ))}
    </div>
  );
}

export default AvatarSelector;
