import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

import './FeedbackPopup.scss';

import starRegular from '../../svg/30px/star-regular.svg';
import starSolid from '../../svg/30px/star-solid.svg';

function FeedbackPopup(props) {
  const memberId = useSelector((store) => store.member.memberId);
  const languageIndex = useSelector((store) => store.language.languageIndex);

  const [star, setStar] = useState(3);

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const ref8 = useRef();
  const ref9 = useRef();
  const ref10 = useRef();
  const ref11 = useRef();
  const ref12 = useRef();
  const ref13 = useRef();
  const ref14 = useRef();
  const ref15 = useRef();
  const ref16 = useRef();

  function submitHandler() {
    const data = {
      memberId,
      tableName: 'feedback',
      star,
      high_school: ref1.current.checked,
      college: ref2.current.checked,
      working: ref3.current.checked,
      other_job: ref4.current.value,
      less_than_one_week: ref5.current.checked,
      one_week: ref6.current.checked,
      almost_one_month: ref7.current.checked,
      more_than_one_month: ref8.current.checked,
      full_screen_browser: ref9.current.checked,
      minimized_browser: ref10.current.checked,
      half_screen_browser: ref11.current.checked,
      phone: ref12.current.checked,
      sleep: ref13.current.checked,
      productivity: ref14.current.checked,
      relax: ref15.current.checked,
      other_problem: ref16.current.value,
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/member/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).catch(() => {});

    props.closeHandler();
  }

  function closePopupHandler() {
    props.closeHandler();
  }

  function setReviewStar() {
    setStar(this);
  }

  return (
    <div className="feedback-popup">
      <div className="feedback-popup__form">
        <div className="feedback-popup__form--close-btn" onClick={closePopupHandler}></div>
        <p className="feedback-popup__form--heading">
          {languageIndex === 0 ? 'Help us improve by giving us feedbacks!' : '??????????????????????????????????????????????????????'}
        </p>

        <div className="feedback-popup__form--star-container">
          <img src={star > 0 ? starSolid : starRegular} alt="" onClick={setReviewStar.bind(1)}></img>
          <img src={star > 1 ? starSolid : starRegular} alt="" onClick={setReviewStar.bind(2)}></img>
          <img src={star > 2 ? starSolid : starRegular} alt="" onClick={setReviewStar.bind(3)}></img>
          <img src={star > 3 ? starSolid : starRegular} alt="" onClick={setReviewStar.bind(4)}></img>
          <img src={star > 4 ? starSolid : starRegular} alt="" onClick={setReviewStar.bind(5)}></img>
        </div>

        <p className="feedback-popup__form--sub-heading">
          {languageIndex === 0 ? 'How would you describe yourself?' : '?????????????????????????????????????????????'}
        </p>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref1} name="job"></input>
          <label>{languageIndex === 0 ? 'High school student' : '?????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref2} name="job"></input>
          <label>{languageIndex === 0 ? 'College student' : '?????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref3} name="job"></input>
          <label>{languageIndex === 0 ? 'Working' : '?????????'}</label>
        </div>
        <input type="text" placeholder={languageIndex === 0 ? 'Others' : '?????????'} ref={ref4}></input>

        <p className="feedback-popup__form--sub-heading">
          {languageIndex === 0 ? 'How long have you been using Checkpoint.tokyo?' : 'Checkpoint.tokyo??????????????????????????????????????????????????????'}
        </p>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref5} name="duration"></input>
          <label>{languageIndex === 0 ? 'Less than a week' : '1????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref6} name="duration"></input>
          <label>{languageIndex === 0 ? 'A week' : '1??????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref7} name="duration"></input>
          <label>{languageIndex === 0 ? 'Almost 1 month' : '??????1??????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="radio" ref={ref8} name="duration"></input>
          <label>{languageIndex === 0 ? 'More than 1 month' : '1????????????'}</label>
        </div>

        <p className="feedback-popup__form--sub-heading">
          {languageIndex === 0 ? 'How do you use Checkpoint.tokyo?' : 'Checkpoint.tokyo??????????????????????????????????????????'}
        </p>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref9}></input>
          <label>{languageIndex === 0 ? 'With full-screen browser on my computer' : '???????????????????????????????????????????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref10}></input>
          <label>{languageIndex === 0 ? 'With minimized browser on my computer' : '????????????????????????????????????????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref11}></input>
          <label>{languageIndex === 0 ? 'With half-screen browser on my computer' : '???????????????????????????????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref12}></input>
          <label>{languageIndex === 0 ? 'With my Phone' : '???????????????'}</label>
        </div>

        {languageIndex === 0 ? (
          <p className="feedback-popup__form--sub-heading">What problem does Checkpoint.tokyo solve for you?</p>
        ) : (
          <p className="feedback-popup__form--sub-heading">
            ???????????????????????? <br></br> Checkpoint.tokyo??????????????????????????????????????????
          </p>
        )}
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref13}></input>
          <label>{languageIndex === 0 ? 'Checkpoint improves my sleep quality' : 'Checkpoint?????????????????????????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref14}></input>
          <label>{languageIndex === 0 ? 'Checkpoint increases my productivity' : '??????????????????'}</label>
        </div>
        <div className="feedback-popup__form--checkbox-container">
          <input type="checkbox" ref={ref15}></input>
          <label>{languageIndex === 0 ? 'Checkpoint makes me feel relaxed' : '????????????????????????'}</label>
        </div>
        <input type="text" placeholder={languageIndex === 0 ? 'Others' : '?????????'} ref={ref16}></input>

        <div className="feedback-popup__form--submit-btn" onClick={submitHandler}>
          {languageIndex === 0 ? 'Send' : '??????'}
        </div>
      </div>
    </div>
  );
}

export default FeedbackPopup;
