import React from 'react';

export const page = () => {
  // redirect to dashboard
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
  return <div>...</div>;
};
