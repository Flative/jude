import React from 'react';

class Playlist extends React.Component {
  render() {
    const { data = [], className } = this.props;

    return (
      <div className="playlist">
        <div className="playlist__header">
          <h2 className="playlist__title">Playlist</h2>
        </div>
        <ul className="playlist__content">
          {
            data.length
            ? data.map(item =>
              <li key={item.id}>{item.title}</li>
            )
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
