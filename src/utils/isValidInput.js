

const isValidEmailAddress = (email) => {
    var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);  // returns a boolean 
 }

 
const isValidPassword = (password) => {
    return password.length > 7 ;  // returns a boolean 
 }

 const isValidPhone = (phone) => {
    return phone > 999999999;  // returns a boolean 
 }

 module.exports={isValidEmailAddress, isValidPassword, isValidPhone};