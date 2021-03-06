import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SimpleThumbnailCard from '../../components/simpleThumbnailCard/SimpleThumbnailCard';
import './Ambient.scss';

import { popupActions } from '../../store/popupSlice';

import overlay from './Premium Card 1m.png';

function Ambient(props) {
  const dispatch = useDispatch();

  const currentPage = useSelector((store) => store.page.currentPage);
  const availableAmbientArr = useSelector((store) => store.ambient.availableAmbientArr);
  const isPremium = useSelector((store) => store.member.isPremium);

  const [thumbnailArr, setThumbnailArr] = useState([]);
  const doneSetupPage = useRef();

  function showUpgradePopupHandler() {
    dispatch(popupActions.setShowUpgradePopup(true));
  }

  useEffect(() => {
    if (doneSetupPage.current) {
      return;
    }

    availableAmbientArr.forEach((ambient) => {
      setThumbnailArr((thumbnailArr) => {
        const filteredThumbnailArr = thumbnailArr.filter((thumbnail) => thumbnail.key !== ambient.id);
        return [
          ...filteredThumbnailArr,
          <div key={ambient.id}>
            <SimpleThumbnailCard
              id={ambient.id}
              name={ambient.name}
              nameJapanese={ambient.nameJapanese}
              thumbnailUrl={ambient.thumbnailUrl}
              volume={ambient.volume}
              isPremium={true}
              ambient
            ></SimpleThumbnailCard>
          </div>,
        ];
      });
    });

    if (availableAmbientArr.length > 0) {
      doneSetupPage.current = true;
    }
  }, [availableAmbientArr]);

  return (
    <div className={`ambient ${currentPage === 'ambient' ? 'current-page' : ''}`}>
      {thumbnailArr}
      {!isPremium && (
        <div className="ambient__overlay">
          <img src={overlay} alt="" onClick={showUpgradePopupHandler}></img>
        </div>
      )}
    </div>
  );
}

export default Ambient;
