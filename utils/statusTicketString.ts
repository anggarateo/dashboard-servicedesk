function statusTicketString (uuidStatusTicket: String) {
  let status
  switch (uuidStatusTicket) {
    // STATUS_OPEN | tiket baru
    case 'd147c874-f231-4320-b117-e49cc5c999fa':
      status = 'open'
      break;
    //  STATUS_PROGRESS | sedang ditangani
    case '00644976-9ef7-4c20-9e4a-3015052d542b':
      status = 'progress'
      break;
    // STATUS_REJECTED | ditolak
    case '087e9769-591c-4347-84cf-199466e7cdd2':
      status = 'rejected'
      break;
    // STATUS_RESOLVED | selesai
    case '9109b131-fe03-47bb-8a0c-98d3af7673e0':
      status = 'resolved'
      break;
    // STATUS_CLOSE | tutup
    case '811ac344-de01-491b-a6c3-fae39a3b0539':
      status = 'close'
      break;
    // STATUS_REOPEN | buka kembali
    case '12f8c9b1-718c-443d-af4b-5775316de8da':
      status = 're-open'
      break;
    // STATUS_REQOPEN | permintaan buka kembali
    case 'fb7010a8-507a-4881-b155-f8bea3e52e9f':
      status = 'req-open'
      break;
    default:
      break;
  }
  return status
}

export default statusTicketString
