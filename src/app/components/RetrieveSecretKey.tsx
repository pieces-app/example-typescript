import { useState } from 'react';
import { getSecretKey } from '../utils/sensitiveApi';

const RetrieveSecretKey = () => {
  const [retrievedKey, setRetrievedKey] = useState('');
  const [keyName, setKeyName] = useState('');

  const handleRetrieve = async (event: React.FormEvent) => {
    event.preventDefault();
    const secret = await getSecretKey(keyName);
    setRetrievedKey(secret || 'Secret not found');
  };

  return (
    <div>
      <h3>Retrieve a Secret Key</h3>
      <form onSubmit={handleRetrieve}>
        <input
          type="text"
          placeholder="Enter Key Name"
          value={keyName}
          onChange={(e) => setKeyName(e.target.value)}
          required
        />
        <button type="submit">Retrieve Secret</button>
      </form>
      {retrievedKey && <p>Secret: {retrievedKey}</p>}
    </div>
  );
};

export default RetrieveSecretKey;
