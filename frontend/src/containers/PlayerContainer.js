import React from 'react';
import { connect } from 'react-redux';
import YouTube from 'react-youtube';

import { ProgressBar } from '../components';
import { playPlayer, pausePlayer, registerPlayer, finishFetch, startFetch, finishPlayer, registerProgressBar } from '../reducers/playerReducer';
import { updateActiveItemInPlaylist, getNextItem, getPrevItem } from '../reducers/playlistReducer';

import PrevIcon from 'react-icons/lib/md/skip-previous';
import NextIcon from 'react-icons/lib/md/skip-next';
import PlayIcon from 'react-icons/lib/md/play-circle-outline';
import PauseIcon from 'react-icons/lib/md/pause-circle-outline';


class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
    this.handlePPButtonClick = this.handlePPButtonClick.bind(this);
    this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
  }

  onYouTubeReady(e) {
    const { dispatch } = this.props;
    const youtubePlayer = e.target;
    dispatch(registerPlayer(youtubePlayer));
  }

  handlePrevButtonClick() {
    const { player, playlist, dispatch } = this.props;
    const prevItem = getPrevItem(playlist);

    if (!prevItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there');
      return;
    }

    dispatch(updateActiveItemInPlaylist(prevItem));
  }

  handleNextButtonClick() {
    const { player, playlist, dispatch } = this.props;
    const nextItem = getNextItem(playlist);

    if (!nextItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there');
      return;
    }

    dispatch(updateActiveItemInPlaylist(nextItem));
  }

  handlePPButtonClick() {
    const { dispatch, player, playlist } = this.props;
    const { isPaused, youtubePlayer } = player;

    if (!playlist.activeItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there');
      return;
    }

    if (isPaused) {
      dispatch(playPlayer(youtubePlayer));
    } else {
      dispatch(pausePlayer(youtubePlayer));
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
      // style.backgroundImage = `url(http://img.youtube.com/vi/${activeItem.id}/maxresdefault.jpg)`;
      style.backgroundImage = `url(https://i.ytimg.com/vi/${activeItem.id}/hqdefault.jpg)`;
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
        <h3 className="player__title">
          {activeItem ? youtubePlayer.getVideoData().title : ''}
        </h3>
        <div className="player__cover"></div>
        <div className="player__controller">
          <div className="player__controller__left">
            <PrevIcon
              className="player__btn-prev"
              onClick={this.handlePrevButtonClick}
            />
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
            <NextIcon
              className="player__btn-next"
              onClick={this.handleNextButtonClick}
            />
          </div>

          <ProgressBar
            registerProgressBar={onPercentageChange => dispatch(registerProgressBar(onPercentageChange))}
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
