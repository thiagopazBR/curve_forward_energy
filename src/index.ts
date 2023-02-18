import 'dotenv/config'

import { createObjectCsvWriter } from 'csv-writer'
import * as fs from 'fs'
import moment from 'moment'
import { join } from 'path'

import { args_validation } from './functions/args_validation'
import * as date_validation from './functions/date_validation'
import { logger } from './functions/logger'
import { sharepoint_upload } from './functions/sharepoint'
import current_calc from './functions/sla/current'
import curve_forward_energy_calc from './functions/sla/curve_forward_energy'
import voltage_calc from './functions/sla/voltage'
import whitelist_status from './functions/sla/whitelist'
import { ICsvRecords } from './interfaces/ICsvRecords'
import { IMainResult } from './interfaces/IMainResult'

process.on('uncaughtException', err => {
  if (err.stack !== undefined) logger.error(err.stack, () => process.exit(1))
  else logger.error(`${err.name}: ${err.message}`, () => process.exit(1))
})

const args = args_validation(process.argv.slice(2))
const day: string = args.day
const yesterday: string = moment().subtract(1, 'days').format('YYYY-MM-DD')

date_validation.check_date_format(day)
date_validation.check_if_date_is_greater_than(day, yesterday)

const main_result: IMainResult = {}

const insert_meterno_in_main_result = (obj: { [key: string]: string }) => {
  for (const key of Object.keys(obj))
    main_result[key] = {
      curve_forward_energy: 0.0,
      current: 0.0,
      status: '',
      voltage: 0.0
    }
}

const insert_values_in_main_result = (
  column: string,
  obj: { [key: string]: string }
) => {
  for (const [key, value] of Object.entries(obj))
    if (column == 'curve_forward_energy')
      main_result[key]['curve_forward_energy'] = Number(value)
    else if (column == 'voltage') main_result[key]['voltage'] = Number(value)
    else if (column == 'current') main_result[key]['current'] = Number(value)
    else if (column == 'status') main_result[key]['status'] = value
}

;(async () => {
  const curve_forward_energy = await curve_forward_energy_calc(day)
  insert_meterno_in_main_result(curve_forward_energy)

  const voltage = await voltage_calc(day)
  insert_meterno_in_main_result(voltage)

  const current = await current_calc(day)
  insert_meterno_in_main_result(current)

  const whitelist = await whitelist_status(day)
  insert_meterno_in_main_result(whitelist)

  insert_values_in_main_result('curve_forward_energy', curve_forward_energy)
  insert_values_in_main_result('voltage', voltage)
  insert_values_in_main_result('current', current)
  insert_values_in_main_result('status', whitelist)

  const sla_result_file = process.env['CSV_SLA_FILE_NAME']!.replace(
    'YYYY-MM-DD',
    day
  )

  const csvWriter = createObjectCsvWriter({
    header: [
      { id: 'curve_forward_energy', title: 'Curve_Forward_Energy' },
      { id: 'current', title: 'Current' },
      { id: 'date', title: 'Date' },
      { id: 'meterno', title: 'Name' },
      { id: 'status', title: 'Status' },
      { id: 'voltage', title: 'Voltage' }
    ],
    path: sla_result_file
  })

  const records: Array<ICsvRecords> = []

  for (const [key, value] of Object.entries(main_result))
    records.push({
      date: day,
      meterno: key,
      curve_forward_energy: value.curve_forward_energy,
      voltage: value.voltage,
      current: value.current,
      status: value.status
    })

  if (!fs.existsSync(sla_result_file))
    fs.closeSync(fs.openSync(sla_result_file, 'w'))

  csvWriter
    .writeRecords(records) // returns a promise
    .then(() => {
      console.log('...Done')
    })
    .then(() => {
      sharepoint_upload(
        sla_result_file!,
        join(
          process.env.SHAREPOINT_CEMIG_SLA_ROOT_FOLDER!,
          process.env.SHAREPOINT_CEMIG_SLA_RESULT_FOLDER!
        ),
        sla_result_file
      )
    })
})()
