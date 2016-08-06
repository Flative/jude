import React from 'react';
import { login, saveInputValues } from '../actions/mainAction';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
  }

  handleJoinButtonClick() {
    this.props.dispatch(saveInputValues(
      this.refs.email.value,
      this.refs.password.value
    ));
    this.props.router.push({ pathname: '/join' });
  }

  handleLoginButtonClick() {
    this.props.dispatch(login(
      this.refs.email.value,
      this.refs.password.value
    ));
  }

  render() {
    return (
      <div>
        <div className="form">
          <div className="input">
            <input ref="email" type="email" placeholder="이메일" />
          </div>
          <div className="input">
            <input ref="password" type="password" placeholder="패스워드" />
          </div>
        </div>
        <div className="btn-wrapper">
          <button
            className="btn btn-navy btn-main"
            onClick={this.handleJoinButtonClick}
          >
            가입하기
          </button>
          <button
            className="btn btn-cream btn-border-left btn-main"
            onClick={this.handleLoginButtonClick}
          >
            로그인
          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  router: React.PropTypes.object,
  dispatch: React.PropTypes.func,
  information: React.PropTypes.shape({
    email: React.PropTypes.string,
    password: React.PropTypes.string,
  }),
};
Login.defaultProps = {};

export default Login;
