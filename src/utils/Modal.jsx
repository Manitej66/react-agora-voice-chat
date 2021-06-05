import Modal from "@geist-ui/react/esm/modal";
import Input from "@geist-ui/react/esm/input";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useHistory } from "react-router-dom";

const Modal_ = ({ state, title, setState }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const history = useHistory();

  const createRoom = async () => {
    if (name.trim().length > 0) {
      setLoading(true);

      const room = await addDoc(collection(db, "rooms"), {
        room_name: name,
        created_at: new Date(),
        owner: {
          uid: currentUser.uid,
          pic: currentUser.photoURL,
          name: currentUser.displayName,
        },
        members: [],
      });

      history.push({
        pathname: `/join/${room.id}`,
      });

      setLoading(false);
      setState(false);
    }
  };

  return (
    <Modal open={state} onClose={() => setState(false)}>
      <Modal.Title>{title}</Modal.Title>
      <Modal.Content>
        <Input
          width="100%"
          required
          size="large"
          placeholder="room name"
          onChange={(e) => setName(e.target.value)}
        />
      </Modal.Content>
      <Modal.Action passive onClick={() => setState(false)}>
        Cancel
      </Modal.Action>
      <Modal.Action loading={loading} onClick={createRoom}>
        create
      </Modal.Action>
    </Modal>
  );
};

export default Modal_;
