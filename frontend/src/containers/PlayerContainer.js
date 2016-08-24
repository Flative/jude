import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import YouTube from 'react-youtube';
import ProgressBar from 'react-progress-bar-plus';

import { playPlayer, pausePlayer, startFetch, finishFetch, initializePlayer } from '../actions/playerAction';
import { youtubeTimeWatcher, youtubeStateWatcher } from '../utils/youtube';

class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
    this.handlePPButtonClick = this.handlePPButtonClick.bind(this);
    this.state = {
      player: null,
      percent: 0,
    };
  }

  handlePPButtonClick() {
    const { isPaused, instance } = this.props.player;
    const { dispatch } = this.props;

    if (isPaused) {
      dispatch(playPlayer(instance));
    } else {
      dispatch(pausePlayer(instance));
    }
  }

  onYouTubeReady(e) {
    const { dispatch } = this.props;
    const player = e.target;
    const duration = player.getDuration();

    dispatch(initializePlayer(player));
    player.mute(); // For development

    youtubeStateWatcher(player, this.props.dispatch);
    youtubeTimeWatcher(player, (sec) => {
      this.setState({ percent: (sec / duration) * 100 });
    });

    dispatch(playPlayer(player));
  }

  render() {
    const { isPaused, isFetching } = this.props.player;
    const youtubeOptions = {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    };

    return (
      <div className="player">
        <YouTube
          className="player__youtube"
          videoId="27VeWkC-Eg8"
          onReady={this.onYouTubeReady}
          opts={youtubeOptions}
        />
        <button
          onClick={this.handlePPButtonClick}
        >{isPaused
          ? '재생'
          : '일시정지'
        }</button>
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

PlayerContainer.propTypes = {
  isPaused: React.PropTypes.bool,
  isFetching: React.PropTypes.bool,
};
PlayerContainer.defaultProps = {};

export default withRouter(connect(
  (state) => ({
    player: state.player,
  })
)(PlayerContainer));
