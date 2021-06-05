import Button from "@geist-ui/react/esm/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useHistory } from "react-router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";

const Login = () => {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser) history.replace("/");
  });
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <Button
        onClick={() => {
          signInWithPopup(auth, provider)
            .then(() => {
              history.replace("/");
            })
            .catch((e) => console.log(e));
        }}
        size="large"
      >
        Login with google
      </Button>
    </div>
  );
};

export default Login;
