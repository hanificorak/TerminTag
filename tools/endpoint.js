const BASE_URL = "http://localhost:3000";

const Endpoint = {
  Login: `${BASE_URL}/api/auth/login`,
  Register: `${BASE_URL}/api/auth/register`,
  Cities: `${BASE_URL}/api/param/getCities`,
  Verify: `${BASE_URL}/api/auth/verify`,
  ReplyVerify:`${BASE_URL}/api/auth/replyVerify`,
  AppointmentData:`${BASE_URL}/api/appointment/getData`,
  AppointmentParam:`${BASE_URL}/api/appointment/getParam`,
  AppointmentSave:`${BASE_URL}/api/appointment/save`,
  AppointmentDelete:`${BASE_URL}/api/appointment/delete`,
  SettingsSave:`${BASE_URL}/api/settings/save`,
  SettingsData:`${BASE_URL}/api/settings/getData`,
  CategoryAdd:`${BASE_URL}/api/appointment/addCategory`,
  ProfileData:`${BASE_URL}/api/profile/getData`,
  UpdateProfile:`${BASE_URL}/api/profile/updateProfile`,
  UpdatePassword:`${BASE_URL}/api/profile/updatePassword`,
  DashboardData:`${BASE_URL}/api/dashboard/getData`,



  
};

export default Endpoint;