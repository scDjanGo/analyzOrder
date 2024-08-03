import "./style.scss";
import { useState, useEffect } from "react";

function LastOrder() {
  const [lastOrder, setLastOrder] = useState(null);
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const todayOrder = JSON.parse(localStorage.getItem("today"));

    if (todayOrder) {
      setLastOrder(todayOrder);
      setTotal(todayOrder.reduce((sum, item) => sum + item.quantity * item.price, 0))
    }
  }, []);


  return (
    <div className="lastOrder-container">
      {lastOrder ? (
        <>
        <div className="total">Общая сумма {total}с</div>
        <div className="inner">
          {lastOrder.length &&
            lastOrder.map((food, index) => (
              <div key={index} className="food">
                <div className="elem">
                  <img
                    src={`https://analizesystem.pythonanywhere.com/${food.image}`}
                    alt="#"
                  />
                  <div className="zag">
                    <h2>{food.title}</h2>
                    <p>{food.price} с</p>
                  </div>
                </div>
                <div className="button">
                    <div>{food.quantity} шт</div>
                </div>
              </div>
            ))}
        </div>
        </>
      ) : (
        <div className="empty">Пусто</div>
      )}
    </div>
  );
}

export { LastOrder };
