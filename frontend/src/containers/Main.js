import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeSong, updateActiveSong } from '../reducers/playlistReducer'
import { Navbar, Playlist, ModeSelector } from '../components'
import { Search, Player } from './'
import { APP_MODES, establishWSConnection, disconnectWSConnection } from '../reducers/appReducer'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaylistRemoveButtonClick = this.handlePlaylistRemoveButtonClick.bind(this)
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this)
  }

  handlePlaylistRemoveButtonClick(item) {
    const { dispatch, app } = this.props

    dispatch(removeSong(item))
  }

  handlePlaylistItemClick(item) {
    const { dispatch, app } = this.props

    dispatch(updateActiveSong(item))
  }


  render() {
    const { dispatch, auth, playlist, app } = this.props

    return (
      <div className="main">
        <Navbar
          establishConnection={(mode, address) => dispatch(establishWSConnection(mode, address))}
          disconnectConnection={(cb) => dispatch(disconnectWSConnection(cb))}
          isModeChanging={app.isModeChanging}
          mode={app.mode}
        />
        <Player />
        <Search />
        <Playlist
          className={"playlist"}
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
  children: PropTypes.node,
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  playlist: PropTypes.object,
  app: PropTypes.object,
  removeItemFromPlaylist: PropTypes.func,
}
Main.defaultProps = {}

export default connect(state => ({
  auth: state.auth,
  playlist: state.playlist,
  app: state.app,
}))(Main)
