import moment from 'moment'
import yargs from 'yargs/yargs'

import { IArgs } from '../interfaces/IArgs'

const check_args = (args: string[]): IArgs | Promise<IArgs> => {
  const argv = yargs(args)
    .options({
      day: {
        alias: 'd',
        default: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        describe: 'Start Date. Format "YYYY-MM-DD"',
        type: 'string'
        /* Uncomment option below to turn it required
         * demandOption: true,
         */
      }
    })
    .example([
      ['$0 --target "curve_forward_energy" --day "YYYY-MM-DD"']
      // [
      //   '$0 --target "commissioning_report" --start_date "YYYY-MM-DD" --end_date "YYYY-MM-DD"',
      //   'For a date range. end_date cannot be greater than start date'
      // ]
    ]).argv

  return argv
}

const args_validation = (args: string[]) => {
  const output = check_args(args) as IArgs
  return output
}

export { args_validation }
