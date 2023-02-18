import { rmSync } from 'fs'
import { join } from 'path'

import { read_csv } from '../read_csv'
import { sharepoint_download } from '../sharepoint'

export default async function curve_forward_energy_calc(day: string) {
  /* Renaming file w/ requested day */
  const csv_file_name: string = process.env[
    'CSV_CURVE_FORWARD_ENERGY_FILE_NAME'
  ].replace('YYYY-MM-DD', day)

  /* Download file from sharepoint */
  await sharepoint_download(
    csv_file_name,
    process.env.SHAREPOINT_CEMIG_CURVE_FORWARD_ENERGY_FOLDER
  )

  /* Get csv content */
  const csv_content = await read_csv(
    join(process.env.CSV_FILE_DIR, csv_file_name)
  )

  /* Remove file from system */
  rmSync(join(process.env.CSV_FILE_DIR, csv_file_name))

  /*
   * Calculation starts below
   */

  /* { Meterno: 100.00%, Meterno: 75.00%, etc...  } */
  const result: { [key: string]: string } = {}

  /* { Meterno: 24, Meterno: 22, etc...  } */
  const counter: { [key: string]: number } = {}

  let i: number = csv_content.length
  while (i--) {
    const row = csv_content[i]
    const meter_no: string = row['Meter No.']
    const fa: string = row['Active energy(+) total(kWh)']
    // const data_time: string = row['Data Time']
    // const receive_time: string = row['Receive Time']

    // Checking if its HAA, HPA, HHA
    const meter_type = meter_no.slice(0, 3)

    switch (meter_type) {
      case process.env.ONE_PHASE_METER:
      case process.env.TWO_PHASE_METER:
      case process.env.THREE_PHASE_METER:
        if (fa && !isNaN(Number(fa)))
          if (isNaN(counter[meter_no])) counter[meter_no] = 1
          else counter[meter_no] = counter[meter_no] + 1

        break
      default:
        break
    }
  }

  for (const [key, value] of Object.entries(counter)) {
    const total: string = ((value / 24) * 100).toFixed(2)
    result[key] = total
  }

  return Promise.resolve(result)
}
