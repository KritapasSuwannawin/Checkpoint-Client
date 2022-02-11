import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BackgroundVideo from '../../components/backgroundVideo/BackgroundVideo';
import AmbientAudio from '../../components/ambientAudio/AmbientAudio';
import MusicAudio from '../../components/musicAudio/MusicAudio';
import AmbientControl from '../../components/ambientControl/AmbientControl';
import FavouriteMusicCard from '../../components/favouriteMusicCard/FavouriteMusicCard';
import LoginPopup from '../../components/loginPopup/LoginPopup';
import UpgradePopup from '../../components/upgradePopup/UpgradePopup';
import FreeTrialPopup from '../../components/freeTrialPopup/FreeTrialPopup';
import ActivationPopup from '../../components/activationPopup/ActivationPopup';
import HelpSupportPopup from '../../components/helpSupportPopup/HelpSupportPopup';
import FeedbackPopup from '../../components/feedbackPopup/FeedbackPopup';
import SubscriptionPopup from '../../components/subscriptionPopup/SubscriptionPopup';
import './Home.scss';

import { pageActions } from '../../store/pageSlice';
import { backgroundActions } from '../../store/backgroundSlice';
import { ambientActions } from '../../store/ambientSlice';
import { musicActions } from '../../store/musicSlice';
import { languageActions } from '../../store/languageSlice';
import { memberActions } from '../../store/memberSlice';
import { avatarActions } from '../../store/avatarSlice';

import buyPremiumBtn from '../../svg/50px/buy-premium-button.png';
import logo50 from '../../svg/50px/Checkpoint with text 50px.svg';
import logoPremium50 from '../../svg/50px/Checkpoint premium 50px.svg';
import playSvg50 from '../../svg/50px/Circled Play.svg';
import pauseSvg50 from '../../svg/50px/Pause Button.svg';
import daySvg36 from '../../svg/36px/Sun.svg';
import eveningSvg36 from '../../svg/36px/Sunset.svg';
import nightSvg36 from '../../svg/36px/Moon Symbol.svg';
import cloudySvg36 from '../../svg/36px/Partly Cloudy Day.svg';
import rainySvg36 from '../../svg/36px/Moderate Rain.svg';
import thunderSvg36 from '../../svg/36px/Storm.svg';
import snowySvg36 from '../../svg/36px/Winter.svg';
import musicLibrarySvg36 from '../../svg/36px/Music Library.svg';
import backgroundSvg30 from '../../svg/30px/Bg30px.svg';
import musicSvg30 from '../../svg/30px/Music30px.svg';
import globe30 from '../../svg/30px/Globe30px.png';
import heartFullSvg30 from '../../svg/30px/Heart.svg';
import heartSvg30 from '../../svg/30px/Hearts.svg';
import ambientSvg30 from '../../svg/30px/Organic Food.svg';
import iTunesSvg30 from '../../svg/30px/iTunes-1.svg';
import shuffleSvg25 from '../../svg/25px/Shuffle.svg';
import loopSvg25 from '../../svg/25px/Repeat.svg';
import backwardSvg25 from '../../svg/25px/Rewind-1.svg';
import forwardSvg25 from '../../svg/25px/Fast Forward-1.svg';
import addSvg20 from '../../svg/20px/Add20px.svg';
import speakerSvg15 from '../../svg/15px/Speaker-1.svg';
import lockSvg15 from '../../svg/15px/Lock.svg';

import png1 from '../../svg/20px/1.svg';
import png2 from '../../svg/20px/2.svg';
import png3 from '../../svg/20px/3.svg';
import png4 from '../../svg/20px/4.png';
import png5 from '../../svg/20px/5.png';
import png6 from '../../svg/20px/6.png';
import png7 from '../../svg/20px/7.png';

const dictionary = {
  language: ['EN', 'JP'],
  music: ['Music', 'ミュージック'],
  background: ['Background', 'バックグラウンド'],
  aboutUs: ['About Us', '私たちについて'],
  policy: ['Policy', 'プライバシーポリシー'],
  donate: ['Donate', '寄付する'],
};

function Home(props) {
  const dispatch = useDispatch();
  const currentPage = useSelector((store) => store.page.currentPage);
  const currentBackground = useSelector((store) => store.background.currentBackground);
  const currentMusic = useSelector((store) => store.music.currentMusic);
  const musicVolume = useSelector((store) => store.music.musicVolume);
  const shuffleMusic = useSelector((store) => store.music.shuffleMusic);
  const loopMusic = useSelector((store) => store.music.loopMusic);
  const musicPlaying = useSelector((store) => store.music.musicPlaying);
  const favouriteMusicIdArr = useSelector((store) => store.music.favouriteMusicIdArr);
  const availableAmbientArr = useSelector((store) => store.ambient.availableAmbientArr);
  const currentAmbientArr = useSelector((store) => store.ambient.currentAmbientArr);
  const ambientVolume = useSelector((store) => store.ambient.ambientVolume);
  const languageIndex = useSelector((store) => store.language.languageIndex);
  const memberId = useSelector((store) => store.member.memberId);
  const username = useSelector((store) => store.member.username);
  const isPremium = useSelector((store) => store.member.isPremium);
  const isOntrial = useSelector((store) => store.member.isOntrial);
  const currentAvatar = useSelector((store) => store.avatar.currentAvatar);

  const musicVolumeSliderRef = useRef();
  const ambientVolumeSliderRef = useRef();

  const [musicThumbnailUrl, setMusicThumbnailUrl] = useState();
  const [backgroundThumbnailUrl, setBackgroundThumbnailUrl] = useState();
  const [backgroundVideoArr, setBackgroundVideoArr] = useState([]);
  const [ambientAudioArr, setAmbientAudioArr] = useState([]);
  const [ambientThumbnailArr, setAmbientThumbnailArr] = useState([]);

  const [previousMusicVolume, setPreviousMusicVolume] = useState(musicVolume);
  const [previousAmbientVolume, setPreviousAmbientVolume] = useState(ambientVolume);

  const [showOutsideLink, setShowOutsideLink] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showFreeTrialModal, setShowFreeTrialModal] = useState(false);
  const [showActivationPopup, setShowActivationPopup] = useState(false);
  const [showHelpSupportPopup, setShowHelpSupportPopup] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);

  const backgroundFilePathRef = useRef();

  useEffect(() => {
    setShowUpgradePopup(props.showUpgradePopup);
  }, [props.showUpgradePopup]);

  useEffect(() => {
    setBackgroundVideoArr((backgroundVideoArr) => {
      const filteredBackgroundVideoArr = backgroundVideoArr.filter(
        (background) => background.key !== currentBackground.id
      );
      return [
        ...filteredBackgroundVideoArr,
        <div key={currentBackground.id}>
          <BackgroundVideo id={currentBackground.id} url={currentBackground.url}></BackgroundVideo>
        </div>,
      ];
    });

    const timeout = setTimeout(() => {
      setBackgroundVideoArr((backgroundVideoArr) => {
        if (backgroundVideoArr.slice(-1).length === 1) {
          return backgroundVideoArr.slice(-1);
        }
        return backgroundVideoArr;
      });
    }, 5000);

    return () => {
      clearTimeout(timeout);
      setBackgroundVideoArr((backgroundVideoArr) => {
        if (backgroundVideoArr.slice(-3).length === 3) {
          return backgroundVideoArr.slice(-3);
        }
        return backgroundVideoArr;
      });
    };
  }, [currentBackground]);

  useEffect(() => {
    if (isPremium === false && currentBackground.isPremium) {
      dispatch(backgroundActions.changeBackgroundHandler('0111'));
    }

    setBackgroundThumbnailUrl(currentBackground.thumbnailUrl);
  }, [currentBackground, dispatch, isPremium]);

  useEffect(() => {
    setAmbientAudioArr(
      currentAmbientArr.map((ambient) => {
        return (
          <div key={ambient.id}>
            <AmbientAudio id={ambient.id} url={ambient.url} volume={ambient.volume}></AmbientAudio>
          </div>
        );
      })
    );
  }, [currentAmbientArr]);

  useEffect(() => {
    setMusicThumbnailUrl(currentMusic.thumbnailUrl);
  }, [currentMusic]);

  useEffect(() => {
    const currentAmbientIdArr = currentBackground.ambientIdArr;

    if (backgroundFilePathRef.current !== currentBackground.filePath) {
      backgroundFilePathRef.current = currentBackground.filePath;
      setAmbientThumbnailArr([]);

      currentAmbientIdArr.forEach((ambientId) => {
        const ambient = availableAmbientArr.find((ambient) => ambient.id === ambientId);

        setAmbientThumbnailArr((ambientThumbnailArr) => {
          return [
            ...ambientThumbnailArr,
            <div key={ambient.id} className="background-control__ambient-control">
              <AmbientControl
                id={ambient.id}
                name={ambient.name}
                url={ambient.url}
                thumbnailUrl={ambient.thumbnailUrl}
                volume={ambient.volume}
              ></AmbientControl>
            </div>,
          ];
        });
      });

      dispatch(ambientActions.setCurrentAmbientArrByIdArr(currentAmbientIdArr));
    }

    const ambientThumbnailArr2 = [];
    const filteredCurrentAmbientArr = currentAmbientArr.filter((ambient) => !currentAmbientIdArr.includes(ambient.id));
    filteredCurrentAmbientArr.forEach((ambient) => {
      ambientThumbnailArr2.push(
        <div key={ambient.id} className="background-control__ambient-control">
          <AmbientControl
            id={ambient.id}
            name={ambient.name}
            url={ambient.url}
            thumbnailUrl={ambient.thumbnailUrl}
            volume={ambient.volume}
          ></AmbientControl>
        </div>
      );
    });

    setAmbientThumbnailArr((ambientThumbnailArr) =>
      ambientThumbnailArr.slice(0, currentAmbientIdArr.length).concat(ambientThumbnailArr2)
    );
  }, [availableAmbientArr, currentBackground, currentAmbientArr, dispatch]);

  useEffect(() => {
    if (!memberId) {
      setShowLoginPopup(true);
    }
  }, [memberId]);

  function playPauseMusicHandler() {
    dispatch(musicActions.toggleMusicPlayPause());
  }

  function volumeMusicChangeHandler(e) {
    const volume = e.target.value / 100;
    dispatch(musicActions.setMusicVolume(volume));
  }

  function volumeAmbientChangeHandler(e) {
    const volume = e.target.value / 100;
    dispatch(ambientActions.setAmbientVolume(volume));
  }

  function toggleMuteMusicHandler() {
    if (Number(musicVolumeSliderRef.current.value) === 0) {
      setPreviousMusicVolume(0);
      dispatch(musicActions.setMusicVolume(previousMusicVolume));
      musicVolumeSliderRef.current.value = previousMusicVolume * 100;
      return;
    }
    setPreviousMusicVolume(musicVolume);
    dispatch(musicActions.setMusicVolume(0));
    musicVolumeSliderRef.current.value = 0;
  }

  function toggleMuteAmbientHandler() {
    if (Number(ambientVolumeSliderRef.current.value) === 0) {
      setPreviousAmbientVolume(0);
      dispatch(ambientActions.setAmbientVolume(previousAmbientVolume));
      ambientVolumeSliderRef.current.value = previousAmbientVolume * 100;
      return;
    }
    setPreviousAmbientVolume(ambientVolume);
    dispatch(ambientActions.setAmbientVolume(0));
    ambientVolumeSliderRef.current.value = 0;
  }

  function toggleShuffleMusicHandler() {
    dispatch(musicActions.toggleShuffleMusic());
  }

  function toggleLoopMusicHandler() {
    dispatch(musicActions.toggleLoopMusic());
  }

  function backMusicHandler() {
    dispatch(musicActions.backMusicHandler());
  }

  function nextMusicHandler() {
    dispatch(musicActions.nextMusicHandler());
  }

  function backgroundClickHander() {
    if (currentPage === 'background' || currentPage === 'ambient') {
      dispatch(pageActions.closePageHandler());
      return;
    }
    setShowOutsideLink(false);
    dispatch(pageActions.changePageHandler('background'));
  }

  function musicClickHander() {
    if (currentPage === 'music') {
      dispatch(pageActions.closePageHandler());
      return;
    }
    setShowOutsideLink(false);
    dispatch(pageActions.changePageHandler('music'));
  }

  function openAmbientPageHander() {
    if (!isPremium) {
      return;
    }

    dispatch(pageActions.changePageHandler('ambient'));
  }

  function openBackgroundPageHander() {
    dispatch(pageActions.changePageHandler('background'));
  }

  function openAvatarPageHander() {
    dispatch(pageActions.changePageHandler('avatar'));
  }

  function overlayClickHandler() {
    dispatch(pageActions.closePageHandler());
  }

  function changeBackgroundTimeHandler() {
    dispatch(backgroundActions.changeBackgroundTimeHandler(this));
  }

  function changeBackgroundWeatherHandler() {
    dispatch(backgroundActions.changeBackgroundWeatherHandler(this));
  }

  function outsideLinkToggleHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink((state) => !state);
  }

  function languageChangeHandler() {
    dispatch(languageActions.languageChangeHandler());
  }

  function navBtnClickHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink(false);

    if (isPremium === undefined) {
      setShowLoginPopup(true);
    } else {
      setShowUpgradePopup(true);
      setShowSubscriptionPopup(false);
    }
  }

  function closeLoginPopup(showFreeTrialModal) {
    setShowLoginPopup(false);

    if (showFreeTrialModal) {
      setShowFreeTrialModal(true);
    }
  }

  function closeUpgradePopup() {
    setShowUpgradePopup(false);
  }

  function closeFreeTrialPopup() {
    setShowFreeTrialModal(false);
  }

  function favouriteBtnClickHandler() {
    dispatch(musicActions.favouriteBtnClickHandler(currentMusic.id));
  }

  function logoutHandler() {
    dispatch(memberActions.logout());
    dispatch(pageActions.closePageHandler());
    dispatch(musicActions.setMusicPlaying(false));
    dispatch(avatarActions.changeAvatarHandler(1));
    setShowOutsideLink(false);
  }

  function activationBtnClickHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink(false);
    setShowSubscriptionPopup(false);
    setShowActivationPopup(true);
  }

  function closeActivationPopup() {
    setShowActivationPopup(false);
  }

  function openHelpSupportHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink(false);
    setShowActivationPopup(false);
    setShowHelpSupportPopup(true);
  }

  function closeHelpSupportHandler() {
    setShowHelpSupportPopup(false);
  }

  function openFeedbackHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink(false);
    setShowFeedbackPopup(true);
  }

  function closeFeedbackHandler() {
    setShowFeedbackPopup(false);
  }

  function openSubscriptionHandler() {
    dispatch(pageActions.closePageHandler());
    setShowOutsideLink(false);
    setShowSubscriptionPopup(true);
  }

  function closeSubscriptionHandler() {
    setShowSubscriptionPopup(false);
  }

  return (
    <div className="home">
      {showLoginPopup && <LoginPopup closeHandler={closeLoginPopup}></LoginPopup>}
      {showUpgradePopup && <UpgradePopup closeHandler={closeUpgradePopup}></UpgradePopup>}
      {showActivationPopup && (
        <ActivationPopup
          closeHandler={closeActivationPopup}
          helpSupportClickHandler={openHelpSupportHandler}
        ></ActivationPopup>
      )}
      {showFreeTrialModal && <FreeTrialPopup closeHandler={closeFreeTrialPopup}></FreeTrialPopup>}
      {showHelpSupportPopup && <HelpSupportPopup closeHandler={closeHelpSupportHandler}></HelpSupportPopup>}
      {showFeedbackPopup && <FeedbackPopup closeHandler={closeFeedbackHandler}></FeedbackPopup>}
      {showSubscriptionPopup && (
        <SubscriptionPopup
          closeHandler={closeSubscriptionHandler}
          activateHandler={activationBtnClickHandler}
          upgradeHandler={navBtnClickHandler}
        ></SubscriptionPopup>
      )}
      <div className={`home__overlay ${currentPage && currentPage !== 'avatar' ? 'show-overlay' : ''}`}>
        <div className="home__overlay--left" onClick={overlayClickHandler}></div>
        <div className="home__overlay--right"></div>
      </div>
      {backgroundVideoArr}
      <MusicAudio></MusicAudio>
      {ambientAudioArr}
      <nav className="nav">
        <div onClick={overlayClickHandler} className="nav__logo">
          <img src={isPremium ? logoPremium50 : logo50} alt="" className="nav__logo--img"></img>
          {isPremium === undefined ? (
            <div className="nav__logo--text-btn" onClick={navBtnClickHandler}>
              Join us
            </div>
          ) : (
            (isPremium === false || isOntrial) && (
              <>
                <img className="nav__logo--upgrade-btn" onClick={navBtnClickHandler} src={buyPremiumBtn} alt=""></img>
                <div className="nav__logo--text-btn" onClick={activationBtnClickHandler}>
                  Activate Premium
                </div>
              </>
            )
          )}
        </div>
        <div className="nav__links">
          <div
            onClick={musicClickHander}
            className={`nav__links--link ${currentPage === 'music' ? 'current-page' : ''} ${
              languageIndex === 1 ? 'japanese' : ''
            }`}
          >
            <img src={musicSvg30} alt="" className="nav__links--icon"></img>
            {dictionary.music[languageIndex]}
          </div>
          <div
            onClick={backgroundClickHander}
            className={`nav__links--link fixed-width ${languageIndex === 1 ? 'japanese' : ''} ${
              currentPage === 'background' || currentPage === 'ambient' ? 'current-page' : ''
            }`}
          >
            <img src={backgroundSvg30} alt="" className="nav__links--icon"></img>
            {dictionary.background[languageIndex]}
          </div>
          <div className="nav__links--link language" onClick={languageChangeHandler}>
            <img className="nav__links--icon" src={globe30} alt=""></img>
            {dictionary.language[languageIndex]}
          </div>
          <img
            className={`nav__links--link profile ${languageIndex === 1 ? 'japanese' : ''}`}
            src={currentAvatar.url}
            alt=""
            onClick={outsideLinkToggleHandler}
          ></img>
          {showOutsideLink && (
            <div className="nav__outside-links">
              {memberId && (
                <>
                  <div className="nav__outside-links--profile-container">
                    <img src={currentAvatar.url} alt="" onClick={openAvatarPageHander}></img>
                    <div>
                      <p className="nav__outside-links--username">{username}</p>
                      <p className="nav__outside-links--member-id">{`#${memberId}`}</p>
                    </div>
                  </div>
                  <div className="nav__outside-links--btn-container">
                    <img
                      className="nav__logo--upgrade-btn"
                      onClick={navBtnClickHandler}
                      src={buyPremiumBtn}
                      alt=""
                    ></img>
                    <div className="nav__logo--text-btn" onClick={activationBtnClickHandler}>
                      {isPremium && !isOntrial ? 'Extend' : 'Activate'} Premium
                    </div>
                  </div>
                  <div className="nav__outside-links--container">
                    <div className="nav__outside-links--icon-container">
                      <img src={png1} alt="" className="small"></img>
                    </div>
                    <p onClick={openSubscriptionHandler}>Subscription</p>
                  </div>
                  <div className="nav__outside-links--container">
                    <div className="nav__outside-links--icon-container">
                      <img src={png2} alt=""></img>
                    </div>
                    <p onClick={openHelpSupportHandler}>Help & Support</p>
                  </div>
                  <div className="nav__outside-links--container">
                    <div className="nav__outside-links--icon-container">
                      <img src={png3} alt=""></img>
                    </div>
                    <p onClick={openFeedbackHandler}>Feedback</p>
                  </div>
                </>
              )}
              <div className={`nav__outside-links--container ${memberId ? 'border-top' : ''}`}>
                <div className="nav__outside-links--icon-container">
                  <img src={png4} alt=""></img>
                </div>
                <a href={`${window.location.href}about`} target="_blank" rel="noreferrer">
                  {dictionary.aboutUs[languageIndex]}
                </a>
              </div>
              <div className="nav__outside-links--container">
                <div className="nav__outside-links--icon-container">
                  <img src={png5} alt=""></img>
                </div>
                <a href={`${window.location.href}policy`} target="_blank" rel="noreferrer">
                  {dictionary.policy[languageIndex]}
                </a>
              </div>
              <div className="nav__outside-links--container">
                <div className="nav__outside-links--icon-container">
                  <img src={png6} alt=""></img>
                </div>
                <a href={process.env.REACT_APP_DONATE_LINK} target="_blank" rel="noreferrer">
                  {dictionary.donate[languageIndex]}
                </a>
              </div>
              {memberId && (
                <div className="nav__outside-links--container border-top">
                  <div className="nav__outside-links--icon-container">
                    <img src={png7} alt=""></img>
                  </div>
                  <p onClick={logoutHandler}>Logout</p>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div
        className={`background-control ${
          currentPage === 'background' || currentPage === 'ambient' ? 'show-control' : ''
        }`}
      >
        <img
          src={backgroundThumbnailUrl}
          alt=""
          onClick={openBackgroundPageHander}
          className="background-control__thumbnail"
        ></img>
        <div className="background-control__ambient-container">
          <div className="background-control__ambient-volume">
            <p>Ambience</p>
            <img src={speakerSvg15} alt=""></img>
            <input
              type="range"
              min="0"
              max="100"
              value={ambientVolume * 100}
              onChange={volumeAmbientChangeHandler}
              ref={ambientVolumeSliderRef}
              className="background-control__ambient-volume--slider"
            ></input>
          </div>
          {ambientThumbnailArr}
          <div
            title={`${!isPremium ? 'For premium member' : ''}`}
            onClick={openAmbientPageHander}
            className={`background-control__add-ambient ${!isPremium ? 'premium' : ''}`}
          >
            <img src={isPremium ? addSvg20 : lockSvg15} alt="" className={!isPremium ? 'small' : ''}></img>
          </div>
        </div>
      </div>
      <div className={`music-control ${currentPage === 'music' ? 'show-control' : ''}`}>
        {isPremium === undefined ? (
          <p className={`music-control__placeholder ${currentPage === 'music' ? 'show-control' : ''}`}>
            Join us to have your own music playlist
          </p>
        ) : (
          <>
            <div className="music-control__title">
              <img src={heartFullSvg30} alt=""></img>
              <p>Favorite music</p>
            </div>
            {favouriteMusicIdArr.length === 0 ? (
              <p>Your music playlist is empty</p>
            ) : (
              favouriteMusicIdArr.map((id) => (
                <div key={id} className="music-control__cards">
                  <FavouriteMusicCard id={id}></FavouriteMusicCard>
                </div>
              ))
            )}
          </>
        )}
      </div>
      <div className="mood">
        <div className="mood__section">
          <img
            src={daySvg36}
            alt=""
            onClick={changeBackgroundTimeHandler.bind(1)}
            className={currentBackground.id.slice(2, 3) !== '1' ? 'mood__section--not-current-mood' : ''}
          ></img>
          <img
            src={eveningSvg36}
            alt=""
            onClick={changeBackgroundTimeHandler.bind(2)}
            className={currentBackground.id.slice(2, 3) !== '2' ? 'mood__section--not-current-mood' : ''}
          ></img>
          <div className="mood__section--premium">
            <img
              src={nightSvg36}
              alt=""
              title={`${!isPremium ? 'For premium member' : ''}`}
              onClick={isPremium ? changeBackgroundTimeHandler.bind(3) : () => {}}
              className={`${currentBackground.id.slice(2, 3) !== '3' ? 'mood__section--not-current-mood' : ''}`}
            ></img>
            {!isPremium && (
              <img src={lockSvg15} alt="" title="For premium member" className="mood__section--lock"></img>
            )}
          </div>
        </div>
        <div className="mood__section">
          <img
            src={cloudySvg36}
            alt=""
            onClick={changeBackgroundWeatherHandler.bind(1)}
            className={currentBackground.id.slice(3) !== '1' ? 'mood__section--not-current-mood' : ''}
          ></img>
          <img
            src={rainySvg36}
            alt=""
            onClick={changeBackgroundWeatherHandler.bind(2)}
            className={currentBackground.id.slice(3) !== '2' ? 'mood__section--not-current-mood' : ''}
          ></img>
          <div className="mood__section--premium">
            <img
              src={thunderSvg36}
              alt=""
              title={`${!isPremium ? 'For premium member' : ''}`}
              onClick={isPremium ? changeBackgroundWeatherHandler.bind(3) : () => {}}
              className={`${currentBackground.id.slice(3) !== '3' ? 'mood__section--not-current-mood' : ''}`}
            ></img>
            {!isPremium && (
              <img src={lockSvg15} alt="" title="For premium member" className="mood__section--lock"></img>
            )}
          </div>
          <div className="mood__section--premium">
            <img
              src={snowySvg36}
              alt=""
              title={`${!isPremium ? 'For premium member' : ''}`}
              onClick={isPremium ? changeBackgroundWeatherHandler.bind(4) : () => {}}
              className={`${currentBackground.id.slice(3) !== '4' ? 'mood__section--not-current-mood' : ''}`}
            ></img>
            {!isPremium && (
              <img src={lockSvg15} alt="" title="For premium member" className="mood__section--lock"></img>
            )}
          </div>
        </div>
      </div>
      <div className="player">
        <div className="player__music-data">
          <img
            src={favouriteMusicIdArr.includes(currentMusic.id) ? heartFullSvg30 : heartSvg30}
            alt=""
            className="player__music-data--favourite-btn"
            onClick={favouriteBtnClickHandler}
          ></img>
          <img src={musicThumbnailUrl} className="player__music-data--thumbnail" alt=""></img>
          <div>
            <p className="player__music-data--music-name">{currentMusic.musicName}</p>
            <p className="player__music-data--artist-name">{currentMusic.artistName}</p>
          </div>
        </div>
        <div className="player__music-control">
          <img
            src={shuffleSvg25}
            onClick={toggleShuffleMusicHandler}
            alt=""
            className={`player__music-control--shuffle ${shuffleMusic ? 'current-song-setting' : ''}`}
          ></img>
          <img src={backwardSvg25} onClick={backMusicHandler} alt="" className="player__music-control--back"></img>
          <img
            src={musicPlaying ? pauseSvg50 : playSvg50}
            onClick={playPauseMusicHandler}
            alt=""
            className="player__music-control--play-pause"
          ></img>
          <img src={forwardSvg25} onClick={nextMusicHandler} alt="" className="player__music-control--next"></img>
          <img
            src={loopSvg25}
            onClick={toggleLoopMusicHandler}
            alt=""
            className={`player__music-control--loop ${loopMusic ? 'current-song-setting' : ''}`}
          ></img>
        </div>
        <div className="player__volume-control">
          <img src={musicLibrarySvg36} onClick={musicClickHander} className="player__music-playlist" alt=""></img>
          <div className="player__volume-control--volume">
            <div className="player__volume-control--section">
              <img
                src={iTunesSvg30}
                onClick={toggleMuteMusicHandler}
                className="player__volume-control--mute"
                alt=""
              ></img>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume * 100}
                onChange={volumeMusicChangeHandler}
                ref={musicVolumeSliderRef}
                className="player__volume-control--volume-slider"
              ></input>
            </div>
            <div className="player__volume-control--section">
              <img
                src={ambientSvg30}
                onClick={toggleMuteAmbientHandler}
                className="player__volume-control--mute"
                alt=""
              ></img>
              <input
                type="range"
                min="0"
                max="100"
                value={ambientVolume * 100}
                onChange={volumeAmbientChangeHandler}
                ref={ambientVolumeSliderRef}
                className="player__volume-control--volume-slider"
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
