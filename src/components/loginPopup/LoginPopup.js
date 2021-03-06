import { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInWithPopupHandler, googleProvider, appleProvider } from '../../firebase/app';
import crypto from 'crypto-js';

import './LoginPopup.scss';

import { memberActions } from '../../store/memberSlice';
import { backgroundActions } from '../../store/backgroundSlice';
import { musicActions } from '../../store/musicSlice';
import { avatarActions } from '../../store/avatarSlice';
import { deviceActions } from '../../store/deviceSlice';

import spinner from '../../svg/20px/spinner-solid.svg';
import googleSigninBtn from './icon/Google Sign in button Web.svg';
import appleSigninBtn from './icon/Apple Sign in button Web.svg';
import googleSignupBtn from './icon/Google Sign up button Web.svg';
import appleSignupBtn from './icon/Apple Sign up button Web.svg';

function LoginPopup(props) {
  const languageIndex = useSelector((store) => store.language.languageIndex);

  const dispatch = useDispatch();

  const [signingUp, setSigningUp] = useState(true);
  const [verificationCode, setVerificationCode] = useState(undefined);
  const [resetPasswordVerificationCode, setResetPasswordVerificationCode] = useState(undefined);

  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [invalidResetPasswordVerificationCode, setInvalidResetPasswordVerificationCode] = useState(false);
  const [allowEnterNewPassword, setAllowEnterNewPassword] = useState(false);

  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [errorDuringAuthen, setErrorDuringAuthen] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [accountNotExist, setAccountNotExist] = useState(false);
  const [accountAlreadyExist, setAccountAlreadyExist] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(undefined);
  const [invalidCode, setInvalidCode] = useState(false);
  const [newPasswordNotMatch, setNewPasswordNotMatch] = useState(false);
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);

  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [receiveNews, setReceiveNews] = useState(undefined);

  const emailRef = useRef();
  const passwordRef1 = useRef();
  const passwordRef2 = useRef();
  const checkboxRef1 = useRef();
  const checkboxRef2 = useRef();
  const verificationCodeRef = useRef();
  const resetPasswordEmailRef = useRef();
  const resetPasswordVerificationCodeRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  const { closeHandler } = props;

  const signUpSubmitHandler = useCallback(() => {
    if (loading || !emailRef.current || !passwordRef1.current || !passwordRef2.current || !checkboxRef1.current) {
      return;
    }

    const email = emailRef.current.value;
    const password = passwordRef1.current.value;
    const confirmPassword = passwordRef2.current.value;

    const invalidEmail = !email.includes('@');
    const invalidPassword = password.length < 6;
    const passwordNotMatch = password !== confirmPassword;
    const agreeToPolicy = checkboxRef1.current.checked;

    if (invalidEmail) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }

    if (invalidPassword) {
      setInvalidPassword(true);
    } else {
      setInvalidPassword(false);
    }

    if (passwordNotMatch) {
      setPasswordNotMatch(true);
    } else {
      setPasswordNotMatch(false);
    }

    if (agreeToPolicy) {
      setAgreeToPolicy(true);
    } else {
      setAgreeToPolicy(false);
    }

    if (!invalidEmail && !invalidPassword && !passwordNotMatch && agreeToPolicy) {
      setLoading(true);
      setErrorDuringAuthen(false);
      setAccountAlreadyExist(false);

      const data = { email, loginMethod: 'email', isJapanese: languageIndex ? true : false };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          const errorMessage = result.message;

          setErrorDuringAuthen(errorMessage === 'error during authentication');
          setAccountAlreadyExist(errorMessage === 'account already exist');

          if (!errorMessage) {
            emailRef.current.value = '';

            setEmail(email);
            setPassword(password);
            setReceiveNews(checkboxRef2.current.checked);
            setVerificationCode(result.verificationCode);
          }
        })
        .catch(() => {
          setLoading(false);
          setErrorDuringAuthen(true);
        });
    }
  }, [languageIndex, loading]);

  const verifyHandler = useCallback(() => {
    if (loading || !verificationCodeRef.current) {
      return;
    }

    if (
      verificationCodeRef.current.value ===
      crypto.AES.decrypt(verificationCode, process.env.REACT_APP_CHECKPOINT_SECURITY_KEY).toString(crypto.enc.Utf8)
    ) {
      setLoading(true);
      setInvalidCode(false);
      setErrorDuringAuthen(false);
      setAccountAlreadyExist(false);

      const data = { email, password, loginMethod: 'email', receiveNews };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          const errorMessage = result.message;

          setErrorDuringAuthen(errorMessage === 'error during authentication');
          setAccountAlreadyExist(errorMessage === 'account already exist');

          if (!errorMessage) {
            dispatch(deviceActions.setNewDevice());
            dispatch(memberActions.setMember(result.data[0]));
            setLocalStorage(data);
            closeHandler(true);
          }
        })
        .catch(() => {
          setLoading(false);
          setErrorDuringAuthen(true);
        });
    } else {
      setInvalidCode(true);
    }
  }, [closeHandler, dispatch, email, loading, password, receiveNews, verificationCode]);

  const signInSubmitHandler = useCallback(() => {
    if (loading || !emailRef.current || !passwordRef1.current) {
      return;
    }
    const email = emailRef.current.value;
    const password = passwordRef1.current.value;

    const invalidEmail = !email.includes('@');
    const invalidPassword = password.length < 6;

    if (invalidEmail) {
      setInvalidEmail(true);
    } else {
      setInvalidEmail(false);
    }

    if (invalidPassword) {
      setInvalidPassword(true);
    } else {
      setInvalidPassword(false);
    }

    if (!invalidEmail && !invalidPassword) {
      setLoading(true);
      setErrorDuringAuthen(false);
      setIncorrectPassword(false);
      setAccountNotExist(false);

      const data = { email, password, loginMethod: 'email' };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          const errorMessage = result.message;

          setErrorDuringAuthen(errorMessage === 'error during authentication');
          setIncorrectPassword(errorMessage === 'incorrect password');
          setAccountNotExist(errorMessage === 'account not exist');

          if (!errorMessage) {
            const data = result.data[0];
            dispatch(deviceActions.setNewDevice());
            dispatch(backgroundActions.changeBackgroundHandler(data.backgroundId));
            dispatch(musicActions.setInitialMusic(data.musicId));
            dispatch(musicActions.setMusicCategory(data.musicCategory));
            dispatch(musicActions.setFavouriteMusicIdArr(data.favouriteMusicIdArr));
            dispatch(musicActions.setPlayFromPlaylist(data.playFromPlaylist));
            dispatch(avatarActions.changeAvatarHandler(data.avatarId));
            dispatch(memberActions.setMember(data));
            setLocalStorage({ email, password, loginMethod: 'email' });
            closeHandler(false);
          } else {
            clearLocalStorage();
          }
        })
        .catch(() => {
          setLoading(false);
          setErrorDuringAuthen(true);
        });
    }
  }, [closeHandler, dispatch, loading]);

  useEffect(() => {
    if (
      localStorage.getItem('CheckpointEmail') &&
      localStorage.getItem('CheckpointPassword') &&
      localStorage.getItem('CheckpointLoginMethod')
    ) {
      const data = {
        email: localStorage.getItem('CheckpointEmail'),
        password: localStorage.getItem('CheckpointPassword'),
        loginMethod: localStorage.getItem('CheckpointLoginMethod'),
      };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          const errorMessage = result.message;

          setErrorDuringAuthen(errorMessage === 'error during authentication');
          setIncorrectPassword(errorMessage === 'incorrect password');
          setAccountNotExist(errorMessage === 'account not exist');

          if (!errorMessage) {
            const data = result.data[0];
            dispatch(deviceActions.setNewDevice());
            dispatch(backgroundActions.changeBackgroundHandler(data.backgroundId));
            dispatch(musicActions.setInitialMusic(data.musicId));
            dispatch(musicActions.setMusicCategory(data.musicCategory));
            dispatch(musicActions.setFavouriteMusicIdArr(data.favouriteMusicIdArr));
            dispatch(musicActions.setPlayFromPlaylist(data.playFromPlaylist));
            dispatch(avatarActions.changeAvatarHandler(data.avatarId));
            dispatch(memberActions.setMember(data));
            setLocalStorage({
              email: localStorage.getItem('CheckpointEmail'),
              password: localStorage.getItem('CheckpointPassword'),
              loginMethod: localStorage.getItem('CheckpointLoginMethod'),
            });
            closeHandler(false);
          } else {
            clearLocalStorage();
          }
        })
        .catch(() => {
          setLoading(false);
          setErrorDuringAuthen(true);
        });
    }
  }, [dispatch, closeHandler]);

  function setLocalStorage(data) {
    const { email, password, loginMethod } = data;
    localStorage.setItem('CheckpointEmail', email);
    localStorage.setItem('CheckpointPassword', password);
    localStorage.setItem('CheckpointLoginMethod', loginMethod);
  }

  function clearLocalStorage() {
    localStorage.removeItem('CheckpointEmail');
    localStorage.removeItem('CheckpointPassword');
    localStorage.removeItem('CheckpointLoginMethod');
  }

  function signUpClickHandler() {
    setSigningUp(this);

    setInvalidEmail(false);
    setInvalidPassword(false);
    setForgetPassword(false);

    setPasswordNotMatch(false);
    setErrorDuringAuthen(false);
    setIncorrectPassword(false);
    setAccountNotExist(false);
    setAccountAlreadyExist(false);
    setAgreeToPolicy(undefined);
  }

  function forgetPasswordHandler() {
    setForgetPassword(true);
    setInvalidEmail(false);
    setInvalidPassword(false);
  }

  function forgetPasswordEmailSendHandler() {
    if (loading) {
      return;
    }

    const email = resetPasswordEmailRef.current.value;

    if (email.includes('@')) {
      setEmail(email);
      setInvalidEmail(false);
      setLoading(true);
      setErrorDuringAuthen(false);
      setAccountNotExist(false);

      const data = { email, isJapanese: languageIndex ? true : false };

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          const errorMessage = result.message;

          setErrorDuringAuthen(errorMessage === 'error during authentication');
          setAccountNotExist(errorMessage === 'account not exist');

          if (!errorMessage) {
            resetPasswordEmailRef.current.value = '';
            setResetPasswordVerificationCode(result.verificationCode);
          }
        })
        .catch(() => {
          setLoading(false);
          setErrorDuringAuthen(true);
        });
    } else {
      setInvalidEmail(true);
    }
  }

  function forgetPasswordCheckCodeHandler() {
    if (
      resetPasswordVerificationCodeRef.current.value ===
      crypto.AES.decrypt(resetPasswordVerificationCode, process.env.REACT_APP_CHECKPOINT_SECURITY_KEY).toString(crypto.enc.Utf8)
    ) {
      setInvalidResetPasswordVerificationCode(false);
      setAllowEnterNewPassword(true);
    } else {
      setInvalidResetPasswordVerificationCode(true);
    }
  }

  function resetPasswordHandler() {
    if (loading) {
      return;
    }

    const newPassword = newPasswordRef.current.value;
    const confirmNewPassword = confirmNewPasswordRef.current.value;

    if (newPassword !== confirmNewPassword) {
      setNewPasswordNotMatch(true);
      return;
    } else {
      setNewPasswordNotMatch(false);
    }

    if (newPassword.length < 6) {
      setInvalidNewPassword(true);
      return;
    } else {
      setInvalidNewPassword(false);
    }

    setLoading(true);
    setErrorDuringAuthen(false);

    const data = { email, newPassword };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        const errorMessage = result.message;

        setErrorDuringAuthen(errorMessage === 'error during authentication');

        if (!errorMessage) {
          clearLocalStorage();
          setForgetPassword(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setErrorDuringAuthen(true);
      });
  }

  function loginHandler() {
    let provider;
    if (this === 'google') {
      provider = googleProvider;
    } else if (this === 'apple') {
      provider = appleProvider;
    }

    signInWithPopupHandler(provider)
      .then((result) => {
        const { email } = result.user.providerData[0];

        if (signingUp) {
          if (!checkboxRef1.current.checked) {
            setAgreeToPolicy(false);
            return;
          } else {
            setAgreeToPolicy(true);
          }

          setLoading(true);
          setErrorDuringAuthen(false);
          setAccountAlreadyExist(false);

          const data = { email, password: this, loginMethod: this, receiveNews: checkboxRef2.current.checked };

          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((result) => {
              setLoading(false);
              const errorMessage = result.message;

              setErrorDuringAuthen(errorMessage === 'error during authentication');
              setAccountAlreadyExist(errorMessage === 'account already exist');

              if (!errorMessage) {
                dispatch(deviceActions.setNewDevice());
                dispatch(memberActions.setMember(result.data[0]));
                setLocalStorage({ email, password: this, loginMethod: this });
                closeHandler(true);
              }
            })
            .catch(() => {
              setLoading(false);
              setErrorDuringAuthen(true);
            });
        } else {
          setLoading(true);
          setErrorDuringAuthen(false);
          setIncorrectPassword(false);
          setAccountNotExist(false);

          const data = { email, password: this, loginMethod: this };

          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((result) => {
              setLoading(false);
              const errorMessage = result.message;

              setErrorDuringAuthen(errorMessage === 'error during authentication');
              setIncorrectPassword(errorMessage === 'incorrect password');
              setAccountNotExist(errorMessage === 'account not exist');

              if (!errorMessage) {
                const data = result.data[0];
                dispatch(deviceActions.setNewDevice());
                dispatch(backgroundActions.changeBackgroundHandler(data.backgroundId));
                dispatch(musicActions.setInitialMusic(data.musicId));
                dispatch(musicActions.setMusicCategory(data.musicCategory));
                dispatch(musicActions.setFavouriteMusicIdArr(data.favouriteMusicIdArr));
                dispatch(musicActions.setPlayFromPlaylist(data.playFromPlaylist));
                dispatch(avatarActions.changeAvatarHandler(data.avatarId));
                dispatch(memberActions.setMember(data));
                setLocalStorage({ email, password: this, loginMethod: this });
                closeHandler(false);
              } else {
                clearLocalStorage();
              }
            })
            .catch(() => {
              setLoading(false);
              setErrorDuringAuthen(true);
            });
        }
      })
      .catch(() => setErrorDuringAuthen(true));
  }

  useEffect(() => {
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && !forgetPassword) {
        if (verificationCode) {
          verifyHandler();
        } else if (!signingUp) {
          signInSubmitHandler();
        } else if (signingUp) {
          signUpSubmitHandler();
        }
      }
    });
  }, [forgetPassword, signInSubmitHandler, signUpSubmitHandler, signingUp, verificationCode, verifyHandler]);

  if (forgetPassword) {
    return (
      <div className="login-popup">
        <form className="login-popup__form">
          <div className="login-popup__title-container">
            <p
              className={`login-popup__title ${!signingUp ? 'not-current' : ''} ${languageIndex !== 0 ? 'small' : ''}`}
              onClick={signUpClickHandler.bind(true)}
            >
              {languageIndex === 0 ? 'Sign up' : '??????????????????'}
            </p>
            <p
              className={`login-popup__title ${signingUp ? 'not-current' : ''} ${languageIndex !== 0 ? 'small' : ''}`}
              onClick={signUpClickHandler.bind(false)}
            >
              {languageIndex === 0 ? 'Sign in' : '???????????????'}
            </p>
          </div>
          <p className={`login-popup__sub-title`}>{languageIndex === 0 ? 'Reset Password' : '???????????????????????????'}</p>
          {!resetPasswordVerificationCode ? (
            <>
              {languageIndex === 0 ? (
                <p className="login-popup__description">
                  Please enter your email address<br></br>and we'll send you a link to reset your password.
                </p>
              ) : (
                <p className="login-popup__description">
                  ?????????????????????????????????????????????????????????????????? <br></br>????????????????????????????????????URL????????????????????????
                </p>
              )}
              <input
                className="login-popup__input"
                type="text"
                id="email"
                ref={resetPasswordEmailRef}
                placeholder={languageIndex === 0 ? 'Email' : '?????????'}
              ></input>
            </>
          ) : !allowEnterNewPassword ? (
            <input
              className="login-popup__input"
              type="text"
              ref={resetPasswordVerificationCodeRef}
              placeholder={languageIndex === 0 ? 'Verification code (check your email)' : '?????????????????????????????????????????????????????????'}
            ></input>
          ) : (
            <>
              <input
                className="login-popup__input"
                type="password"
                ref={newPasswordRef}
                autoComplete="on"
                placeholder={languageIndex === 0 ? 'New Password' : '????????????????????????'}
              ></input>
              <input
                className="login-popup__input"
                type="password"
                ref={confirmNewPasswordRef}
                autoComplete="on"
                placeholder={languageIndex === 0 ? 'Confirm new password' : '?????????????????????????????????'}
              ></input>
            </>
          )}
          {invalidEmail && <p className="login-popup__error-msg">{languageIndex === 0 ? 'Invalid email' : '??????????????????'}</p>}
          {newPasswordNotMatch && (
            <p className="login-popup__error-msg">{languageIndex === 0 ? 'Passwords do not match' : '??????????????????????????????????????????'}</p>
          )}
          {invalidNewPassword && (
            <p className="login-popup__error-msg">
              {languageIndex === 0 ? 'Password must contain at least 6 characters' : '>?????????????????????6??????????????????????????????????????????????????????'}
            </p>
          )}
          {languageIndex === 0 ? (
            <p className="login-popup__contact">
              If you need any help, please contact <br></br>
              <span>inquiry@checkpoint.tokyo</span>
            </p>
          ) : (
            <p className="login-popup__contact">
              ????????????????????????????????????????????????<br></br>
              <span>support@checkpoint.tokyo</span> ??????????????????????????????
            </p>
          )}
          {!resetPasswordVerificationCode ? (
            <div className="login-popup__submit-btn no-margin" onClick={forgetPasswordEmailSendHandler}>
              {loading ? <img className="login-popup__spinner" src={spinner} alt=""></img> : languageIndex === 0 ? 'Send' : '??????'}
            </div>
          ) : (
            <div
              className="login-popup__submit-btn no-margin"
              onClick={allowEnterNewPassword ? resetPasswordHandler : forgetPasswordCheckCodeHandler}
            >
              {loading ? <img className="login-popup__spinner" src={spinner} alt=""></img> : languageIndex === 0 ? 'Submit' : '??????'}
            </div>
          )}
          {invalidResetPasswordVerificationCode && (
            <p className="login-popup__error-msg">{languageIndex === 0 ? 'Invalid verification code' : '????????????????????????'}</p>
          )}
          {accountNotExist && (
            <p className="login-popup__error-msg">
              {languageIndex === 0 ? 'Account does not exist, please sign up' : '???????????????????????????????????????????????????????????????????????????'}
            </p>
          )}
          {errorDuringAuthen && (
            <p className="login-popup__error-msg">
              {languageIndex === 0
                ? 'Error occured, please try again later'
                : '??????????????????????????????????????????????????????????????????????????????????????????'}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="login-popup">
      <form className="login-popup__form">
        {!verificationCode ? (
          <>
            <div className="login-popup__title-container">
              <p
                className={`login-popup__title ${!signingUp ? 'not-current' : ''} ${languageIndex !== 0 ? 'small' : ''}`}
                onClick={signUpClickHandler.bind(true)}
              >
                {languageIndex === 0 ? 'Sign up' : '??????????????????'}
              </p>
              <p
                className={`login-popup__title ${signingUp ? 'not-current' : ''} ${languageIndex !== 0 ? 'small' : ''}`}
                onClick={signUpClickHandler.bind(false)}
              >
                {languageIndex === 0 ? 'Sign in' : '???????????????'}
              </p>
            </div>
            <img
              src={signingUp ? googleSignupBtn : googleSigninBtn}
              alt=""
              className="login-popup__google"
              onClick={loginHandler.bind('google')}
            ></img>
            <img
              src={signingUp ? appleSignupBtn : appleSigninBtn}
              alt=""
              className="login-popup__apple"
              onClick={loginHandler.bind('apple')}
            ></img>
            <div className="login-popup__seperator"></div>
            <input
              className="login-popup__input"
              type="text"
              placeholder={languageIndex === 0 ? 'Email' : '?????????'}
              id="email"
              ref={emailRef}
            ></input>
            {invalidEmail && <p className="login-popup__error-msg">{languageIndex === 0 ? 'Invalid email' : '??????????????????'}</p>}
            <input
              className="login-popup__input"
              type="password"
              placeholder={languageIndex === 0 ? 'Password' : '???????????????'}
              autoComplete="on"
              ref={passwordRef1}
            ></input>
            {invalidPassword && (
              <p className="login-popup__error-msg">
                {languageIndex === 0
                  ? 'Password must contain at least 6 characters'
                  : '>?????????????????????6??????????????????????????????????????????????????????'}
              </p>
            )}
            {!signingUp && (
              <>
                {incorrectPassword && (
                  <p className="login-popup__error-msg">{languageIndex === 0 ? 'Incorect password' : '???????????????????????????'}</p>
                )}
                {accountNotExist && (
                  <p className="login-popup__error-msg">
                    {languageIndex === 0 ? 'Account does not exist, please sign up' : '???????????????????????????????????????????????????????????????????????????'}
                  </p>
                )}
              </>
            )}
            {signingUp && (
              <>
                <input
                  className="login-popup__input"
                  type="password"
                  placeholder={languageIndex === 0 ? 'Confirm password' : '????????????????????????'}
                  autoComplete="on"
                  ref={passwordRef2}
                ></input>
                {passwordNotMatch && (
                  <p className="login-popup__error-msg">
                    {languageIndex === 0 ? 'Passwords do not match' : '??????????????????????????????????????????'}
                  </p>
                )}
                {accountAlreadyExist && (
                  <p className="login-popup__error-msg">
                    {languageIndex === 0 ? 'Account already exists, please sign in' : '???????????????????????????????????????????????????????????????????????????'}
                  </p>
                )}
                <div className="login-popup__privacy-container margin-top">
                  <input type="checkbox" ref={checkboxRef1} defaultChecked></input>
                  {languageIndex === 0 ? (
                    <p>
                      By registering, you agree to the{' '}
                      <a href={`${window.location.href.replace('premium', '')}term-condition`} target="_blank" rel="noreferrer">
                        Terms<br></br>
                      </a>
                      and{' '}
                      <a href={`${window.location.href.replace('premium', '')}term-condition`} target="_blank" rel="noreferrer">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  ) : (
                    <p>
                      ????????????????????????
                      <a href={`${window.location.href.replace('premium', '')}term-condition`} target="_blank" rel="noreferrer">
                        ????????????
                      </a>
                      ???
                      <a href={`${window.location.href.replace('premium', '')}term-condition`} target="_blank" rel="noreferrer">
                        ??????????????????????????????
                      </a>
                      <br></br>
                      ???????????????????????????????????????
                    </p>
                  )}
                </div>
                {signingUp && agreeToPolicy === false && (
                  <p className="login-popup__error-msg">
                    {languageIndex === 0 ? 'Please agree to the policy' : '???????????????????????????????????????'}
                  </p>
                )}
                <div className="login-popup__privacy-container">
                  <input type="checkbox" ref={checkboxRef2} defaultChecked></input>
                  {languageIndex === 0 ? (
                    <p>
                      I agree to receive news and updates<br></br>from Checkpoint.
                    </p>
                  ) : (
                    <p>
                      Checkpoint?????????????????????????????????????????????<br></br>???????????????????????????
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="login-popup__submit-btn" onClick={signingUp ? signUpSubmitHandler : signInSubmitHandler}>
              {signingUp ? (
                loading ? (
                  <img className="login-popup__spinner" src={spinner} alt=""></img>
                ) : languageIndex === 0 ? (
                  'Sign up'
                ) : (
                  '??????????????????'
                )
              ) : loading ? (
                <img className="login-popup__spinner" src={spinner} alt=""></img>
              ) : languageIndex === 0 ? (
                'Sign in'
              ) : (
                '???????????????'
              )}
            </div>
            {!signingUp && (
              <div className="login-popup__forget-password" onClick={forgetPasswordHandler}>
                {languageIndex === 0 ? 'Forgot your password?' : '???????????????????????????????????????'}
              </div>
            )}
            {errorDuringAuthen && (
              <p className="login-popup__error-msg">
                {languageIndex === 0
                  ? 'Error occured, please try again later'
                  : '??????????????????????????????????????????????????????????????????????????????????????????'}
              </p>
            )}
          </>
        ) : (
          <>
            <p className={`login-popup__title ${languageIndex !== 0 ? 'small' : ''}`}>
              {languageIndex === 0 ? 'Email Verification' : '????????????????????????'}
            </p>
            <input
              className="login-popup__input"
              type="text"
              ref={verificationCodeRef}
              placeholder={languageIndex === 0 ? 'Verification code (check your email)' : '?????????????????????????????????????????????????????????'}
            ></input>
            {accountAlreadyExist && (
              <p className="login-popup__error-msg">
                {languageIndex === 0 ? 'Account already exists, please sign in' : '???????????????????????????????????????????????????????????????????????????'}
              </p>
            )}
            {invalidCode && (
              <p className="login-popup__error-msg">{languageIndex === 0 ? 'Invalid verification code' : '????????????????????????'}</p>
            )}
            <div className="login-popup__submit-btn no-margin" onClick={verifyHandler}>
              {loading ? <img className="login-popup__spinner" src={spinner} alt=""></img> : 'Verify'}
            </div>
            {errorDuringAuthen && (
              <p className="login-popup__error-msg">
                {languageIndex === 0
                  ? 'Error occured, please try again later'
                  : '??????????????????????????????????????????????????????????????????????????????????????????'}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
