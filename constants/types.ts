interface Auth {
  expired_date: string,
  expires_in: number,
  token: string,
  type: string
}
interface ModalUpdateProfile {
  modelValue: boolean,
  idTicket: string
}
interface ModalDigitalSignature {
  modelValue: boolean,
  cdTicket: string,
  formType: string
}
interface ModalReDS {
  modelValue: boolean,
  cdTicket: string,
  formRequest: string,
  flowStageId: string
}

export {
  Auth,
  ModalUpdateProfile,
  ModalDigitalSignature,
  ModalReDS
}
