import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function HeaderAdmin({ setKray }) {
  const toHome = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const [exit, setExit] = useState(false);

  const handleSidebar = () => {
    setSidebar((prev) => !prev);
  };

  const handleExit = () => {
    setExit((prev) => !prev);
  };

  const eXIT = () => {
    if (typeof setKray === "function") {
      setKray((prev) => !prev);
      localStorage.clear();
      toHome("/");
    } else {
      localStorage.clear();
      toHome("/");
    }
  };

  return (
    <div className="header-container">
      {exit && (
        <div className="exit" onClick={handleExit}>
          <div className="inner" onClick={(e) => e.stopPropagation()}>
            <h2>Вы хотите выйти?</h2>
            <div>
              <button onClick={eXIT}>Да</button>
              <button onClick={handleExit}>Нет</button>
            </div>
          </div>
        </div>
      )}

      {sidebar && (
        <div className="sidebar" onClick={handleSidebar}>
          <div className="inner" onClick={(e) => e.stopPropagation()}>
            {/* <Link to={"/foods"} onClick={handleSidebar}>Меню</Link>
            <Link to={"/users"} onClick={handleSidebar}>Работники</Link> */}
            <Link>Отчет за все время</Link>
            <Link onClick={handleExit}>Выйти с профиля</Link>
          </div>
        </div>
      )}

      <div className="inner">
        <div className="zag">
          <Link to={"/"}>Главная</Link>
        </div>

        <div className="burger" onClick={handleSidebar}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
