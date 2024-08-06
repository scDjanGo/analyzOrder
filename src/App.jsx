import "./index.scss";
import { Routes, Route } from "react-router-dom";
import { Main } from "./components/user/main/main";
import Layout from "./components/layout/layout";
import { LastOrder } from "./components/user/lastOrder/lastOrder";
import { useState } from "react";

import Profile from "./components/admin/profile/profile";
import { Users } from "./components/admin/users/users";
import HeaderAdmin from "./components/admin/header/header";
import { Add } from "./components/admin/add/add";
import { Foods } from "./components/admin/foods/foods";
import { SalesUser } from "./components/admin/sales-user/sales-user";
import { AllReport } from "./components/admin/allReport/allReport";
import { LastReport } from "./components/user/lastReport/lastReport";

function App() {
  const [myAccount, setMyAccount] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout ifMe={setMyAccount} />}>
          {myAccount ? (
            <>
              <Route index element={<Profile />} />
              <Route path="main" element={<Profile />} />
              <Route path="users" element={<Users />} />
              <Route path="foods" element={<Foods />} />
            </>
          ) : (
            <>
              <Route index element={<Main />} />
              <Route path="main" element={<Main />} />
              <Route path="lastOrder" element={<LastOrder />} />
              <Route path="lastReport" element={<LastReport />} />
            </>
          )}
        </Route>

        <Route path="/users" element={<><HeaderAdmin/><Users /></>} />
        <Route path="/foods" element={<><HeaderAdmin/><Foods /></>} />
        <Route path="/addUser" element={<Add />} />
        <Route path="/salesUser" element={<><HeaderAdmin/><SalesUser /></>}/>
        <Route path="/allReport" element={<><HeaderAdmin/><AllReport /></>}/>
      </Routes>
    </div>
  );
}

export default App;