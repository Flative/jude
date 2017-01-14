import React, { PropTypes } from 'react'
import PlusIcon from 'react-icons/lib/fa/plus'

const SearchResult = (props) => {
  const { songs = [], handleItemClick } = props

  return (
    <div className="search__result">
      <ul className="search__result__list">
        {songs.map((item, idx) => {
          return (
            <li className="search__result__item" key={item.id.videoId + idx}>
              <div className="search__result__item__pad">
                <img
                  className="search__result__thumbnail"
                  src={item.snippet.thumbnails.high.url}
                  role="presentation"
                />
                <div className="search__result__title">{item.snippet.title}</div>
                <div
                  className="search__result__item__cover"
                  onClick={() => handleItemClick(item.id.videoId, item.snippet.title)}
                >
                  <PlusIcon />
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

SearchResult.propTypes = {
  songs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.shape({
      kind: PropTypes.string,
      videoId: PropTypes.string,
    }),
    snippet: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      thumbnails: PropTypes.shape({
        high: PropTypes.shape({
          url: PropTypes.string,
          width: PropTypes.number,
          height: PropTypes.number,
        }),
      }),
    }),
  })),
  handleItemClick: PropTypes.func,
}
SearchResult.defaultProps = {}

export default SearchResult
