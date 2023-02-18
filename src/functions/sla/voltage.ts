import { rmSync } from 'fs'
import { join } from 'path'

import { read_csv } from '../read_csv'
import { sharepoint_download } from '../sharepoint'

export default async function voltage_calc(day: string) {
  /* Renaming file w/ requested day */
  const csv_file_name: string = process.env['CSV_VOLTAGE_FILE_NAME'].replace(
    'YYYY-MM-DD',
    day
  )

  /* Download file from sharepoint */
  await sharepoint_download(
    csv_file_name,
    process.env.SHAREPOINT_CEMIG_VOLTAGE_FOLDER
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
    const UL_1 = row['Voltage in phase L1(V)']
    const UL_2 = row['Voltage in phase L2(V)']
    const UL_3 = row['Voltage in phase L3(V)']
    // const data_time: string = row['Data Time']
    // const receive_time: string = row['Receive Time']

    // Checking if its HAA, HPA, HHA
    const meter_type = meter_no.slice(0, 3)

    if (
      [
        process.env.ONE_PHASE_METER,
        process.env.TWO_PHASE_METER,
        process.env.THREE_PHASE_METER
      ].includes(meter_type)
    )
      if (UL_1 && !isNaN(Number(UL_1)))
        if (isNaN(counter[meter_no])) counter[meter_no] = 1
        else counter[meter_no] = counter[meter_no] + 1

    if (
      [process.env.TWO_PHASE_METER, process.env.THREE_PHASE_METER].includes(
        meter_type
      )
    )
      if (UL_2 && !isNaN(Number(UL_2)))
        if (isNaN(counter[meter_no])) counter[meter_no] = 1
        else counter[meter_no] = counter[meter_no] + 1

    if ([process.env.THREE_PHASE_METER].includes(meter_type))
      if (UL_3 && !isNaN(Number(UL_3)))
        if (isNaN(counter[meter_no])) counter[meter_no] = 1
        else counter[meter_no] = counter[meter_no] + 1
  }

  for (const [key, value] of Object.entries(counter)) {
    // Checking if its HAA, HPA, HHA
    const meter_type = key.slice(0, 3)

    // Expect packets to receive per day
    let expected_per_day = 24

    if (meter_type == process.env.ONE_PHASE_METER) expected_per_day = 24
    else if (meter_type == process.env.TWO_PHASE_METER) expected_per_day = 48
    else if (meter_type == process.env.THREE_PHASE_METER) expected_per_day = 72

    const total: string = ((value / expected_per_day) * 100).toFixed(2)
    result[key] = total
  }

  return Promise.resolve(result)
}
