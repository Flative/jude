import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeSong, updateActiveSong } from '../reducers/playlistReducer'
import { Navbar, Playlist } from '../components'
import { Search, Player } from './'
import { changeAppMode, APP_MODES } from '../reducers/appReducer'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaylistRemoveButtonClick = this.handlePlaylistRemoveButtonClick.bind(this)
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this)
  }

  componentDidMount() {
    const pathname = window.location.pathname

    if (pathname.indexOf('controller') !== -1) {
      this.props.dispatch(changeAppMode(APP_MODES.CONTROLLER))
    } else if (pathname.indexOf('speaker') !== -1) {
      this.props.dispatch(changeAppMode(APP_MODES.SPEAKER))
    }
  }

  handlePlaylistRemoveButtonClick(item) {
    this.props.dispatch(removeSong(item))
  }

  handlePlaylistItemClick(item) {
    this.props.dispatch(updateActiveSong(item))
  }

  render() {
    const { dispatch, playlist, app } = this.props

    return (
      <div className="main">
        <Navbar
          changeAppMode={(mode) => () => dispatch(changeAppMode(mode))}
          isModeChanging={app.isModeChanging}
          mode={app.mode}
        />
        <Player />
        <Search />
        <Playlist
          className="playlist"
          songs={playlist.songs}
          activeSong={playlist.activeSong}
          onItemClick={this.handlePlaylistItemClick}
          onRemoveButtonClick={this.handlePlaylistRemoveButtonClick}
        />
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func,
  playlist: PropTypes.object,
  app: PropTypes.object,
}
Main.defaultProps = {}

export default connect(state => ({
  auth: state.auth,
  playlist: state.playlist,
  app: state.app,
}))(Main)
