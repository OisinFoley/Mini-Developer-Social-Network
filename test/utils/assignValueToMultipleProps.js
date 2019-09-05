export const assignValueToManyObjectProps = (obj, propsArray, value) => {
  propsArray.forEach(prop => {
    obj[prop] = value;
  });
};