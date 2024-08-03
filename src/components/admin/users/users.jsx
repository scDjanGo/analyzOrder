import axios from "axios";
import "./style.scss";
import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ifMe = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://analizesystem.pythonanywhere.com/api/v1/branches/${searchParams.get('branchId')}/`
      )
      .then((response) => {
        console.log(response.data);
        setUsers(response.data.managers);
      })
      .catch((err) => console.error(err));
  }, []);
  

  return (
    <div className="users-container">
      {users.length > 0 ? (
        <>
          {/* <div className="buttons">
            <Link to={"/addUser"}>Добавить +</Link>
          </div> */}
          <div className="inner">
            {users.map((item) => (
              <Link  to={`/salesUser?branchId=${item.id}`} key={item.id} className="user">
                <span>Имя пользователя</span>
                <h2>{item.username || "Пусто..."}</h2>
                <span>Имя</span>
                <p>{item.first_name || "Отсуствует"}</p>
                <span>Фамилия</span>
                <p>{item.last_name || "Отсуствует"}</p>
                <span>Телефон</span>
                <p>{item.phone || "Отсуствует"}</p>
                <span>Э-почта</span>
                <p>{item.email || "Отсуствует"}</p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="empty">Нету работников...</div>
      )}
    </div>
  );
}

export { Users };