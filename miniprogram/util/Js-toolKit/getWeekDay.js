const getWeekDay = () => {
  let today = new Date();
  var weekday = today.getDay();
  return weekday
}
module.exports = {
  getWeekDay:getWeekDay
}