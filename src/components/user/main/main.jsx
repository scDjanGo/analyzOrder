import "./style.scss";
import Header from "../hedaer/header";

import { Fetching } from "../../layout/fetching";
import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../layout/layout";

function Main() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [bestMenu, setBestMenu] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [counts, setCounts] = useState([]);
  const [cn, setCn] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [today, setToday] = useState([]);
  const [unload, setUnload] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const myAccount = JSON.parse(localStorage.getItem("user"));
    setUser(myAccount);
    if (myAccount.role === "manager") {
      axios
        .get(
          `https://analizesystem.pythonanywhere.com/api/v1/user/${myAccount.id}/branches/`
        )
        .then((res) => {
          const menuItems = res.data[0].products.filter((elem) => !elem.izbran);
          setMenu(menuItems);
          setCn(Array(menuItems.length).fill(0));
          const bestMenuItems = res.data[0].products.filter(
            (elem) => elem.izbran
          );
          setBestMenu(bestMenuItems);
          setCounts(Array(bestMenuItems.length).fill(0));
        })
        .catch((err) => console.error(err))
        .finally(() => setFetching((prev) => !prev));
    } else {
      <Layout unload={unload} setUnload={setUnload} />;
      setUnload(prev => !prev);
      console.log("blya");
    }
  }, []);

  const handleInc = (i) => {
    const newCount = [...counts];
    newCount[i] += 1;
    setCounts(newCount);
    setTotalCount(totalCount + bestMenu[i].price);
    updateSelectedItems(bestMenu[i], newCount[i]);
  };

  const handleDec = (i) => {
    if (counts[i] > 0) {
      const newCount = [...counts];
      newCount[i] -= 1;
      setCounts(newCount);
      setTotalCount(totalCount - bestMenu[i].price);
      updateSelectedItems(bestMenu[i], newCount[i]);
    }
  };

  const handleMI = (i) => {
    const newCount = [...cn];
    newCount[i] += 1;
    setCn(newCount);
    setTotalCount(totalCount + menu[i].price);
    updateSelectedItems(menu[i], newCount[i]);
  };

  const handleMD = (i) => {
    if (cn[i] > 0) {
      const newCount = [...cn];
      newCount[i] -= 1;
      setCn(newCount);
      setTotalCount(totalCount - menu[i].price);
      updateSelectedItems(menu[i], newCount[i]);
    }
  };

  const handleDone = () => {
    const selected = [];
    const lastOrder = []

    bestMenu.forEach((item, index) => {
      if (counts[index] > 0) {
        selected.push({ product: item.id, quantity: counts[index] });
        lastOrder.push({...item, quantity: counts[index] })
      }
    });

    menu.forEach((item, index) => {
      if (cn[index] > 0) {
        selected.push({ product: item.id, quantity: cn[index] });
        lastOrder.push({...item, quantity: cn[index] })
      }
    });
    if (selected.length > 0) {
      localStorage.setItem("today", JSON.stringify(lastOrder));
      setToday(selected);

      const order = {
        manager: user.id,
        items: selected,
      };

      console.log(order);
      

      axios
        .post(`https://analizesystem.pythonanywhere.com/api/v1/korzina/`, order)
        .then((res) => {
          setCounts(prev => prev.fill(0))
          setTotalCount(0)
          setSelectedItems([])
          setCn(prev => prev.fill(0))
        })
        .catch((err) => console.error(err))
    }
  };

  const updateSelectedItems = (item, count) => {
    setSelectedItems((prevSelectedItems) => {
      const index = prevSelectedItems.findIndex(
        (selectedItem) => selectedItem.id === item.id
      );

      if (count === 0) {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      }

      if (index !== -1) {
        const updatedItems = [...prevSelectedItems];
        updatedItems[index] = { ...item, count };
        return updatedItems;
      }

      return [...prevSelectedItems, { ...item, count }];
    });
  };

  const removeSelectedItem = (itemId) => {
    const bestMenuIndex = bestMenu.findIndex((item) => item.id === itemId);
    if (bestMenuIndex !== -1) {
      const newCounts = [...counts];
      setTotalCount(
        totalCount - newCounts[bestMenuIndex] * bestMenu[bestMenuIndex].price
      );
      newCounts[bestMenuIndex] = 0;
      setCounts(newCounts);
    }

    const menuIndex = menu.findIndex((item) => item.id === itemId);
    if (menuIndex !== -1) {
      const newCn = [...cn];
      setTotalCount(totalCount - newCn[menuIndex] * menu[menuIndex].price);
      newCn[menuIndex] = 0;
      setCn(newCn);
    }

    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((item) => item.id !== itemId)
    );
  };

  return (
    <div className="user-container">
      <div className="displayNone" style={{ display: "none" }}>
        <Header today={today} />
      </div>

      <div className="inner">
        {fetching ? (
          <Fetching />
        ) : (
          <>
            <div className="menuItems">
              <div className="up">
                {bestMenu.length > 0 &&
                  bestMenu.map((food, index) => (
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
                        <button onClick={() => handleDec(index)}>-</button>
                        <p>{counts[index]}</p>
                        <button onClick={() => handleInc(index)}>+</button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="down">
                {menu.length &&
                  menu.map((food, index) => (
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
                        <button onClick={() => handleMD(index)}>-</button>
                        <p>{cn[index]}</p>
                        <button onClick={() => handleMI(index)}>+</button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="bron">
                {selectedItems.length > 0 && (
                  <div className="selected-items">
                    <h3>Выбранные позиции</h3>
                    <div className="inner">
                      {selectedItems.map((item) => (
                        <div key={item.id} className="selected-item">
                          <div className="zag">
                            <img
                              src={`https://analizesystem.pythonanywhere.com/${item.image} `}
                              alt=""
                            />
                            <div>
                              <p>{item.title}</p>
                              <p>{item.price} с</p>
                              <p style={{ marginTop: "10px" }}>
                                {item.count} шт.
                              </p>
                            </div>
                          </div>
                          <button onClick={() => removeSelectedItem(item.id)}>
                            <div><img src="/sing/delete.svg" alt="del" /></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="order">
                <div className="inner">
                  <h2>{totalCount || 0} с</h2>
                  <button onClick={handleDone}>Готово</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { Main };
