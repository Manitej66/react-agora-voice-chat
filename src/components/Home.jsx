import Button from "@geist-ui/react/esm/button";
import Plus from "@geist-ui/react-icons/plus";
import Modal_ from "../utils/Modal";
import { useState } from "react";
import Rooms from "./Rooms";

const Home = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <>
      <Modal_ state={state} setState={setState} title={title} />

      <Button
        onClick={() => {
          setTitle("create room");
          setState(true);
        }}
        icon={<Plus />}
        type="success"
        width="100%"
      >
        Create room
      </Button>
      <Rooms />
    </>
  );
};

export default Home;
