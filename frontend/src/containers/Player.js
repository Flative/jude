import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { ProgressBar, YouTube } from '../components'
import { playPlayer, pausePlayer, registerPlayer, finishFetch, startFetch, finishPlayer, registerProgressBar } from '../reducers/playerReducer'
import { updateActiveItemInPlaylist, getNextItem, getPrevItem, enableShuffle, enableRepeatAll, enableRepeatOne, disableShuffle, disableRepeat } from '../reducers/playlistReducer'
import { APP_MODES } from '../reducers/appReducer'

import PrevIcon from 'react-icons/lib/md/skip-previous'
import NextIcon from 'react-icons/lib/md/skip-next'
import PlayIcon from 'react-icons/lib/md/play-circle-outline'
import PauseIcon from 'react-icons/lib/md/pause-circle-outline'
import ShuffleIcon from 'react-icons/lib/md/shuffle'
import RepeatIcon from 'react-icons/lib/md/repeat'
import RepeatOneIcon from 'react-icons/lib/md/repeat-one'

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.onYouTubeReady = this.onYouTubeReady.bind(this)
    this.handlePPButtonClick = this.handlePPButtonClick.bind(this)
    this.handlePrevButtonClick = this.handlePrevButtonClick.bind(this)
    this.handleNextButtonClick = this.handleNextButtonClick.bind(this)
    this.handleShuffleButtonClick = this.handleShuffleButtonClick.bind(this)
    this.handleRepeatButtonClick = this.handleRepeatButtonClick.bind(this)
  }

  onYouTubeReady(e) {
    const { dispatch } = this.props
    const youtubePlayer = e.target
    dispatch(registerPlayer(youtubePlayer))
  }

  handlePrevButtonClick() {
    const { player, playlist, app, dispatch } = this.props
    const prevItem = getPrevItem(playlist)

    if (!prevItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there')
      return
    }

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(updateActiveItemInPlaylist(prevItem))
      return
    }

    // TODO
  }

  handleNextButtonClick() {
    const { player, playlist, app, dispatch } = this.props
    const nextItem = getNextItem(playlist)

    if (!nextItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there')
      return
    }

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(updateActiveItemInPlaylist(nextItem))
      return
    }

    // TODO
  }

  handlePPButtonClick() {
    const { dispatch, player, app, playlist } = this.props
    const { isPaused, youtubePlayer } = player

    if (!playlist.activeItem) {
      // TODO: Should give a feedback to user
      console.log('Nothing there')
      return
    }

    if (isPaused) {
      if (app.mode === APP_MODES.STANDALONE) {
        dispatch(playPlayer(youtubePlayer))
      } else {
        // TODO
      }
      return
    }

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(pausePlayer(youtubePlayer))
    } else {
      // TODO
    }
  }

  handleShuffleButtonClick() {
    const { playlist, app, dispatch } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      if (playlist.shuffle) {
        dispatch(disableShuffle())
      } else {
        dispatch(enableShuffle())
      }
      return
    }

    if (playlist.shuffle) {
      // TODO
    } else {
      // TODO
    }
  }

  handleRepeatButtonClick() {
    const { playlist, app, dispatch } = this.props
    const { repeat, shuffle } = playlist

    // If shuffle is active, repeat is automatically turned on
    if (shuffle) {
      // TODO: Should give a feedback to user
      console.log('Nothing there')
      return
    }

    if (app.mode === APP_MODES.STANDALONE) {
      if (!repeat) {
        dispatch(enableRepeatAll())
      } else if (repeat === 'all') {
        dispatch(enableRepeatOne())
      } else if (repeat === 'one') {
        dispatch(disableRepeat())
      }
      return
    }

    // TODO
  }

  getYoutubeOptions() {
    return {
      height: '0',
      width: '0',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: false,
      },
    }
  }

  getSongTitle() {
    const { player, playlist, app, dispatch } = this.props
    const { activeItem, repeat } = playlist
    const { youtubePlayer } = player
    const { mode } = app

    if (mode === APP_MODES.CLIENT) {
      // TODO
      return ''
    }

    return activeItem && youtubePlayer ? youtubePlayer.getVideoData().title : ''
  }

  render() {
    const { player, playlist, app, dispatch } = this.props
    const { isPaused, isFetching, currentVideoId, youtubePlayer, progressBarPercentage } = player
    const { activeItem, repeat } = playlist
    const { mode } = app

    const style = {}
    if (activeItem) {
      style.backgroundImage = `url(https://i.ytimg.com/vi/${activeItem.id}/maxresdefault.jpg)`
    }

    const shuffleButtonClass = classNames({
      'player__btn-shuffle': true,
      'player__btn--disable': !playlist.shuffle,
    })

    const repeatButtonClass = classNames({
      'player__btn-repeat': true,
      'player__btn--disable': !playlist.repeat,
    })

    return (
      <div
        className="player"
        style={style}
      >
        {mode !== APP_MODES.CLIENT ?
          <YouTube
            className="player__youtube"
            onReady={this.onYouTubeReady}
            opts={this.getYoutubeOptions()}
            videoId={activeItem ? activeItem.id : null}
          /> : null
        }
        <h3 className="player__title">
          {this.getSongTitle()}
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
              onProgressBarReady={updatePercentage => dispatch(registerProgressBar(updatePercentage))}
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
    )
  }
}

Player.propTypes = {
  isPaused: React.PropTypes.bool,
  isFetching: React.PropTypes.bool,
}
Player.defaultProps = {}

export default connect(
  (state) => ({
    player: state.player,
    playlist: state.playlist,
    app: state.app,
  })
)(Player)
