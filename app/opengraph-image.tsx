import { ImageResponse } from 'next/og';

export const alt = 'Infinite Monkey Lab';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const Image = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          color: '#0f6',
          fontSize: 72,
        }}
      >
        Infinite Monkey LAB
      </div>
    ),
    { ...size }
  );
};

export default Image;
