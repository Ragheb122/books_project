// import "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000" from "../../assets/images/logos/monsterlogo.png";
import { Link } from "react-router-dom";

const Logo = ({ width, height }) => {
  return (
    <Link to="/">
      <span>
        <img
          src={
            "https://img.freepik.com/free-vector/golden-bird-logo-design_1195-336.jpg?w=2000"
          }
          width={width}
          height={height}
          alt="logo"
        />
      </span>
    </Link>
  );
};

export default Logo;
