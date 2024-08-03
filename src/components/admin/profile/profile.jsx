import "./style.scss";
import { useState, useEffect } from "react";
import { Fetching } from "../../layout/fetching";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [myAccount, setMyAccount] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("user"));
    if (local && local.id) {
      setFetching(true);
      axios
        .get(
          `https://analizesystem.pythonanywhere.com/api/v1/user/${local.id}/branches/`
        )
        .then((res) => {
          setMyAccount(res.data);
        })
        .catch((err) => setMessage(err.message))
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  return (
    <div className="profile-container">
      {fetching ? (
        <Fetching />
      ) : (
        <div className="inner">
          {message ? (
            <p>{message}</p>
          ) : (
            myAccount &&
            myAccount.length > 0 && (
              <>
                {myAccount.map((item, index) => (
                  <div key={index} className="branches">
                    <div className="about-filial">
                      <h2>
                        <span>
                          Название заведения: <br />
                        </span>
                        {item.name}
                      </h2>
                      <p>
                        <span>Адрес:</span> <br /> {item.address}
                      </p>
                      <h3>
                        <span>Описание:</span> <br />
                        {item.description}
                      </h3>
                    </div>

                    <div className="static">
                      <Link
                        to={`users?branchId=${item.id}`}
                        className="managers"
                      >
                        <h2>Работники</h2>
                        <p>Кол-во: {item.managers.length}</p>
                      </Link>

                      <Link to={`foods?branchId=${item.id}`} className="foods">
                        <h2>Меню</h2>
                        <p>Кол-во: {item.products.length}</p>
                      </Link>
                    </div>
                  </div>
                ))}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
