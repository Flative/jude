import chai from 'chai';
const { expect, assert } = chai;

import playlistReducer, { actions, initialState } from '../src/reducers/playlistReducer';

describe('Playlist Reducer', () => {
  it('should return the initial state', () => {
    expect(playlistReducer(undefined, {})).equal(initialState);
  });
});
