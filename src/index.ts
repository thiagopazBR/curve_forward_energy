import 'dotenv/config'

import * as path from 'path'

import { args_validation } from './functions/args_validation'
import { logger } from './functions/logger'

const a = 'teste curve'
console.log(a)

console.log(process.env.USERNAME)
console.log(process.env.PASSWORD)
console.log(path.basename(__dirname))

logger.info(`xxxx.csv file exists`)
logger.warn(`xxxx.csv missing column`)
logger.error(`xxxx.csv file does not exists`)

const args = args_validation(process.argv.slice(2))
console.log(args.start_date)
