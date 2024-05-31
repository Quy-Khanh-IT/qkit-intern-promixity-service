import { Html, useProgress } from '@react-three/drei'

const CanvasLoader = (): React.ReactNode => {
  const { progress } = useProgress()
  return (
    <Html
      as='div'
      center
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)' // Màu nền loader, có thể thay đổi
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: '#F1F1F1',
          fontWeight: 800,
          marginTop: 40
        }}
      >
        {progress.toFixed(2)}%
      </p>
    </Html>
  )
}

export default CanvasLoader
