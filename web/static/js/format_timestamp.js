function formatTimestamp(timestamp) {
  let date = new Date(timestamp);
  return date.toLocaleTimeString();
}

export default formatTimestamp;
