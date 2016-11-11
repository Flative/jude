import React from 'react';
import { connect } from 'react-redux';
import YouTube from 'react-youtube';

import { playPlayer, pausePlayer, registerPlayer, finishFetch, startFetch, finishPlayer } from '../reducers/playerReducer';
import { youtubeTimeWatcher } from '../utils/youtube';

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
    this.state = {
      percent: 0,
    };
  }

  // shouldComponentUpdate(nextProps) {
  //   return !this.props.player.instance ||
  //     this.props.playlist.activeItem.id !== nextProps.playlist.activeItem.id;
  // }

  youtubeStateWatcher(player) {
    const { dispatch } = this.props;
    const { ENDED, PAUSED, BUFFERING } = YT.PlayerState;
    let isBufferingStarted = false;

    player.addEventListener('onStateChange', (e) => {
      switch(e.data) {
        case BUFFERING:
          isBufferingStarted = true;
          dispatch(startFetch());
          break;
        case PAUSED:
          if (isBufferingStarted) {
            dispatch(finishFetch());
            isBufferingStarted = false;
          }
          break;
        case ENDED:
          dispatch(finishPlayer());
          break;
        default:
          break;
      }
    });
  }

  onYouTubeReady(e) {
    const { dispatch } = this.props;
    const player = e.target;
    const duration = player.getDuration();

    dispatch(registerPlayer(player));
    player.mute(); // For development


    this.youtubeStateWatcher(player);
    youtubeTimeWatcher(player, (sec) => {
      this.setState({ percent: (sec / duration) * 100 });
    });

    dispatch(playPlayer(player));
  }

  handlePPButtonClick() {
    const { isPaused, instance } = this.props.player;
    const { dispatch } = this.props;

    if (isPaused) {
      playPlayer(instance);
    } else {
      pausePlayer(instance);
    }
  }

  playSong() {
    // const { dispatch } = this.props;
    // const { instance } = this.props.player;

  }

  render() {
    const { player, playlist, dispatch } = this.props;
    const { isPaused, isFetching, currentVideoId, instance } = player;
    const { activeItem } = playlist;
    const youtubeOptions = {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    };

    const style = {};
    const isPlayerInitialized = !!player.instance;

    // console.log('isPlayerInitialized', isPlayerInitialized);
    if (isPlayerInitialized) {
      // TODO: Thumbnail image can't be loaded
      style.backgroundImage = `url(http://img.youtube.com/vi/${activeItem.id}/maxresdefault.jpg)`;
    }

    return (
      <div
        className="player"
        style={style}
      >
        {activeItem && activeItem.id &&
          <YouTube
            className="player__youtube"
            videoId={activeItem.id}
            onReady={this.onYouTubeReady}
            opts={youtubeOptions}
          />
        }
        <h3 className="player__title">
          {isPlayerInitialized && instance.getVideoData().title}
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
    playlist: state.playlist,
  })
)(PlayerContainer);
