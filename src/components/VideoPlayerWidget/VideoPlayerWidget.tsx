import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer: React.FC<any> = ({ src }: any) => {
  const videoRef: any = useRef(null);
  const [player, setPlayer] = useState<any>(null);
  const [visiblePlayButton, setVisiblePlayButton] = useState(false);
  const options:any = {
    fluid: true,
    controls: false,
    autoplay: true,
  };
  if(src !== '') options.sources = [src];

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      ...options,
    }, () => {
    });

    setPlayer(vjsPlayer);
  
    vjsPlayer.ready(() => {
      vjsPlayer.autoplay();
      var promise = vjsPlayer.play();
    
      if (promise !== undefined) {
        promise.catch(function(e: Error) {
          setVisiblePlayButton(true);
        });
      }
    });

    return () => {
      if (player !== null) {
        player.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (player !== null) {
      player.src({ src });
    }
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
      {visiblePlayButton &&
        <button
          className="vjs-big-play-button"
          type="button"
          style={{
            display: 'block',
            zIndex: 100,
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -45,
            marginTop: -24.49
          }}
          onClick={() => {
            player.play();
            setVisiblePlayButton(false);
          }}
        >
          <span className="vjs-icon-placeholder"></span>
        </button>
      }
    </div>
  );
};

export default VideoPlayer;