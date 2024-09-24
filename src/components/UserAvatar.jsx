import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import SecureLS from "secure-ls";

const UserAvatar = () => {
  const [user, setUser] = useState(null);
  const ls = new SecureLS({ encodingType: "aes" });

  useEffect(() => {
    const storedUser = ls.get("loggedInUser");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return null;
  }

  const getInitials = (name, email) => {
    if (name) {
      const nameParts = name.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      } else {
        return name[0].toUpperCase();
      }
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const initials = getInitials(user.name, user.email);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Avatar name={initials} round={true} size="40" />
      <div
        style={{
          marginLeft: "10px",
          fontSize: "15px",
          color: "#4C6073",
          textAlign: "left",
        }}
      >
        <p>{user.name}</p>
        <p>{user.email}</p>
      </div>
    </div>
  );
};

export default UserAvatar;
