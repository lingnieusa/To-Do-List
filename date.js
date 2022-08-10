//console.log(module);
module.exports.getDate = getDate;

function getDate(){
  let today = new Date();
  let options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };

  let day = today.toLocaleDateString("en-US",options);
  return day;

}

exports.getDateShort = function(){
  let today = new Date();
  let options = {
    weekday:"short",
    day:"numeric",
    month:"short"
  };

  return today.toLocaleDateString("en-US",options);

}
