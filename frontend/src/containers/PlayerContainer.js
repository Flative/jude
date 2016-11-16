import React from 'react';
import { connect } from 'react-redux';
import YouTube from 'react-youtube';

import { playPlayer, pausePlayer, registerPlayer, finishFetch, startFetch, finishPlayer, updatePlayerVideo } from '../reducers/playerReducer';

import ProgressBar from 'react-progress-bar-plus';
import PrevIcon from 'react-icons/lib/md/skip-previous';
import NextIcon from 'react-icons/lib/md/skip-next';
import PlayIcon from 'react-icons/lib/md/play-circle-outline';
import PauseIcon from 'react-icons/lib/md/pause-circle-outline';


class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
    this.handlePPButtonClick = this.handlePPButtonClick.bind(this);
  }

  onYouTubeReady(e) {
    const { dispatch } = this.props;
    const youtubePlayer = e.target;
    dispatch(registerPlayer(youtubePlayer));
  }

  handlePPButtonClick() {
    const { isPaused, youtubePlayer } = this.props.player;
    const { dispatch } = this.props;

    if (isPaused) {
      playPlayer(youtubePlayer);
    } else {
      pausePlayer(youtubePlayer);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.playlist.activeItem !== nextProps.playlist.activeItem) {
      const { id, index } = nextProps.playlist.activeItem;
      this.props.dispatch(updatePlayerVideo(id, index));
    }
  }
  render() {
    const { player, playlist, dispatch } = this.props;
    const { isPaused, isFetching, currentVideoId, youtubePlayer, progressBarPercentage } = player;
    const { activeItem } = playlist;
    const youtubeOptions = {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    };

    const style = {};
    if (activeItem) {
      // TODO: Thumbnail image can't be loaded
      style.backgroundImage = `url(http://img.youtube.com/vi/${activeItem.id}/maxresdefault.jpg)`;
    }

    return (
      <div
        className="player"
        style={style}
      >
        <YouTube
          className="player__youtube"
          onReady={this.onYouTubeReady}
          opts={youtubeOptions}
          videoId={activeItem ? activeItem.id : null}
        />
        }
        <h3 className="player__title">
          {activeItem && youtubePlayer.getVideoData().title}
        </h3>
        <div className="player__cover"></div>
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
            percent={progressBarPercentage}
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
    playlist: state.playlist,
  })
)(PlayerContainer);
