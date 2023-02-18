import { strict as assert } from 'assert'
import firstline from 'firstline'
import { readFileSync, rmSync } from 'fs'
import { join } from 'path'
import { Download, IAuthOptions } from 'sp-download'
import { spsave } from 'spsave'

assert(process.env.SHAREPOINT_URL, 'SHAREPOINT_URL is invalid or undefined')
assert(
  process.env.SHAREPOINT_USERNAME,
  'SHAREPOINT_USERNAME is invalid or undefined'
)
assert(
  process.env.SHAREPOINT_PASSWORD,
  'SHAREPOINT_PASSWORD is invalid or undefined'
)
assert(process.env.SHAREPOINT_SITE, 'SHAREPOINT_SITE is invalid or undefined')
assert(
  process.env.SHAREPOINT_CEMIG_SLA_ROOT_FOLDER,
  'SHAREPOINT_CEMIG_SLA_ROOT_FOLDER is invalid or undefined'
)
assert(
  process.env.SHAREPOINT_CEMIG_CURVE_FORWARD_ENERGY_FOLDER,
  'SHAREPOINT_CEMIG_CURVE_FORWARD_ENERGY_FOLDER is invalid or undefined'
)
assert(process.env.CSV_FILE_DIR, 'CSV_FILE_DIR is invalid or undefined')

export const sharepoint_download = async (
  file_name: string,
  folder: string
) => {
  const authContext: IAuthOptions = {
    username: process.env.SHAREPOINT_USERNAME,
    password: process.env.SHAREPOINT_PASSWORD,
    online: true
  }

  const download = new Download(authContext)

  const filePathToDownload = `${process.env.SHAREPOINT_URL}/sites/${process.env.SHAREPOINT_SITE}/${process.env.SHAREPOINT_CEMIG_SLA_ROOT_FOLDER}/${folder}/${file_name}`
  const saveToPath: string = process.env.CSV_FILE_DIR

  return new Promise(resolve => {
    download
      .downloadFile(filePathToDownload, saveToPath)
      .then(() => {
        firstline(join(process.env.CSV_FILE_DIR, file_name))
          .then(first_line => {
            if (
              first_line.startsWith('<?xml') &&
              first_line.includes('error')
            ) {
              rmSync(join(process.env.CSV_FILE_DIR, file_name))
              throw new Error(first_line)
            }
          })
          .then(() => {
            resolve(true)
          })
      })
      .catch(error => {
        throw new Error(error)
      })
  })
}

export const sharepoint_upload = async (
  file_name: string,
  sharepoint_folder: string,
  local_file_full_path: string
) => {
  const coreOptions = {
    siteUrl: `${process.env.SHAREPOINT_URL}/sites/${process.env.SHAREPOINT_SITE}`,
    notification: true,
    checkin: true,
    checkinType: 1
  }

  const creds = {
    username: process.env.SHAREPOINT_USERNAME,
    password: process.env.SHAREPOINT_PASSWORD
    // domain: '[domain (on premise)]'
  }

  const fileOptions = {
    folder: sharepoint_folder,
    fileName: file_name,
    fileContent: readFileSync(local_file_full_path)
  }

  return new Promise((resolve, reject) => {
    spsave(coreOptions, creds, fileOptions)
      .then(function () {
        resolve('saved')
      })
      .catch(error => {
        throw new Error(error)
      })
  })
}
