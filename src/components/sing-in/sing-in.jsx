// import React, { useEffect, useState } from "react";
// import "./style.scss";
// import axios from "axios";

// function SignIn({setKray}) {
//   const [showPassword, setShowPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     if (user && user.role === "manager") {
//       localStorage.setItem("user", JSON.stringify(user));
//       setKray(prev => !prev)
//     }else if(user && user.role === "Boss") {
//       localStorage.setItem("user", JSON.stringify(user));
//       setKray(prev => !prev)
//       console.log('okk');
//     }
//   }, [user]);

//   const login = async (e) => {
//     e.preventDefault();
  
//     const formData = Object.fromEntries(new FormData(e.target).entries());
//     try {
//       const res = await axios.post(
//         "https://analizesystem.pythonanywhere.com/api/v1/auth/login/",
//         formData
//       );
//       setUser(res.data);
//     } catch (error) {
//       setMessage("Неправильный логин или пароль");
//     }
//   };

//   const handleSPassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <div className="signIn-container">
//       <form onSubmit={login}>
//         <label htmlFor="username">
//           Имя пользователя
//           <input
//             name="username"
//             type="text"
//             placeholder="Введите имя пользователя"
//             required
//           />
//         </label>
//         <label htmlFor="password">
//           Пароль
//           <input
//             name="password"
//             type={showPassword ? "text" : "password"}
//             placeholder="Введите пароль"
//             required
//           />
//           <img
//             src={showPassword ? "/sing/eye.svg" : "/sing/eyenot.svg"}
//             alt="Показать пароль"
//             onClick={handleSPassword}
//           />
//         </label>

//         <p>{message}</p>

//         <button type="submit">Войти</button>
//       </form>
//     </div>
//   );
// }

// export default SignIn;



import React, { useEffect, useState } from "react";
import "./style.scss";
import axios from "axios";

function SignIn({ setKray }) {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user && (user.role === "manager" || user.role === "Boss")) {
      localStorage.setItem("user", JSON.stringify(user));
      setKray(prev => !prev);
    }
  }, [user]);

  const login = async (e) => {
    e.preventDefault();
  
    const formData = Object.fromEntries(new FormData(e.target).entries());
    try {
      const res = await axios.post(
        "https://analizesystem.pythonanywhere.com/api/v1/auth/login/",
        formData
      );
      setUser(res.data);
    } catch (error) {
      setMessage("Неправильный логин или пароль");
    }
  };

  const handleSPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="signIn-container">
      <form onSubmit={login}>
        <label htmlFor="username">
          Имя пользователя
          <input
            name="username"
            type="text"
            placeholder="Введите имя пользователя"
            required
          />
        </label>
        <label htmlFor="password">
          Пароль
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Введите пароль"
            required
          />
          <img
            src={showPassword ? "/sing/eye.svg" : "/sing/eyenot.svg"}
            alt="Показать пароль"
            onClick={handleSPassword}
          />
        </label>

        <p>{message}</p>

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default SignIn;
