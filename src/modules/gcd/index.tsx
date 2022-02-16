type FnGcd = (a: number, b: number) => number

const gcd: FnGcd = (a, b) => {
  if (a % b === 0) return b
  else return gcd(b, a % b)
}
console.log('我被打包进去了, gcd')
export default gcd
