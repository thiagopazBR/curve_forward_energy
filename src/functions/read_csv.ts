import parser from 'csv-parser'
import { createReadStream } from 'fs'

type ICsvData = {
  [key: string]: string
}

async function read_csv(csv_file_path: string): Promise<ICsvData[]> {
  const data: ICsvData[] = []
  return new Promise((resolve, reject) => {
    createReadStream(csv_file_path)
      .pipe(parser())
      .on('data', function (row) {
        data.push(row)
      })
      .on('end', function () {
        resolve(data)
      })
      .on('error', function (err) {
        reject(err)
      })
  })
}

export { read_csv }
