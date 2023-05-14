import Navbar from "./components/navbar/Navbar";
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/home/Home";
import Projects from "./pages/projecthome/Projecthome";
import Contact from "./pages/contact/Contact";
import Footer from "./components/footer/Footer";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Error from "./pages/errorpage/Error";
import 'tippy.js/dist/tippy.css';
import TextUtils from "./projects/textUtils/Textutils";
import Onlinecodecompiler from "./projects/onlineCodeCompiler/Onlinecodecompiler";
import Userhome from "./pages/userhome/Userhome";
import Changepassword from "./pages/changepassword/Changepassword";
import Notebooks from "./projects/notebook/Notebooks";
import Notes from "./projects/notebook/Notes";
import Createnote from "./projects/notebook/createnote/Createnote";
import Viewnote from "./pages/viewnote/Viewnote";
import Editprofile from "./pages/editprofile/Editprofile";
import Messages from "./pages/messages/Messages";
import Userlist from "./pages/userlist/Userlist";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/work' element={<Projects />} />
        <Route path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/textutils' element={<TextUtils />} />
        <Route path='/compiler' element={<Onlinecodecompiler />} />
        <Route path='/userhome' element={<Userhome />} />
        <Route path='/updatepassword' element={<Changepassword />} />
        <Route path='/editprofile' element={<Editprofile />} />
        <Route path='/notebook' element={<Notebooks />} />
        <Route path='/notebook/:notebookId' element={<Notes />} />
        <Route path='/createnote/:notebookId' element={<Createnote />} />
        <Route path='/:notebookId/editnote/:noteId' element={<Createnote />} />
        <Route path='/:notebookId/viewnote/:noteId' element={<Viewnote />} />
        <Route path='/users' element={<Userlist />} />
        <Route path='/users/:userId' element={<Notebooks />} />
        <Route path='/updateuser/:userId' element={<Editprofile />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/viewmessage' element={<Viewnote />} />
        <Route path='/*' element={<Error />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;
