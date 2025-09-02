import React from 'react';

const ServerAddressForm = ({ address, onChange, onSubmit }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form action="" method="get" onSubmit={handleSubmit}>
      <label htmlFor="collabora-online-server">
        Collabora Online Server:
        <input
          id="collabora-online-server"
          type="text"
          value={address}
          onChange={handleChange}
        />
      </label>
      <input type="submit" value="Load Collabora Online" />
    </form>
  );
};

export default ServerAddressForm;
