// src/typings/index.d.ts

type CSSModuleClasses = { readonly [key: string]: string }

declare module '*.module.less' {
  const classes: CSSModuleClasses
  export default classes
}

declare module '*.less' {
  const classes: CSSModuleClasses
  export default classes
}
