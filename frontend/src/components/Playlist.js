import React from 'react';

class Playlist extends React.Component {
  render() {
    const { data = [], className } = this.props;

    return (
      <div className="playlist">
        <div className="playlist__header">
          <h2 className="playlist__title">Playlist</h2>
        </div>
        <ul>
          {data.map(item =>
            <li key={item.id}>{item.title}</li>)
          }
        </ul>
      </div>
    );
  }
}

Playlist.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.string,
    title: React.PropTypes.string,
  })),
  className: React.PropTypes.string,
};
Playlist.defaultProps = {};

export default Playlist;
