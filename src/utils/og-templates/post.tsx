import type { CollectionEntry } from 'astro:content'
import { SITE } from '@config'

export default (post: CollectionEntry<'blog'>) => {
  return (
    <div
      style={{
        background: '#fefbfb',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="absolute flex justify-center"
        style={{
          position: 'absolute',
          top: '-1px',
          right: '-1px',
          border: '4px solid #000',
          background: '#ecebeb',
          opacity: '0.9',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
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
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem',
          width: '88%',
          height: '80%',
        }}
      >
        <div
          className="flex-col flex justify-between"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            margin: '20px',
            width: '90%',
            height: '90%',
          }}
        >
          <p
            className="overflow-hidden font-bold"
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              maxHeight: '84%',
              overflow: 'hidden',
            }}
          >
            {post.data.title}
          </p>
          <div
            className="flex justify-between w-full mb-2"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '8px',
              fontSize: 28,
            }}
          >
            <span>
              by
              {' '}
              <span
                style={{
                  color: 'transparent',
                }}
              >
                "
              </span>
              <span style={{ overflow: 'hidden', fontWeight: 'bold' }}>
                {post.data.author}
              </span>
            </span>

            <span style={{ overflow: 'hidden', fontWeight: 'bold' }}>
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
