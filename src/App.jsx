// import React, { useState, useEffect } from 'react';
// import './App.css';
// import ServerAddressForm from './ServerAddressForm';
// import LoaderForm from './LoaderForm';

// const App = () => {
//   const [serverAddress, setServerAddress] = useState('');
//   const [startLoading, setStartLoading] = useState(false);
//   const [wopiUrl, setWopiUrl] = useState('');
//   const [token, setToken] = useState('');

//   const handleInputChanged = (address) => {
//     setServerAddress(address);
//   };

//   const handleSubmit = () => {
//     const locationOrigin = window.location.origin;
//     const scheme = locationOrigin.startsWith('https') ? 'https' : 'http';
//     console.log(`locationOrigin: ${locationOrigin}, scheme: ${scheme}`);

//     const wopiClientHost = serverAddress;
//     if (!wopiClientHost) {
//       alert('No server address entered');
//       return;
//     }
//     if (!wopiClientHost.startsWith('http')) {
//       alert('Warning! You have to specify the scheme protocol too (http|https) for the server address.');
//       return;
//     }
//     if (!wopiClientHost.startsWith(scheme + '://')) {
//       alert('Collabora Online server address scheme does not match the current page url scheme');
//       return;
//     }

//     // const wopiSrc = `${locationOrigin}/wopi/files/1`;
//     const wopiSrc = 'https://collabora-backend.b2yinfy.com/wopi/files/sample.docx'
//     console.log(`wopiSrc: ${wopiSrc}`);

//     fetch(`https://collabora-backend.b2yinfy.com/collaboraUrl?server=${wopiClientHost}`)
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data);
//         const wopiClientUrl = data.url;
//         const accessToken = data.token;
//         const wopiUrl = `${wopiClientUrl}WOPISrc=${wopiSrc}`;
//         console.log(`wopiUrl: ${wopiUrl}`);

//         setWopiUrl(wopiUrl);
//         setToken(accessToken);
//         setStartLoading(true);
//       });
//   };

//   useEffect(() => {
//     if (startLoading) {
//       // Reset after one render so LoaderForm runs once
//       setStartLoading(false);
//     }
//   }, [startLoading]);

//   return (
//     <div className="App">
//       <ServerAddressForm
//         address={serverAddress}
//         onChange={handleInputChanged}
//         onSubmit={handleSubmit}
//       />
//       {startLoading && <LoaderForm url={wopiUrl} token={token} />}
//       <iframe
//         title="Collabora Online Viewer"
//         id="collabora-online-viewer"
//         name="collabora-online-viewer"
//         allow="clipboard-read *; clipboard-write *; fullscreen *"
//       />
//     </div>
//   );
// };

// export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import ServerAddressForm from './ServerAddressForm';
import LoaderForm from './LoaderForm';

const App = () => {
  const [serverAddress, setServerAddress] = useState('');
  const [wopiUrl, setWopiUrl] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChanged = (address) => {
    setServerAddress(address);
    setError(null); // Clear error on input change
  };

  const handleSubmit = async () => {
    try {
      const locationOrigin = window.location.origin;
      const scheme = locationOrigin.startsWith('https') ? 'https' : 'http';

      if (!serverAddress) {
        setError('Please enter a server address.');
        return;
      }

      if (!serverAddress.match(/^https?:\/\//)) {
        setError('Server address must include http:// or https://.');
        return;
      }

      if (!serverAddress.startsWith(`${scheme}://`)) {
        setError('Server address scheme must match the current page scheme.');
        return;
      }

      setIsLoading(true);
      setError(null);

      // Configurable WOPI source (e.g., passed via props or state)
      const wopiSrc = 'https://collabora-backend.b2yinfy.com/wopi/files/sample.docx';

      const response = await fetch(
        `https://collabora-backend.b2yinfy.com/collaboraUrl?server=${encodeURIComponent(serverAddress)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch WOPI data: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data?.url || !data?.token) {
        throw new Error('Invalid response format from server.');
      }

      const wopiClientUrl = data.url;
      const accessToken = data.token;
      const constructedWopiUrl = `${wopiClientUrl}WOPISrc=${encodeURIComponent(wopiSrc)}`;

      setWopiUrl(constructedWopiUrl);
      setToken(accessToken);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the document.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset loading state only after successful iframe load (optional)
    if (wopiUrl && token) {
      // Optionally, listen for iframe load events to confirm successful rendering
      const iframe = document.getElementById('collabora-online-viewer');
      if (iframe) {
        iframe.onload = () => setIsLoading(false);
      }
    }
  }, [wopiUrl, token]);

  return (
    <div className="App">
      <ServerAddressForm
        address={serverAddress}
        onChange={handleInputChanged}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
      {error && <div className="error" role="alert">{error}</div>}
      {isLoading && <LoaderForm url={wopiUrl} token={token} />}
      <iframe
        title="Collabora Online Viewer"
        id="collabora-online-viewer"
        name="collabora-online-viewer"
        src={wopiUrl || undefined} // Set src directly if available
        allow="clipboard-read 'self' collabora.b2yinfy.com; clipboard-write 'self' collabora.b2yinfy.com; fullscreen 'self' collabora.b2yinfy.com"
        style={{ display: wopiUrl ? 'block' : 'none' }} // Hide iframe until src is set
      />
    </div>
  );
};

export default App;