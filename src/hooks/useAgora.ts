import { container } from "@src/appEngine";
import { useState, useEffect } from "react";
import { ConfigService } from "@config/ConfigService";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  IMicrophoneAudioTrack,
  CameraVideoTrackInitConfig,
  MicrophoneAudioTrackInitConfig,
} from "agora-rtc-sdk-ng";

const config = container.get(ConfigService);

export default function useAgora(client: IAgoraRTCClient | undefined) {
  const [localVideoTrack, setLocalVideoTrack] = useState<
    ICameraVideoTrack | undefined
  >(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<
    IMicrophoneAudioTrack | undefined
  >(undefined);

  const [joinState, setJoinState] = useState(false);
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  async function createLocalTracks(
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] =
      await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  const mute = async (type: "audio" | "video") => {
    if (type === "audio") {
      await localAudioTrack?.setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await localVideoTrack?.setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  async function join(
    channel: string,
    token?: string,
    uid?: string | number | null
  ) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();

    await client.join(config.agoraAppId, channel, token || null);
    await client.publish([microphoneTrack, cameraTrack]);

    setJoinState(true);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client?.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      console.log("subscribed to remote user");
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      console.log("remote user joinded", user);

      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };
    client.on("user-left", handleUserLeft);
    client.on("user-joined", handleUserJoined);
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);

  return {
    mute,
    join,
    leave,
    joinState,
    trackState,
    remoteUsers,
    localAudioTrack,
    localVideoTrack,
  };
}
