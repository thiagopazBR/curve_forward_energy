declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SHAREPOINT_URL: string
      SHAREPOINT_USERNAME: string
      SHAREPOINT_PASSWORD: string
      SHAREPOINT_SITE: string
      SHAREPOINT_CEMIG_SLA_ROOT_FOLDER: string
      SHAREPOINT_CEMIG_SLA_RESULT_FOLDER: string
      SHAREPOINT_CEMIG_CURVE_FORWARD_ENERGY_FOLDER: string
      SHAREPOINT_CEMIG_VOLTAGE_FOLDER: string
      SHAREPOINT_CEMIG_CURRENT_FOLDER: string
      SHAREPOINT_CEMIG_WHITELIST_FOLDER: string
      CSV_FILE_DIR: string
      CSV_CURVE_FORWARD_ENERGY_FILE_NAME: string
      CSV_VOLTAGE_FILE_NAME: string
      CSV_CURRENT_FILE_NAME: string
      CSV_WHITELIST_FILE_NAME: string
      CSV_SLA_FILE_NAME: string
      ONE_PHASE_METER: string
      TWO_PHASE_METER: string
      THREE_PHASE_METER: string
      LOG_DIR: string
      LOG_FILE_NAME: string
    }
  }
}
export {}
