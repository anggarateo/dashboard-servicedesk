import versionDatetime from '~/constants/versionDatetime'

const {
  year,
  monthIndex,
  date,
  hours,
  minutes,
  seconds
} = versionDatetime

const sourceCodeVersion = new Date(
  year,
  monthIndex,
  date,
  hours,
  minutes,
  seconds
).toLocaleString('id-ID', {
  dateStyle: 'full',
  timeStyle: 'full'
})

export default sourceCodeVersion
