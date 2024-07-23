import * as React from 'react';

const Modal = ({  onClose, asset }) => {
  if (!asset) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ padding: 20, background: 'white', borderRadius: 5, width: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2>Snippet Details</h2>
        <p>ID: {asset.id}</p>
        <p>Name: {asset.name}</p>
        <p>Mechanism: {asset?.mechanism}</p>
        <p>Preview schema semantic: {asset.preview?.schema?.semantic}</p>
        <button onClick={onClose} style={{ marginTop: 20 }}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
