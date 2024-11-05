export default function localeString (word: String) {
  switch (word.toLowerCase()) {
    case 'day':
      return 'hari'
      break;
    case 'hour':
      return 'jam'
      break;
    case 'minute':
      return 'menit'
      break;
    default:
      break;
  }
}