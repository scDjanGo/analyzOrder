import "./style.scss";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SalesUser() {
  const nav = useNavigate();
  const [branch, setBranch] = useSearchParams();
  const [sales, setSales] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(
        `https://analizesystem.pythonanywhere.com/api/v1/sales_report/${branch.get(
          `branchId`
        )}/`
      )
      .then((res) => {
        setSales(
          Object.entries(res.data.products).sort(
            (a, b) => b[1].quantity - a[1].quantity
          )
        );
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleBack = () => {
    nav(-1);
  };

  return (
    <div className="salesUser-container">
      <button>
        <p onClick={handleBack}>Назад</p>
      </button>
      {user && <h2>{user.manager}</h2>}
      {sales.length > 0 ? (
        <div className="outer">
        <table className="inner">
          <thead>
            <tr>
              <td>Название блюдо</td>
              <td>Стоимость</td>
              <td>Было продано</td>
              <td>Выручка с продукта</td>
            </tr>
          </thead>
          <tbody>
            {sales.map((item, index) => (
              <tr key={index} className="product">
                <td>{item[0]}</td>
                <td>{item[1].total_price / item[1].quantity} c</td>
                <td>{item[1].quantity} шт</td>
                <td>{item[1].total_price} c</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total">
            <h3>Обшая выручка: {user.total_sales} c</h3>
        </div>
        </div>
      ) : (
        <div className="empty">
          <p>Нечего не продан...</p>
        </div>
      )}
    </div>
  );
}

export { SalesUser };
