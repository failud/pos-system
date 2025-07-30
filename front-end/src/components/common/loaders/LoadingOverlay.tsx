import React from 'react';
import BoxLoading from './BoxLoading';

interface LoadingOverlayProps {
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  size?: number;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  color = '#301B52',
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  opacity = 0.9,
  size = 80,
  message = "Loading...",
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: backgroundColor,
        opacity: opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <BoxLoading 
          width={size} 
          height={size} 
          color={color} 
        />
      </div>
      
      {message && (
        <p 
          style={{
            color: color,
            fontSize: '1.2rem',
            fontWeight: 500,
            marginTop: '20px',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingOverlay;