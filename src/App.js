import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'; // Đảm bảo import đúng đường dẫn của các component
import Home from './pages/Home/Home'; // Đảm bảo import đúng đường dẫn của các component
import Profile from './pages/Profile/Profile';
import { createBrowserHistory } from 'history'
import { UserTemplate } from './templates/UserTemplate/UserTemplate';
import './App.css'
import Login from './pages/Login/Login';
import DetailActivity from './components/DetailActivity';
import ProcessType from './pages/ProcessType/ProcessType';
import ReportType from './pages/ReportType/ReportType';
import DetailFanpage from './pages/Fanpage/DetailFanpage';
import CreateFanpage from './pages/Fanpage/CreateFanpage';
import Result from './pages/Result/Result';
import StatisticalUser from './pages/StatisticalUser/StatisticalUser';
import Group from './pages/Groups/Group';
import DynamicForm from './Test';
import DetailProcess from './pages/DetailProcess/DetailProcess';
import { AdminTemplate } from './templates/AdminTemplate/AdminTemplate';
import Achivement from './pages/Achivement/Achivement';
import Role from './pages/Role/Role';
import Moderator from './pages/Moderator/Moderator';
import AdminFanpage from './pages/AdminFanpage/AdminFanpage';
import AdminActivity from './pages/AdminActivity/AdminActivity';
import Report from './pages/Report/Report';
import LoginMobile from './pages/LoginMobile/LoginMobile';
import HomeMobile from './pages/HomeMobile/HomeMobile';
import ProfileModerator from './ProfileModerator/ProfileModerator';
import Message from './pages/Message/Message';
import CalendarComponent from './Test';
import AdminStatistical from './pages/AdminStatistical/AdminStatistical';
import Volunteer from './pages/Volunteer/Volunteer';
import Sta from './Sta';
import StatisticalUser1 from './pages/StatisticalUser/StatisticalUser1';
import AdminStatistical1 from './pages/AdminStatistical/AdminStatistical1';
import Detail from './Detail';
import Search from './pages/Search/Search';
export const history = createBrowserHistory()

function App () {
  return (
    <Router history={history}>
      <Switch>
        <AdminTemplate exact path="/achivement" Component={Achivement} />
        <AdminTemplate exact path="/processtype" Component={ProcessType} />
        <AdminTemplate exact path="/reporttype" Component={ReportType} />
        <AdminTemplate exact path="/role" Component={Role} />
        <AdminTemplate exact path="/moderator" Component={Moderator} />
        <AdminTemplate exact path="/adminfanpage" Component={AdminFanpage} />
        <AdminTemplate exact path="/adminactivity" Component={AdminActivity} />
        <AdminTemplate exact path="/report" Component={Report} />
        <AdminTemplate exact path="/adminstatistical" Component={AdminStatistical} />
        <AdminTemplate exact path="/adminstatistical1" Component={AdminStatistical1} />
        <AdminTemplate exact path="/volunteer" Component={Volunteer} />
        <AdminTemplate exact path="/profilemoderator/:id" Component={ProfileModerator} />
        <UserTemplate path="/profile/:id" exact Component={Profile} />
        <UserTemplate path="/home" exact Component={Home} />
        <UserTemplate exact path="/fanpage/:id" Component={DetailFanpage} />
        <UserTemplate exact path="/message/:id" Component={Message} />
        <UserTemplate exact path="/message" Component={Message} />
        <UserTemplate exact path="/createfanpage" Component={CreateFanpage} />
        <UserTemplate exact path="/history" Component={Result} />
        <UserTemplate exact path="/statisticaluser" Component={StatisticalUser} />
        <UserTemplate exact path="/statisticaluser1" Component={StatisticalUser1} />
        <UserTemplate exact path="/groups" Component={Group} />
        <UserTemplate exact path="/search/:title" Component={Search} />
        <Route exact path="/test" component={CalendarComponent} />
        <Route exact path="/sta" component={Sta} />
        <Route exact path="/detail/:id" component={Detail} />
        <UserTemplate exact path="/detailprocess/:id" Component={DetailProcess} />
        <Route path="/detailactivity/:id" exact component={DetailActivity} />
        <Route exact path="/loginmobile" component={LoginMobile} />
        <Route exact path="/homemobile" component={HomeMobile} />
        <Route path="/" exact component={Login} />
      </Switch>
    </Router>
  );
}

export default App;