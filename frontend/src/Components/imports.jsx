import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// ----------- CSS ---------- //
import "./App.css";
import "flowbite/dist/flowbite.css";
import "flowbite/dist/flowbite.js";

// ----- COMPONENTS ---------//
import * as Components from "./";
const {
  Login: { LoginT, LoginS },
  SignUp: { SignUp },
  TeachStu: { TeachStu },
  Slogin: { Seeattend, Slogin },
  Tlogin: {
    ResetPassword: { Changepass, Forgotpass, Resetpass },
    TeacherEdit,
    Tlogin,
  },
  TakeAttend: { TakeAttend },
  CreateAttend: { CreateAttend },
  UpdateStud: { SelectStud, UpdateStud },
  MarkAttend: { MarkAttend },
  EditModal: { EditStud },
  StudentSection: { CheckAttend, CheckSub },
  JobPortal: { JobCard, Job },
} = Components;

function App() {
  const [Subject, setSubject] = useState("");
  const [Branch, setBranch] = useState("");
  const [SelectedDate, setSelectedDate] = useState(new Date());
  
  // Array for the update Student
  const [Upstud, setUpstud] = useState({});

  const handleChange = (e) => {
    setSubject(e.target.value);
  };
  const handleChangeBranch = (e) => {
    setBranch(e.target.value);
  };

  // Authorized Student
  const [AuthorizedStud, setAuthorizedStud] = useState({});

  // Link containing the gmail verification
  const [link, SetLink] = useState("");
  // State Containing the logged user's details
  const [userData, setUserData] = useState({});
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/loginteach" element={<LoginT />}></Route>
        </Routes>
        <Routes>
          <Route exact path="/loginstud" element={<LoginS />}></Route>
        </Routes>
        <Routes>
          <Route exact path="/signup" element={<SignUp />}></Route>
        </Routes>
        <Routes>
          <Route exact path="/" element={<TeachStu />}></Route>
        </Routes>
     
        <Routes>
          <Route exact path="/job" element={<Job />}></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/tlogin"
            element={<Tlogin userData={userData} setUserData={setUserData} />}
          ></Route>
        </Routes>
        <Routes>
          <Route exact path="/seeattend" element={<Seeattend />}></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/slogin"
            element={
              <Slogin
                AuthorizedStud={AuthorizedStud}
                setAuthorizedStud={setAuthorizedStud}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/checksubs"
            element={
              <CheckSub
                AuthorizedStud={AuthorizedStud}
                setAuthorizedStud={setAuthorizedStud}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route exact path="/seeattend" element={<Seeattend />}></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/checkattend"
            element={
              <CheckAttend
                Branch={Branch}
                AuthorizedStud={AuthorizedStud}
                setAuthorizedStud={setAuthorizedStud}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/forgotpassword"
            element={
              <Forgotpass
                userData={userData}
                setUserData={setUserData}
                link={link}
                SetLink={SetLink}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/resetpassword"
            element={
              <Resetpass
                userData={userData}
                setUserData={setUserData}
                link={link}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/editstud"
            element={
              <EditStud
                Upstud={Upstud}
                setUpstud={setUpstud}
                Subject={Subject}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/takeattend"
            element={
              <TakeAttend
                Subject={Subject}
                Branch={Branch}
                handleChangeBranch={handleChangeBranch}
                handleChange={handleChange}
                SelectedDate={SelectedDate}
                setSelectedDate={setSelectedDate}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route exact path="/createattend" element={<CreateAttend />}></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/updatestud"
            element={
              <UpdateStud
                Subject={Subject}
                Branch={Branch}
                Upstud={Upstud}
                setUpstud={setUpstud}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/selectstud"
            element={
              <SelectStud
                Subject={Subject}
                Branch={Branch}
                handleChangeBranch={handleChangeBranch}
                handleChange={handleChange}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/makeattend"
            element={
              <MarkAttend
                Subject={Subject}
                handleChange={handleChange}
                Branch={Branch}
                SelectedDate={SelectedDate}
              />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/editteacher"
            element={
              <TeacherEdit userData={userData} setUserData={setUserData} />
            }
          ></Route>
        </Routes>
        <Routes>
          <Route
            exact
            path="/resetpassword/changepass"
            element={
              <Changepass userData={userData} setUserData={setUserData} />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
