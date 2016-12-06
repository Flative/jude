import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeItemFromPlaylist, updateActiveItemInPlaylist } from '../reducers/playlistReducer'
import { Navbar, Playlist, ModeSelector } from '../components'
import { Search, Player } from './'
import { APP_MODES } from '../reducers/appReducer'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaylistRemoveButtonClick = this.handlePlaylistRemoveButtonClick.bind(this)
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this)
  }

  handlePlaylistRemoveButtonClick(item) {
    const { dispatch, app } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(removeItemFromPlaylist(item))
      return
    }

    // TODO
  }

  handlePlaylistItemClick(item) {
    const { dispatch, app } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(updateActiveItemInPlaylist(item))
      return
    }

    // TODO
  }

  render() {
    const { dispatch, auth, playlist } = this.props

    return (
      <div className="main">
        <Navbar />
        <Player />
        <Search />
        <Playlist
          className={"playlist"}
          items={playlist.items}
          activeItem={playlist.activeItem}
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
  updateActiveItemInPlaylist: PropTypes.func,
}
Main.defaultProps = {}

export default connect(state => ({
  auth: state.auth,
  playlist: state.playlist,
  app: state.app,
}))(Main)
