import React from 'react'
import PlusIcon from 'react-icons/lib/fa/plus'

class SearchResult extends React.Component {
  render() {
    const { query, items = [], handleItemClick } = this.props

    return (
      <div className="search__result">
        {/*<h1>{query || 'No Result Found'}</h1>*/}
        <ul className="search__result__list">
          {items.map((item, idx) => {
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
}

SearchResult.propTypes = {
  query: React.PropTypes.string,
  items: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.shape({
      kind: React.PropTypes.string,
      videoId: React.PropTypes.string,
    }),
    snippet: React.PropTypes.shape({
      title: React.PropTypes.string,
      description: React.PropTypes.string,
      thumbnails: React.PropTypes.shape({
        high: React.PropTypes.shape({
          url: React.PropTypes.string,
          width: React.PropTypes.number,
          height: React.PropTypes.number,
        }),
      }),
    }),
  })),
}
SearchResult.defaultProps = {}

export default SearchResult
