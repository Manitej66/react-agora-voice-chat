import Text from "@geist-ui/react/esm/text";
import Avatar from "@geist-ui/react/esm/avatar";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <Text
        blockquote
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Clubhouse 👋
        <div>{currentUser && <Avatar src={currentUser.photoURL} />}</div>
      </Text>
    </div>
  );
};

export default Navbar;
