export const sessionstorageGet = ({key}) => {
  const item = sessionStorage.getItem(key);
  return item;
}