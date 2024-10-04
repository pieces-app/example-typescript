import { useState } from 'react';
import { addSecretKey } from '../utils/sensitiveApi';

const SecretKeyForm = () => {
  const [keyName, setKeyName] = useState('');
  const [keyValue, setKeyValue] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await addSecretKey({ keyName, keyValue });
    setKeyName('');
    setKeyValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="secret-form">
      <h3>Add a Secret Key</h3>
      <input
        type="text"
        placeholder="Key Name"
        value={keyName}
        onChange={(e) => setKeyName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Key Value"
        value={keyValue}
        onChange={(e) => setKeyValue(e.target.value)}
        required
      />
      <button type="submit">Add Secret</button>
    </form>
  );
};

export default SecretKeyForm;
