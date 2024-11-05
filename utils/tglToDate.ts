export default function dateIndo (datePukul: String) {
  let date = datePukul.replace(/Pukul/g, '')
  date = date.replace('Januari', 'January')
  date = date.replace('Februari', 'February')
  date = date.replace('Maret', 'March')
  date = date.replace('Mei', 'May')
  date = date.replace('Juni', 'June')
  date = date.replace('Juli', 'July')
  date = date.replace('Agustus', 'August')
  date = date.replace('Oktober', 'October')
  date = date.replace('Desember', 'December')
  return date
}