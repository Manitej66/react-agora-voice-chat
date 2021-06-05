import Button from "@geist-ui/react/esm/button";
import Grid from "@geist-ui/react/esm/grid";
import Modal from "@geist-ui/react/esm/modal";
import Plus from "@geist-ui/react-icons/plus";
import Disc from "@geist-ui/react-icons/disc";
import Modal_ from "../utils/Modal";
import { useState } from "react";
import Rooms from "./Rooms";

const Home = () => {
  const [state, setState] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <>
      <Modal_ state={state} setState={setState} title={title} />
      <Grid.Container gap={2} justify="center">
        <Grid xs>
          <Button
            onClick={() => {
              setTitle("create room");
              setState(true);
            }}
            auto
            icon={<Plus />}
            type="secondary"
          >
            Create room
          </Button>
        </Grid>
        <Grid xs>
          <Button auto icon={<Disc />}>
            Join room
          </Button>
        </Grid>
      </Grid.Container>
      <Rooms />
    </>
  );
};

export default Home;
