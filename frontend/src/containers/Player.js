import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { ProgressBar, YouTube } from '../components'
import { YOUTUBE_STATE, playSong, pauseSong, registerPlayer, registerProgressBar } from '../reducers/playerReducer'
import { updateActiveSong, getNextSong, getPrevItem, updateShuffleState, enableRepeatAll, enableRepeatOne, disableShuffle, disableRepeat } from '../reducers/playlistReducer'
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
    youtubePlayer.mute()
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
      dispatch(updateActiveSong(prevItem))
      return
    }

    // TODO
  }

  handleNextButtonClick() {
    const { player, playlist, app, dispatch } = this.props
    // const nextItem = getNextSong(playlist)
    //
    // if (!nextItem) {
    //   TODO: Should give a feedback to user
      // console.log('Nothing there')
      // return
    // }
    //
    // if (app.mode === APP_MODES.STANDALONE) {
    //   dispatch(updateActiveSong(nextItem))
    //   return
    // }
    //
    // TODO
  }

  handlePPButtonClick() {
    const { dispatch, player, app, playlist } = this.props
    const { isPaused, youtubePlayer, youtubePlayerState } = player
    const { songs, activeSong } = playlist

    if (!songs.length || youtubePlayerState === YOUTUBE_STATE.BUFFERING) {
      console.log('Nothing there')
      return
    }

    if (!activeSong && songs.length) {
      dispatch(updateActiveSong(songs[0]))
    } else if (isPaused) {
      dispatch(playSong())
    } else {
      dispatch(pauseSong())
    }
  }

  handleShuffleButtonClick() {
    const { playlist, app, dispatch } = this.props

    dispatch(updateShuffleState(!playlist.shuffle))
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
        autoplay: true,
      },
    }
  }

  getSongTitle() {
    const { player, playlist, app, dispatch } = this.props
    const { activeSong, repeat } = playlist
    const { youtubePlayer } = player
    const { mode } = app

    if (mode === APP_MODES.CLIENT) {
      // TODO
      return ''
    }

    return activeSong && youtubePlayer ? youtubePlayer.getVideoData().title : ''
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidUpdate(prevProps) {
    const _playlist = prevProps.playlist
    const _player = prevProps.player
    const { playlist, player, dispatch } = this.props
    const { youtubePlayer, updatePercentage, youtubePlayerState, isPaused, isFinished } = player
    const { hasPlaylistUpdated, songs, activeSong } = playlist

    // A first song has been added to playlist
    if (_playlist.songs.length === 0 && songs.length === 1) {
      dispatch(updateActiveSong(songs[0]))
    }

    if (!activeSong) {
      updatePercentage(0)
    }

    if (!isFinished && !_player.isPaused && isPaused) {
      youtubePlayer.pauseVideo()
    } else if (_player.isPaused && !isPaused && activeSong) {
      youtubePlayer.playVideo()
    }

    if (playlist.activeSong && _player.youtubePlayerState !== YOUTUBE_STATE.CUED && youtubePlayerState === YOUTUBE_STATE.CUED) {
      youtubePlayer.playVideo()
      // Song has changed
    } else if (activeSong && !_playlist.hasPlaylistUpdated && hasPlaylistUpdated) {
      updatePercentage(0)

      // New song has been activated in playlist that has had no active song previously
      if ((!_playlist.activeSong && playlist.activeSong)
        // (playlist.activeSong && _player.youtubePlayerState !== YOUTUBE_STATE.CUED && youtubePlayerState === YOUTUBE_STATE.CUED))
      ) {
          youtubePlayer.playVideo()

      } else {
        // Same song ID (which means user has added same song)
        if (_playlist.activeSong.id === playlist.activeSong.id) {
          youtubePlayer.seekTo(0)
        } else {
          youtubePlayer.playVideo()
        }
      }

    }
  }

  render() {
    const { player, playlist, app, dispatch } = this.props
    const { isPaused, isFinished, youtubePlayerState } = player
    const { songs, activeSong, repeat } = playlist
    const { mode } = app

    const style = {}
    if (activeSong) {
      style.backgroundImage = `url(https://i.ytimg.com/vi/${activeSong.id}/maxresdefault.jpg)`
    }

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
            videoId={activeSong ? activeSong.id : null}
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
            {!activeSong || youtubePlayerState !== YOUTUBE_STATE.PLAYING
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
              className={classNames({
                'player__btn-shuffle': true,
                'player__btn--disable': !playlist.shuffle,
              })
              }
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
