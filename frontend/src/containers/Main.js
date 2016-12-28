import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeItemFromPlaylist, updateActiveItemInPlaylist } from '../reducers/playlistReducer'
import { Navbar, Playlist, ModeSelector } from '../components'
import { Search, Player } from './'
import { APP_MODES, establishWSConnection, disconnectWSConnection } from '../reducers/appReducer'

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.handlePlaylistRemoveButtonClick = this.handlePlaylistRemoveButtonClick.bind(this)
    this.handlePlaylistItemClick = this.handlePlaylistItemClick.bind(this)
  }

  componentWillReceiveProps(props) {
    if (props.app.mode === APP_MODES.STANDALONE) {
      return;
    }
    if (this.props.playlist.items.length === 0 && props.playlist.items.length === 1) {

      this.props.app.wsConnection.send(JSON.stringify({
        action: 'activate',
        body: {
          uuid: props.playlist.items[0].uuid,
        },
      }))
      // this.props.dispatch(updateActiveItemInPlaylist(props.playlist.items[0]))
    }
  }

  handlePlaylistRemoveButtonClick(item) {
    const { dispatch, app } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(removeItemFromPlaylist(item))
      return
    }

    app.wsConnection.send(JSON.stringify({
      action: 'delete',
      body: {
        uuid: item.uuid,
      },
    }))
  }

  handlePlaylistItemClick(item) {
    const { dispatch, app } = this.props

    if (app.mode === APP_MODES.STANDALONE) {
      dispatch(updateActiveItemInPlaylist(item))
      return
    }

    app.wsConnection.send(JSON.stringify({
      action: 'activate',
      body: {
        uuid: item.uuid,
      },
    }))
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
