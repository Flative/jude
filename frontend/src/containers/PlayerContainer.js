import React from 'react';
import { connect } from 'react-redux';

import YouTube from 'react-youtube';
import ProgressBar from 'react-progress-bar-plus';
import PrevIcon from 'react-icons/lib/md/skip-previous';
import NextIcon from 'react-icons/lib/md/skip-next';
import PlayIcon from 'react-icons/lib/md/play-circle-outline';
import PauseIcon from 'react-icons/lib/md/pause-circle-outline';

import { playPlayer, pausePlayer, initializePlayer } from '../actions/playerAction';
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
    const { player } = this.props;
    const { isPaused, isFetching, currentVideoId, instance } = player;
    const youtubeOptions = {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    };

    const style = {};
    const isPlayerInitialized = !!player.instance;

    if (isPlayerInitialized) {
      const videoId = player.instance.getVideoData().video_id;

      // TODO: Thumbnail image can't be loaded
      style.backgroundImage = `url(http://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
    }

    return (
      <div
        className="player"
        style={style}
      >
        {currentVideoId &&
          <YouTube
            className="player__youtube"
            videoId={currentVideoId}
            onReady={this.onYouTubeReady}
            opts={youtubeOptions}
          />
        }
        <h3 className="player__title">
          {isPlayerInitialized && instance.getVideoData().title}
        </h3>
        <div className="player__controller">
          <div className="player__controller__left">
            <PrevIcon className="player__btn-prev">prev</PrevIcon>
            {isPaused
              ? <PlayIcon
                className="player__btn-pp"
                onClick={this.handlePPButtonClick}
              />
              : <PauseIcon
                className="player__btn-pp"
                onClick={this.handlePPButtonClick}
              />
            }
            <NextIcon className="player__btn-next">next</NextIcon>
          </div>
          <ProgressBar
            className="player__progressbar"
            percent={this.state.percent}
            spinner={false}
            onTop={false}
          />
          <div className="player__controller__right">

          </div>

        </div>
      </div>
    );
  }
}

PlayerContainer.propTypes = {
  isPaused: React.PropTypes.bool,
  isFetching: React.PropTypes.bool,
};
PlayerContainer.defaultProps = {};

export default connect(
  (state) => ({
    player: state.player,
  })
)(PlayerContainer);
