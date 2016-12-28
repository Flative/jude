import chai from 'chai';
const { expect, assert, should } = chai;
import reducer from '../src/reducers';
import playlistReducer, { actions, initialState, addItemToPlaylist } from '../src/reducers/playlistReducer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Playlist Reducer', () => {
  it('should return the initial state', () => {
    expect(playlistReducer(undefined, {})).equal(initialState);
  });


  // describe(`should handle ${actions.PLAYLIST_ITEM_ADDED}`, () => {
  //   const title = 'Beenzino - Time Travel';
  //   const store = mockStore(initialState)
  //
  //   // store.dispatch(addItemToPlaylist(1000, title))
  //   //   .then(() => {
  //   //     const actions = store.getActions()
  //   //     console.log(actions);
  //   //   })
  //
  //   const state = playlistReducer(undefined, addItemToPlaylist(1000, title));
  //   it('doesNextItemExist should be a false', () => {
  //     expect(state.doesNextItemExist).to.equal(false);
  //   });
  //
  //   it(`First item's title should be matched with ${title}`, () => {
  //     console.log(state.items)
  //     expect(state.items[0].title).to.equal(title);
  //   });
  //
  //   const state2 = playlistReducer(state, addItemToPlaylist())
  //   // expect(reducer(null, addItemToPlaylist(123, 'MY_TITLE')))
  //   //   .equal({
  //   //     items: [{
  //   //
  //   //     }],
  //   //     doesNextItemExist: false,
  //   //   })
  // })
});
