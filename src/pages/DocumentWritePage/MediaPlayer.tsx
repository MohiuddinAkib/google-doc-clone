import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import React, { useRef, useEffect } from "react";

export interface VideoPlayerProps {
    videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
    audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
}

const MediaPlayer = (props: VideoPlayerProps) => {
    const container = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!container.current) return;
        console.log("videotrack is", props.videoTrack)
        if (props.videoTrack) {
            const stream = new MediaStream([props.videoTrack.getMediaStreamTrack()])
            container.current.srcObject = stream;
        }
        // props.videoTrack?.play(container.current);
        return () => {
            props.videoTrack?.stop();
        };
    }, [props.videoTrack]);

    useEffect(() => {
        props.audioTrack?.play();
        return () => {
            props.audioTrack?.stop();
        };
    }, [props.audioTrack]);
    return (
        <video ref={container} autoPlay className="video-player" style={{ width: "100%", height: 240 }}></video>
    );
}

export default MediaPlayer;