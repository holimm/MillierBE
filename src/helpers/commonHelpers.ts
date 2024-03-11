export const generateUUIDToken = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const NumberToDollarFormat = (number: number | undefined) => {
  let usd;
  if (number !== undefined)
    usd = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  return usd;
};
