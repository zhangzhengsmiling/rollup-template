import * as React from 'react'

const Loading = (props: any) => {
  const boxWidth = 60
  const center = {
    cx: boxWidth / 2,
    cy: boxWidth / 2,
  }
  const outerR = (boxWidth * 0.8) / 2
  const innerR = outerR / 2
  const duration = 2000

  return (
    <div style={{ width: 'auto', height: 'auto' }}>
      <svg style={{ width: boxWidth, height: boxWidth }}>
        <circle
          r={outerR}
          stroke="rgb(59, 230, 203)"
          cx={center.cx}
          cy={center.cy}
          strokeWidth={3}
          fill="transparent"
          strokeDasharray={`${(Math.PI * outerR) / 2}, ${(Math.PI * outerR) / 2}`}
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur={`${duration}ms`}
            from={`0 ${center.cx} ${center.cy}`}
            to={`360 ${center.cx} ${center.cy}`}
            repeatCount="indefinite"
          />
        </circle>
        <circle
          r={innerR}
          stroke="rgb(2, 188, 254)"
          cx={center.cx}
          cy={center.cy}
          strokeWidth={3}
          fill="transparent"
          strokeDasharray={`${(Math.PI * innerR) / 2}, ${(Math.PI * innerR) / 2}`}
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur={`${duration}ms`}
            from={`360 ${center.cx} ${center.cy}`}
            to={`0 ${center.cx} ${center.cy}`}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  )
}

export default Loading
