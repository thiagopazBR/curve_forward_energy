import { rmSync } from 'fs'
import { join } from 'path'

import { read_csv } from '../read_csv'
import { sharepoint_download } from '../sharepoint'

export default async function whitelist_status(day: string) {
  /* Renaming file w/ requested day */
  const csv_file_name = process.env['CSV_WHITELIST_FILE_NAME'].replace(
    'YYYY-MM-DD',
    day
  )

  /* Download file from sharepoint */
  await sharepoint_download(
    csv_file_name,
    process.env.SHAREPOINT_CEMIG_WHITELIST_FOLDER
  )

  /* Get csv content */
  const csv_content = await read_csv(
    join(process.env.CSV_FILE_DIR, csv_file_name)
  )

  /* Remove file from system */
  rmSync(join(process.env.CSV_FILE_DIR, csv_file_name))

  /*
   * Filter starts below
   */

  /* { Meterno: "Running", Meterno: "Warehousing", etc...  } */
  const result: { [key: string]: string } = {}

  let i: number = csv_content.length
  while (i--) {
    const row = csv_content[i]
    const meter_no: string = row['METER_ID']
    const meter_status: string = row['METER_STATUS']

    // Checking if its HAA, HPA, HHA
    const meter_type = meter_no.slice(0, 3)

    switch (meter_type) {
      case process.env.ONE_PHASE_METER:
      case process.env.TWO_PHASE_METER:
      case process.env.THREE_PHASE_METER:
        result[meter_no] = meter_status
        break
      default:
        break
    }
  }

  return Promise.resolve(result)
}
