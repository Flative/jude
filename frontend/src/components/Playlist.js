import React from 'react';
import ClearIcon from 'react-icons/lib/md/clear';

class Playlist extends React.Component {
  render() {
    const { data = [], className } = this.props;

    return (
      <div className="playlist">
        <div className="playlist__header">
          <h2 className="playlist__title">Playlist</h2>
        </div>
        <ul className="playlist__body">
          {data.map(item =>
            <li
              className="playlist__item"
              key={item.uuid}
            >
              {item.title}
              <ClearIcon className="playlist__item__clear" />
            </li>
          )}
        </ul>
      </div>
    );
  }
}

Playlist.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
  })),
  className: React.PropTypes.string,
};
Playlist.defaultProps = {};

export default Playlist;
