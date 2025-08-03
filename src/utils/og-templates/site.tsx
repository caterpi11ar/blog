import { SITE } from '@config'

export default () => {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: '#fefbfb',
      }}
    >
      <div
        className="absolute flex justify-center"
        style={{
          top: '-1px',
          right: '-1px',
          border: '4px solid #000',
          background: '#ecebeb',
          opacity: '0.9',
          borderRadius: '4px',
          margin: '2.5rem',
          width: '88%',
          height: '80%',
        }}
      />

      <div
        className="flex justify-center"
        style={{
          border: '4px solid #000',
          background: '#fefbfb',
          borderRadius: '4px',
          margin: '2rem',
          width: '88%',
          height: '80%',
        }}
      >
        <div
          className="flex flex-col justify-between"
          style={{
            margin: '20px',
            width: '90%',
            height: '90%',
          }}
        >
          <div
            className="flex flex-col justify-between items-center overflow-hidden text-center"
            style={{
              height: '90%',
              maxHeight: '90%',
            }}
          >
            <p style={{ fontSize: 72, fontWeight: 'bold' }}>{SITE.title}</p>
            <p style={{ fontSize: 28 }}>{SITE.desc}</p>
          </div>

          <div
            className="flex justify-end w-full mb-2"
            style={{
              fontSize: 28,
            }}
          >
            <span className="overflow-hidden font-bold">
              {new URL(SITE.website).hostname}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
