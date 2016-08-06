import React from 'react';
import { join } from '../actions/mainAction';

class Join extends React.Component {
  constructor(props) {
    super(props);
    this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    const { information } = this.props;
    this.refs.email.value = information.email;
    this.refs.password.value = information.password;
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleJoinButtonClick();
    }
  }

  handleJoinButtonClick() {
    const { dispatch, router } = this.props;
    const { email, password, passwordCheck } = this.refs;
    const emailRe = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

    if (!email.value.length || !password.value.length || !passwordCheck.value.length) {
      alert('모두 입력해주세요.');
    } else if (emailRe.test(email.value) === false) {
      alert('올바르지 않은 이메일 형식입니다');
    } else if (password.value !== passwordCheck.value) {
      alert('패스워드가 다릅니다');
    } else {
      dispatch(join(email.value, password.value, router));
    }
  }

  render() {
    return (
      <div>
        <div className="form">
          <div className="input">
            <input
              ref="email"
              type="email"
              placeholder="이메일"
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <div className="input">
            <input
              ref="password"
              type="password"
              placeholder="패스워드"
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <div className="input">
            <input
              ref="passwordCheck"
              type="password"
              placeholder="패스워드 확인"
              onKeyPress={this.handleKeyPress}
            />
          </div>
        </div>
        <div className="btn-wrapper">
          <button
            onClick={this.handleJoinButtonClick}
            className="btn btn-navy btn-join"
          >
            가입하기
          </button>
        </div>
      </div>
    );
  }
}
Join.propTypes = {
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  information: React.PropTypes.shape({
    email: React.PropTypes.string,
    password: React.PropTypes.string,
  }),
};
Join.defaultProps = {};

export default Join;
