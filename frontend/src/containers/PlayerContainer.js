import React from 'react';
import { connect } from 'react-redux';
import YouTube from 'react-youtube';
import classNames from 'classnames';

import { ProgressBar } from '../components';
import { playPlayer, pausePlayer, registerPlayer, finishFetch, startFetch, finishPlayer, registerProgressBar } from '../reducers/playerReducer';
import { updateActiveItemInPlaylist, getNextItem, getPrevItem, enableShuffle, enableRepeatAll, enableRepeatOne, disableShuffle, disableRepeat } from '../reducers/playlistReducer';

import PrevIcon from 'react-icons/lib/md/skip-previous';
import NextIcon from 'react-icons/lib/md/skip-next';
import PlayIcon from 'react-icons/lib/md/play-circle-outline';
import PauseIcon from 'react-icons/lib/md/pause-circle-outline';
import ShuffleIcon from 'react-icons/lib/md/shuffle';
import RepeatIcon from 'react-icons/lib/md/repeat';
import RepeatOneIcon from 'react-icons/lib/md/repeat-one';

class PlayerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onYouTubeReady = this.onYouTubeReady.bind(this);
    this.handlePPButtonClick = this.handlePPButtonClick.bind(this);
    this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this);
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
    this.handleShuffleButtonClick = this.handleShuffleButtonClick.bind(this);
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this);
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

  handleShuffleButtonClick() {
    const { playlist, dispatch } = this.props;
    if (playlist.shuffle) {
      dispatch(disableShuffle());
    } else {
      dispatch(enableShuffle());
    }
  }

  handleRepeatButtonClick() {
    const { playlist, dispatch } = this.props;
    const { repeat, shuffle } = playlist;

    if (shuffle) {
      // TODO: Should give a feedback to user
      console.log('Nothing there');
      return;
    }

    if (!repeat) {
      dispatch(enableRepeatAll());
    } else if (repeat === 'all') {
      dispatch(enableRepeatOne());
    } else if (repeat === 'one') {
      dispatch(disableRepeat());
    }
  }

  render() {
    const { player, playlist, dispatch } = this.props;
    const { isPaused, isFetching, currentVideoId, youtubePlayer, progressBarPercentage } = player;
    const { activeItem, repeat } = playlist;

    const youtubeOptions = {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    };

    const style = {};
    if (activeItem) {
      style.backgroundImage = `url(https://i.ytimg.com/vi/${activeItem.id}/maxresdefault.jpg)`;
    }

    const shuffleButtonClass = classNames({
      'player__btn-shuffle': true,
      'player__btn--disable': !playlist.shuffle,
    });

    const repeatButtonClass = classNames({
      'player__btn-repeat': true,
      'player__btn--disable': !playlist.repeat,
    });


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
          {activeItem && youtubePlayer ? youtubePlayer.getVideoData().title : ''}
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
          <div className="player__controller__center">
            <ProgressBar
              registerProgressBar={onPercentageChange => dispatch(registerProgressBar(onPercentageChange))}
            />
          </div>
          <div className="player__controller__right">
            <ShuffleIcon
              className={shuffleButtonClass}
              onClick={this.handleShuffleButtonClick}
            />
            {repeat === 'one'
              ? <RepeatOneIcon
                className={repeatButtonClass}
                onClick={this.handleRepeatButtonClick}
              />
              : <RepeatIcon
                className={repeatButtonClass}
                onClick={this.handleRepeatButtonClick}
              />
            }
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
