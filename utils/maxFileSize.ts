function checkFileSize (fileSize: number) {
  const cookie = useCookie('max_upload_bytes')
  const maxUploadSize = cookie.value ? parseInt(cookie.value) : 5 * 1024 * 1024

  if (fileSize > maxUploadSize) {
    useNuxtApp().$toast.warn(`Ukuran file harus kurang dari ${maxUploadSize/1024/1024} MB`)
    return false
  }
  return true
}

export default checkFileSize
