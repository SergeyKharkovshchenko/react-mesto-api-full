import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Card({ card, onCardClick, onCardDelete, onCardLike }) {

  const currentUser = useContext(CurrentUserContext);
  console.log("currentUser = " + currentUser);
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  console.log("currentUser._id = " + currentUser._id);
  console.log("card.likes = " + card.likes);
  const isOwner = card.owner._id == currentUser._id;
  console.log("card.owner._id = " + card.owner._id);
  console.log("card.owner = " + card.owner);

  const handleCardClick = () => {
    onCardClick(card);
  };

  const handleCardDeleteClick = () => {
    onCardDelete(card);
  };

  const handleCardLike = () => {
    onCardLike(card);
  };

  return (
    <li className="element" id={card._id} >
      <img
        src={card.link}
        onClick={(e) => {
          handleCardClick(e);
        }}
        className="element__foto"
        alt={`фото ${card.name}`}
      />
      {isOwner && (
        <button
          className="element__thrashbin"
          type="button"
          onClick={(e) => {
            handleCardDeleteClick(e);
          }}
        >
          {" "}
        </button>
      )}
      <div className="element__bottom">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__heart-and-counter">
          <button
            className={
              isLiked
                ? "element__heart element__heart-color-black"
                : "element__heart"
            }
            type="button"
            onClick={(e) => {
              handleCardLike(e);
            }}
          ></button>
          <p className="element__likescounter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;
