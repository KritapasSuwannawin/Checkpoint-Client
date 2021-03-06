import { useSelector } from 'react-redux';

import './FreeTrialPopup.scss';

import oneMonthImg from './img/Premium Card 1m.png';
import threeMonthImg from './img/Premium Card 3m.png';

function LastDayTrialPopup(props) {
  const languageIndex = useSelector((store) => store.language.languageIndex);

  return (
    <div className="free-trial-popup">
      <div className="free-trial-popup__container">
        <p className="free-trial-popup__title">
          {languageIndex === 0 ? 'Your Premium subscription' : 'プレミアムサブスクリプションの'} <br></br>{' '}
          <span className="yellow">{languageIndex === 0 ? 'will expire in 1 day' : '有効期限は1日です'}</span>
        </p>
        {languageIndex === 0 ? (
          <p className="free-trial-popup__sub-title">
            Buy another coupon here and redeem a code<br></br>
            to continue enjoying Premium perks in the next month
          </p>
        ) : (
          <p className="free-trial-popup__sub-title">
            ここで別のクーポンを購入し、コードと引き換えることで、<br></br>
            翌月も引き続きプレミアム特典を楽しむことができます。
          </p>
        )}
        <div className="free-trial-popup__img-container">
          <a href={process.env.REACT_APP_UPGRADE_LINK} target="_blank" rel="noreferrer">
            <img src={oneMonthImg} alt=""></img>
          </a>
          <a href={process.env.REACT_APP_UPGRADE_LINK} target="_blank" rel="noreferrer">
            <img src={threeMonthImg} alt=""></img>
          </a>
        </div>
        <div className="free-trial-popup__btn" onClick={props.closeHandler}>
          {languageIndex === 0 ? 'Later' : '後で読む'}
        </div>
      </div>
    </div>
  );
}

export default LastDayTrialPopup;
