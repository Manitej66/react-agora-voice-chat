import Text from "@geist-ui/react/esm/text";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import LogOut from "@geist-ui/react-icons/logOut";
import GitHub from "@geist-ui/react-icons/github";

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
        Clubhome 👋
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a
            href="https://github.com/Manitej66/clubhouse-clone-react"
            style={{ cursor: "pointer" }}
          >
            <GitHub />
          </a>
          <div style={{ cursor: "pointer" }}>{currentUser && <LogOut />}</div>
        </div>
      </Text>
    </div>
  );
};

export default Navbar;
