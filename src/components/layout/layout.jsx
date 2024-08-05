import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import SignIn from "../sing-in/sing-in";
import Header from "../user/hedaer/header";
import HeaderAdmin from "../admin/header/header";
import { Main } from "../user/main/main";

function Layout({ifMe, unload}) {
  const [myAccount, setMyAccount] = useState(null);
  const [kray, setKray] = useState(false);

  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setMyAccount(user);
      if(user.role === 'Boss') {
        ifMe(true)
      }else {
        ifMe(false)
      }
    } else {
      setMyAccount(null);
    }
  }, [kray, unload]);

  if (!myAccount) {
    return <SignIn kray={kray} setKray={setKray} />;
  } else if (myAccount && myAccount.role === "manager") {
    return (
      <>
      <div style={{display: 'none'}}>
        <Main setKray={setKray}/>
      </div>
        <Header kray={kray} setKray={setKray} />
        <Outlet />
      </>
    );
  } else if (myAccount && myAccount.role === "Boss") {
    return (
      <>
        <HeaderAdmin kray={kray} setKray={setKray} />
        <Outlet />
      </>
    );
  }
}

export default Layout;