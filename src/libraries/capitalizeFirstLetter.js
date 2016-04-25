export default function  capitalizeFirstLetter(string) {
  return string ? string[0].toUpperCase() + string.slice(1) : null;
}
