const generateDatePattern = () => {
  let today = new Date();
  return "t" + today.getFullYear() + (today.getMonth() + 1) + today.getDate() + today.getHours();
}

module.exports = generateDatePattern;