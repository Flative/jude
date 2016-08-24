import React from 'react';
import YouTube from 'react-youtube';
import ProgressBar from 'react-progress-bar-plus';
import { youtubeTimeWatcher } from '../utils/youtube';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
    this.state = {
      percent: 0,
    };
  }

  onYouTubeReady(e) {
    const player = e.target;
    const duration = player.getDuration();
    player.mute(); // For development
    youtubeTimeWatcher(player, (sec) => {
      this.setState({ percent: (sec / duration) * 100 });
      console.log(sec);
    });
  }

  render() {
    const youtubeOptions = {
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
          opts={youtubeOptions}
        />
        <ProgressBar
          className="player__progressbar"
          percent={this.state.percent}
          spinner={false}
          onTop={false}
        />
      </div>
    );
  }
}

Player.propTypes = {};
Player.defaultProps = {};

export default Player;
