// import gcd from '../gcd'
// const lcm = (a: number, b: number): number => {
//   return (a * b) / gcd(a, b)
// }
// console.log('我被打包进去了, lcm')
// export default lcm

import React from 'react';

const hello = (target: typeof Test) => {
  console.log('hello');
  return target;
};

@hello
class Test extends React.PureComponent<Record<string, unknown>, Record<string, unknown>> {
  constructor(props: Record<string, unknown>) {
    super(props);
  }
  render(): React.ReactNode {
    return <div>hello, world</div>;
  }
}
export default Test;
