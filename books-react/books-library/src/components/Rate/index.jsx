import { useState } from "react";

const Rate = ({ numStars, isClickable, handelClick }) => {
  const [rating, setRating] = useState(numStars);
  const [hover, setHover] = useState(0);

  const handelRate = (ratingValue) => {
    setRating(ratingValue);
    handelClick(ratingValue);
  };

  return (
    <div className="rating">
      {[...Array(5)].map((_, idx) => {
        const ratingValue = idx + 1;
        const isRated =
          ratingValue <= numStars || (ratingValue <= hover && isClickable);

        return (
          <label key={idx}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={
                isClickable && rating !== ratingValue
                  ? () => handelRate(ratingValue)
                  : undefined
              }
              style={{ display: "none" }}
              disabled={!isClickable}
            />
            <i
              className={`bi bi-star-fill me-1 ${
                isRated ? "text-warning" : "text-secondary"
              }`}
              onMouseEnter={
                isClickable ? () => setHover(ratingValue) : undefined
              }
              onMouseLeave={isClickable ? () => setHover(null) : undefined}
              style={{
                cursor: isClickable ? "pointer" : "default",
                opacity: ratingValue <= rating ? "1" : "0.5",
              }}
            />
          </label>
        );
      })}
    </div>
  );
};

export default Rate;
