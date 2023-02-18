import moment from 'moment'

export const check_date_format = (
  d: string,
  date_format = 'YYYY-MM-DD'
): boolean => {
  if (moment(d, date_format, true).isValid()) return true
  else throw new Error(`${d} Incorrect date format. It should be YYYY-MM-DD`)
}

/*eslint-disable @typescript-eslint/no-explicit-any */
export const check_if_date_is_greater_than = (d1: string, d2: string): any => {
  const _diff = moment(d2).diff(moment(d1), 'days')

  if (_diff >= 0) return true
  else throw new Error(`Day (${d1}) cannot be greater then yesterday (${d2})`)
}
