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



  
};

export default Endpoint;