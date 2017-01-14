import React, { PropTypes } from 'react'
import className from 'classnames'
import ClearIcon from 'react-icons/lib/md/clear'

const Playlist = (props) => {
  const {
    songs,
    activeSong,
    onItemClick,
    onRemoveButtonClick,
  } = props

  return (
    <div className="playlist">
      <div className="playlist__header">
        <h2 className="playlist__title">Playlist</h2>
      </div>
      <ul className="playlist__body">
        {
          songs.length
          ? songs.map((item) => {
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
              {"Why don't you add a music here?"}
            </p>
          </div>
        }
      </ul>
    </div>
  )
}

Playlist.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    uuid: PropTypes.string,
    title: PropTypes.string,
    activeSong: PropTypes.object,
  })),
  activeSong: PropTypes.object,
  onItemClick: PropTypes.func,
  onRemoveButtonClick: PropTypes.func,
}
Playlist.defaultProps = {}

export default Playlist
