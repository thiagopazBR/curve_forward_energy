interface IMainResult {
  [key: string]: {
    curve_forward_energy: number
    voltage: number
    current: number
    status: string
  }
}

export { IMainResult }
