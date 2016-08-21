import React from 'react';
import YouTube from 'react-youtube';
import { youtubeTimeWatcher } from '../utils/youtube';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
  }

  onYouTubeReady(e) {
    const player = e.target;
    player.mute();
    youtubeTimeWatcher(player, () => {

    });
  }

  render() {
    const opts = {

      height: '200',
      width: '200',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      }
    };

    return (
      <div className="player">
        <YouTube
          className="player__youtube"
          videoId="27VeWkC-Eg8"
          onReady={this.onYouTubeReady}
          opts={opts}
        />
      </div>
    );
  }
}

Player.propTypes = {};
Player.defaultProps = {};

export default Player;
