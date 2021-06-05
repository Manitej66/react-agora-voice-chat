import { useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import Loading from "@geist-ui/react/esm/loading";
import Avatar from "@geist-ui/react/esm/avatar";
import Button from "@geist-ui/react/esm/button";
import Modal from "@geist-ui/react/esm/modal";
import Dot from "@geist-ui/react/esm/dot";
import Select from "@geist-ui/react/esm/select";
import Grid from "@geist-ui/react/esm/grid";
import Text from "@geist-ui/react/esm/text";
import Slider from "@geist-ui/react/esm/slider";
import Popover from "@geist-ui/react/esm/popover";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import AgoraRTC from "agora-rtc-sdk";
import MicOff from "@geist-ui/react-icons/micOff";
import Mic from "@geist-ui/react-icons/mic";
import Radio from "@geist-ui/react-icons/radio";
import Speaker from "@geist-ui/react-icons/speaker";
import LogOut from "@geist-ui/react-icons/logOut";

let client = AgoraRTC.createClient({
  mode: "live",
  codec: "vp8",
});

client.init(process.env.REACT_APP_AGORA_KEY);
client.setClientRole("host");

// client.enableAudiostreamIndicator(); // Triggers the "volume-indicator" callback event every two seconds.

let handleError = function (err) {
  console.log("Error: ", err);
};

const Join = () => {
  const { id } = useParams();
  const loc = useLocation();
  const history = useHistory();
  const [load, setLoad] = useState(false);
  const [active, setActive] = useState([]);
  const [room, setRoom] = useState("");
  const [conn_state, setConn_state] = useState("");
  const [stream_id, setStreamId] = useState(0);
  const [mute, setMute] = useState(false);
  const [stream, setstream] = useState();
  const [state, setState] = useState(false);
  const [volume, setVolume] = useState(50);
  const [profiles, setProfiles] = useState([
    "speech_low_quality",
    "speech_standard",
    "music_standard",
    "standard_stereo",
    "high_quality",
    "high_quality_stereo",
  ]);
  const [audio_input, setAudio_input] = useState([]);

  const { currentUser } = useContext(AuthContext);

  // Add video streams to the container.
  async function addVideoStream(elementId) {
    let remoteContainer = document.getElementById("remote");

    // Creates a new div for every stream
    let streamDiv = document.createElement("div");
    // Assigns the elementId to the div.
    streamDiv.id = elementId;
    // Takes care of the lateral inversion
    streamDiv.style.transform = "rotateY(180deg)";
    // Adds the div to the container.
    remoteContainer.appendChild(streamDiv);

    // const members = await (await getDoc(doc(db, "rooms", id))).data().members;

    // const exists = members.some((el) => el.streamId == elementId);

    // const found = members.some((el) => el.uid == currentUser.uid);

    // if (!exists && !found) {
    //   updateDoc(doc(db, "rooms", id), {
    //     members: arrayUnion({
    //       uid: currentUser.uid,
    //       pic: currentUser.photoURL,
    //       name: currentUser.displayName,
    //       streamId: elementId,
    //     }),
    //   }).catch((e) => console.log(e));
    // }
  }

  // Remove the video stream from the container.
  async function removeVideoStream(elementId) {
    let remoteDiv = document.getElementById(elementId);
    if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
  }

  const join = async () => {
    setLoad(true);
    const { token, uid } = await (
      await fetch(
        `https://agora-token.azurewebsites.net/api/trigger?name=${room}`
      )
    ).json();
    client.join(token, room, uid, async (userId) => {
      setStreamId(userId);
      let new_active = active.filter((user) => user.uid != currentUser.uid);
      new_active.push({
        uid: currentUser.uid,
        pic: currentUser.photoURL,
        name: currentUser.displayName,
        userId: userId,
      });
      await updateDoc(doc(db, "rooms", id), {
        members: new_active,
      })
        .then(() => {
          let localStream = AgoraRTC.createStream({
            audio: true,
            video: false,
          });
          setstream(localStream);
          localStream.init(() => {
            localStream.play("me");
            client.publish(localStream, handleError);
            client.on("stream-added", function (evt) {
              client.subscribe(evt.stream, handleError);
            });
            client.on("stream-subscribed", function (evt) {
              let stream = evt.stream;
              let streamId = String(stream.getId());
              addVideoStream(streamId);
              stream.play(streamId);
            });
            client.on("connection-state-change", (evt) => {
              setConn_state(evt.curState);
            });
            client.on("stream-removed", function (evt) {
              let stream = evt.stream;
              let streamId = String(stream.getId());
              stream.close();
              removeVideoStream(streamId);
            });
            client.on("peer-leave", function (evt) {
              let stream = evt.stream;
              let streamId = String(stream.getId());
              stream.close();
              removeVideoStream(streamId);
            });
          }, handleError);
          setLoad(false);
          setConn_state(client.getConnectionState());
          setStreamId(userId);
        })
        .catch((e) => console.log(e));
    });
  };

  useEffect(() => {
    window.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ""; // Legacy method for cross browser support
      }
      return ""; // Legacy method for cross browser support
    };

    AgoraRTC.getDevices((devices) => {
      let l = [];
      devices.map((device) => {
        if (device.kind == "audioinput") {
          l.push(device);
        }
      });
      setAudio_input(l);
    });

    console.log(stream_id);
    onSnapshot(doc(db, "rooms", id), (room) => {
      setActive(room.data()?.members);
      setRoom(room.data()?.room_name);
    });
  }, [currentUser]);

  if (load) return <Loading size="large">Joining</Loading>;

  return (
    <div>
      <Modal open={state} onClose={() => setState(false)}>
        <Modal.Title>Audio profile 🎙</Modal.Title>
        <Modal.Subtitle>
          Higher the profile, higher the bandwidth
        </Modal.Subtitle>
        <Modal.Content style={{ margin: "20px auto" }}>
          <Select
            placeholder="Choose profile"
            onChange={(e) => stream.setAudioProfile(e)}
          >
            {profiles.map((profile, i) => (
              <Select.Option key={i} value={profile}>
                {profile.split("_").join(" ")}
              </Select.Option>
            ))}
          </Select>
        </Modal.Content>
      </Modal>
      {conn_state == "CONNECTED" ? (
        <>
          <Text h4 style={{ textTransform: "capitalize", textAlign: "center" }}>
            participants
          </Text>
          <div id="me"></div>
          <div id="remote"></div>
          <Grid.Container gap={0}>
            {active.map((person, i) => (
              <Grid key={i} xs={8} key={person.uid}>
                <div style={{ margin: "0 auto" }}>
                  <Avatar src={person.pic} alt="pic" size="medium" />
                  <p style={{ textAlign: "center" }}>
                    {person?.name?.split(" ")[0]}
                  </p>
                </div>
              </Grid>
            ))}
          </Grid.Container>
          <Dot style={{ margin: "20px 0" }}>{conn_state}</Dot>
        </>
      ) : (
        <Button
          onClick={join}
          size="large"
          style={{ display: "block", width: "100%" }}
        >
          Join room
        </Button>
      )}
      {stream && (
        <div>
          <div
            style={{
              position: "absolute",
              bottom: 10,
              padding: 10,
              width: "90%",
            }}
          >
            <div style={{ marginBottom: 30 }}>
              <p>Speaker Volume</p>
              <Slider
                value={volume}
                onChange={(val) => {
                  setVolume(val);
                  stream.setAudioVolume(val);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                {mute ? (
                  <MicOff
                    color="red"
                    onClick={() => {
                      stream.unmuteAudio();
                      setMute(false);
                    }}
                    size={32}
                  />
                ) : (
                  <Mic
                    onClick={() => {
                      stream.muteAudio();
                      setMute(true);
                    }}
                    size={32}
                  />
                )}
              </div>
              <Popover
                placement="top"
                enterDelay={0}
                content={() => (
                  <>
                    <Popover.Item title>
                      <span>Select input device</span>
                    </Popover.Item>
                    {audio_input.map((d, i) => (
                      <Popover.Item
                        key={i}
                        onClick={() =>
                          stream.switchDevice("audio", d.deviceId, () => {
                            console.log("success");
                          })
                        }
                      >
                        {d.label}
                      </Popover.Item>
                    ))}
                  </>
                )}
              >
                <Speaker size={32} onClick={() => {}} />
              </Popover>
              <Radio size={32} onClick={() => setState(true)} />
              <LogOut
                size={32}
                onClick={() => {
                  client.leave(() => {
                    updateDoc(doc(db, "rooms", id), {
                      members: active.filter(
                        (member) => member.userId !== parseInt(stream_id)
                      ),
                    })
                      .then(() => history.replace("/"))
                      .catch((e) => console.log(e));
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Join;
