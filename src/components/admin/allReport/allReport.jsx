import { useEffect, useState } from "react";
import "./style.scss";
import { useSearchParams } from "react-router-dom";
import { Fetching } from "../../layout/fetching";
import axios from "axios";

function AllReport() {
  const branchname = JSON.parse(sessionStorage.getItem("branchName"));
  const [params] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(null);

  const processItems = (items) => {
    let totalSalesSum = 0;
    let combinedProducts = {};

    for (let key in items) {
      if (typeof items[key] === "object" && items[key] !== null) {
        if (items[key].total_sales) {
          totalSalesSum += items[key].total_sales;
        }
        if (items[key].products) {
          for (let productName in items[key].products) {
            if (combinedProducts[productName]) {
              combinedProducts[productName].quantity +=
                items[key].products[productName].quantity;
              combinedProducts[productName].total_price +=
                items[key].products[productName].total_price;
            } else {
              combinedProducts[productName] = {
                ...items[key].products[productName],
              };
            }
          }
        }
      }
    }

    return {
      total_sales: totalSalesSum,
      products: combinedProducts,
    };
  };

  useEffect(() => {
    setReports(false)
    axios
      .get(
        `https://analizesystem.pythonanywhere.com/api/v1/branch_sales_report/${params.get(
          "branchId"
        )}/`
      )
      .then((res) => {
        setTotal(processItems(res.data));
        setReports(Object.entries(res.data));
      })
      .catch((err) => console.error(err));
  }, []);

  const renred = (items) => {
    for (let key in items) {
      if (typeof items[key] === "object" && items[key] !== null) {
        const obj = Object.entries(items[key]);

        return (
          <>
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
                {obj.map((item, index) => (
                  <tr key={index} className="product">
                    <td>{item[0]}</td>
                    <td>{item[1].total_price / item[1].quantity} c</td>
                    <td>{item[1].quantity} шт</td>
                    <td>{item[1].total_price} c</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        );
      }
    }
  };

  const renderTotal = () => {
    if (total) {
      return (
        <>
          <table className="inner">
            <thead>
              <tr>
                <td>Название блюдо</td>
                <td>Было продано</td>
                <td>Выручка с продукта</td>
              </tr>
            </thead>
            <tbody>
              {Object.entries(total.products).map((item, index) => (
                <tr key={index} className="product">
                  <td>{item[0]}</td>
                  <td>{item[1].quantity} шт</td>
                  <td>{item[1].total_price} c</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
  };

  return (
    <div className="allReport-container">
      {reports ? 
      
      reports.length > 0 ? (
        <>
          <div className="reports">
            {reports.map((item, index) => (
              <div key={index} className="report">
                <h2>{item[0]}</h2>
                <div className="items">{renred(item[1])}</div>

                <div className="total">
                  <h3>Выручка: {item[1].total_sales} c</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="totalAll">
            <h2>Заведение: {branchname}</h2>
            {renderTotal()}
            {total ? (
              <div className="total">
                <h3>Выручка: {total.total_sales} c</h3>
              </div>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <div className="notSoll">
          <p>
            Не было продаж...
          </p>
        </div>
      )
      :
      <Fetching />
      }

    </div>
  );
}

export { AllReport };
