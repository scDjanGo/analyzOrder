import axios from "axios";
import "./style.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

function Add() {
  const ifMe = JSON.parse(localStorage.getItem("user"))
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('')
  const [fetching, setFetching] = useState(false)
  const inputs = [
    { name: "username", place: "Имя пользователя", type: "text" },
    { name: "first_name", place: "Имя", type: "text" },
    { name: "last_name", place: "Фамилия", type: "text" },
    { name: "phone", place: "Телефон", type: "tel" },
    { name: "email", place: "Э-почта", type: "email" },
  ];

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const handleSubmit = (e) => {
    setFetching(prev => !prev)
    setMessage('')
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(e.target).entries())
    formData.role = "manager"

    console.log(formData);

    fetch(`https://analizesystem.pythonanywhere.com/api/v1/users/`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      console.log(res.data)
      setMessage(formData.username)
    })
    .catch(err => {
      setMessage(err)
      setFetching(prev => !prev)
    })

  };

  return (
    <div className="add-container">
      <Link to="/users">Назад</Link>
      {fetching ? 
      
      <div className="fetching">
        {message ? 
        <div className="message">
          <p>Пользователь {message} добавлен.</p>
        </div>
        :
        <div className="message">
          <p>Загрузка ...</p>
        </div>
        }
      </div>
       :
       <form onSubmit={handleSubmit}>
         {inputs.map((item, index) => (
           <div key={index}>
             <span>{item.place}</span>
             <input name={item.name} type={item.type} placeholder={item.place} required />
           </div>
         ))}
         <div>
           <span>Пароль</span>
           <input
             name="password"
             type={show ? "text" : "password"}
             placeholder="Пароль"
             minLength={8}
             required
           />
           <img
             onClick={handleShow}
             src={show ? "/sing/eye.svg" : "/sing/eyeNot.svg"}
             alt="toggle visibility"
           />
         </div>
 
         <p >{message}</p>
 
         <button type="submit">Добавить</button> {/* Указание type="submit" */}
       </form>

      }
    </div>
  );
}

export { Add };
