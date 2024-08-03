import axios from "axios";
import "./style.scss";
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

function Foods() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState({});
  const [newFood, setNewFood] = useState({ title: "", price: "", izbran: false });
  const [updateShow, setUpdateShow] = useState(false);
  const [add, setAdd] = useState(false);
  const [baseImage64, setBaseImage64] = useState("");
  const [formError, setFormError] = useState("");
  

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setBaseImage64(loadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateFileName = (e) => {
    const input = e.target;
    const fileName = input.files[0] ? input.files[0].name : "Выберите файл";
    const label = input.previousElementSibling;
    label.textContent = fileName;

    if (add) {
      setNewFood((prev) => ({
        ...prev,
        [input.name]: input.files[0],
      }));
    } else {
      setUpdate((prev) => ({
        ...prev,
        [input.name]: input.files[0],
      }));
    }
  };

  useEffect(() => {
    const branchId = searchParams.get("branchId");
    if (branchId) {
      localStorage.setItem("parametr", JSON.stringify(searchParams.get("branchId"))) 
      axios
        .get(`https://analizesystem.pythonanywhere.com/api/v1/branch_products/${branchId}/`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((err) => console.error(err));
    }
  }, [searchParams, updateShow]);

  const handleUpdateShow = () => {
    setUpdateShow((prev) => !prev);
    setFormError("");
  };

  const handleAdd = () => {
    setAdd((prev) => !prev);
    setFormError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (add) {
      setNewFood((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setUpdate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  
  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    formData.append('branchId', JSON.parse(localStorage.getItem('parametr')))

    if (baseImage64) {
        formData.append('image', baseImage64)
    }

    fetch('https://analizesystem.pythonanywhere.com/api/v1/products/', {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(data => {
          setUpdateShow(false)
          navigate(`/foods?branchId=${JSON.parse(localStorage.getItem("parametr"))}`)
          
        })
        .catch((err) => {
          console.error(err);
          
        })
}


const handleUpdate = (e) => {
  e.preventDefault()
  const id = JSON.parse(sessionStorage.getItem("product"))

  const formData = Object.fromEntries(new FormData(e.target).entries())

  axios.patch(`https://analizesystem.pythonanywhere.com/api/v1/products/${id}/`, formData)
  .then(res => {
    handleUpdateShow()
  }).catch(err => console.error(err))
}

const handleDelete = (e) => {
  const id = JSON.parse(sessionStorage.getItem("product"))

  axios.delete(`https://analizesystem.pythonanywhere.com/api/v1/products/${id}/`)
  .then(res => {
    console.log(res);
    setUpdateShow(false)
  }).catch(err => console.error(err))
}

  return (
    <div className="users-container">
      {users.length > 0 ? (
        <>
          <div className="buttons">
            {updateShow && (
              <div className="updateFood">
                <button className="back" onClick={handleUpdateShow}>Назад</button>
                <form onSubmit={handleUpdate}>
                  <span>Название блюда</span>
                  <input
                    name="title"
                    type="text"
                    value={update.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <span>Цена</span>
                  <input
                    name="price"
                    type="number"
                    value={update.price || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <select
                    name="izbran"
                    value={update.izbran || ""}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="false">Не избранный</option>
                    <option value="true">Избранный</option>
                  </select>

                  {/* <span>Фото блюда</span>
                  <div className="custom-file-input">
                    <label className="custom-file-label" htmlFor="avatar">
                      Фото блюда
                    </label>
                    <input
                      type="file"
                      id="file4"
                      name="image"
                      onChange={(e) => {
                        handleAvatarChange(e);
                        updateFileName(e);
                      }}
                    />
                  </div> */}
                  {formError && <p className="error-message">{formError}</p>}
                  <button type="submit">Обновить</button>
                </form>
              </div>
            )}

            {add && (
              <div className="updateFood">
                <button className="back" onClick={handleAdd}>Назад</button>
                <form onSubmit={handleSubmit}>
                  <span>Название блюда</span>
                  <input
                    name="title"
                    type="text"
                    value={newFood.title}
                    onChange={handleInputChange}
                  />
                  <span>Цена</span>
                  <input
                    name="price"
                    type="number"
                    value={newFood.price}
                    onChange={handleInputChange}
                  />
                  <select
                    name="izbran"
                    value={newFood.izbran}
                    onChange={handleInputChange}
                  >
                    <option value="">Выберите статус</option>
                    <option value="true">Избранный</option>
                    <option value="false">Не избранный</option>
                  </select>

                  <span>Фото блюда</span>
                  <div className="custom-file-input">
                    <label className="custom-file-label" htmlFor="avatar">
                      Фото блюда
                    </label>
                    <input
                      type="file"
                      id="file4"
                      name="image"
                      onChange={(e) => {
                        handleAvatarChange(e);
                        updateFileName(e);
                      }}
                    />
                  </div>
                  {formError && <p className="error-message">{formError}</p>}
                  <button type="submit">Добавить</button>
                </form>
              </div>
            )}

            <Link onClick={handleAdd}>Добавить +</Link>
          </div>
          <div className="inner">
            {users.map((item) => (
              <div key={item.id} className="user foods">
                <div className="food">
                  <div className="info">
                    <img
                      src={`https://analizesystem.pythonanywhere.com/${item.image}`}
                      alt=""
                    />
                    <div className="text">
                      <h2>{item.title}</h2>
                      <p>{item.price} c</p>
                    </div>
                  </div>
                  <div className="buttons">
                    <img
                      onClick={() => {
                        handleUpdateShow();
                        sessionStorage.setItem("product", JSON.stringify(item.id))
                        setUpdate({ ...item });
                      }}
                      src="/sing/update.svg"
                      alt="upd"
                    />
                    <img onClick={(e) => {handleDelete(e); sessionStorage.setItem("product", JSON.stringify(item.id))}} src="/sing/delete.svg" alt="del" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty">Нет работников...</div>
      )}
    </div>
  );
}

export { Foods };