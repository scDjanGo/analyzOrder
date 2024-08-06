import axios from "axios";
import "./style.scss";
import { useEffect, useState } from "react";

function LastReport() {
  const [sales, setSales] = useState(null);
  const [user, setUser] = useState(null);
  const myId = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(
        `https://analizesystem.pythonanywhere.com/api/v1/sales_report/${myId.id}/`
      )
      .then((res) => {
        
        setSales(
          Object.entries(res.data.products).sort(
            (a, b) => b[1].quantity - a[1].quantity
          )
        );
        setUser(res.data);
      })
      .catch((err) => console.error(err))
  }, []);

  return (
    <div className="lastReport-container">

      {sales ? (
        sales.length > 0 ? (
          <>
      <h2 className="name">{myId.username}</h2>
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
          </>
        ) : (
          <div className="empty">
      <h2 className="name">{myId.username}</h2>
            <h2>Нет продаж...</h2>
          </div>
        )
      ) : (
        <div className="fetching">
            <h2>Загрузка...</h2>
        </div>
      )}
    </div>
  );
}

export { LastReport };
