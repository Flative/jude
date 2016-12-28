import React from 'react'
import className from 'classnames'
import ClearIcon from 'react-icons/lib/md/clear'

class Playlist extends React.Component {
  render() {
    const {
      songs,
      activeSong,
      onItemClick,
      onRemoveButtonClick,
    } = this.props

    return (
      <div className="playlist">
        <div className="playlist__header">
          <h2 className="playlist__title">Playlist</h2>
        </div>
        <ul className="playlist__body">
          {
            songs.length
            ? songs.map(item => {
              const itemClass = className({
                'playlist__item': true,
                'playlist__item--active': activeSong && (activeSong.uuid === item.uuid),
              })
              return (
                <li
                  className={itemClass}
                  key={item.uuid}
                  onClick={(e) => {
                    e.preventDefault()
                    onItemClick(item)
                  }}
                >
                  {item.title}
                  <ClearIcon
                    className="playlist__item__btn-clear"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveButtonClick(item)
                    }}
                  />
                </li>
              )
            })
            : <div className="playlist__blankslate">
              <h3 className="playlist__blankslate__title">
                Playlist is empty
              </h3>
              <p className="playlist__blankslate__subtitle">
                Why don't you add a music here?
              </p>
            </div>
          }
        </ul>
      </div>
    )
  }
}

Playlist.propTypes = {
  songs: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
  })),
  className: React.PropTypes.string,
}
Playlist.defaultProps = {}

export default Playlist
