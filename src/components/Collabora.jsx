import React from 'react'
import './App.css';
import ServerAddressForm from './ServerAddressForm';
import LoaderForm from './LoaderForm';

const Collabora = () => {
const [serverAddress, setServerAddress] = useState('');
  const [startLoading, setStartLoading] = useState(false);
  const [wopiUrl, setWopiUrl] = useState('');
  const [token, setToken] = useState('');

  const handleInputChanged = (address) => {
    setServerAddress(address);
  };

  const handleSubmit = () => {
    const locationOrigin = window.location.origin;
    const scheme = locationOrigin.startsWith('https') ? 'https' : 'http';
    console.log(`locationOrigin: ${locationOrigin}, scheme: ${scheme}`);

    const wopiClientHost = serverAddress;
    if (!wopiClientHost) {
      alert('No server address entered');
      return;
    }
    if (!wopiClientHost.startsWith('http')) {
      alert('Warning! You have to specify the scheme protocol too (http|https) for the server address.');
      return;
    }
    if (!wopiClientHost.startsWith(scheme + '://')) {
      alert('Collabora Online server address scheme does not match the current page url scheme');
      return;
    }

    // const wopiSrc = `${locationOrigin}/wopi/files/1`;
    const wopiSrc = 'https://collabora-backend.b2yinfy.com/wopi/files/TMS_Manual2.docx'
    console.log(`wopiSrc: ${wopiSrc}`);

    fetch(`https://collabora-backend.b2yinfy.com/collaboraUrl?server=${wopiClientHost}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const wopiClientUrl = data.url;
        const accessToken = data.token;
        const wopiUrl = `${wopiClientUrl}WOPISrc=${wopiSrc}`;
        console.log(`wopiUrl: ${wopiUrl}`);

        setWopiUrl(wopiUrl);
        setToken(accessToken);
        setStartLoading(true);
      });
  };

  useEffect(() => {
    if (startLoading) {
      // Reset after one render so LoaderForm runs once
      setStartLoading(false);
    }
  }, [startLoading]);

  return (
    <div className="App">
      <ServerAddressForm
        address={serverAddress}
        onChange={handleInputChanged}
        onSubmit={handleSubmit}
      />
      {startLoading && <LoaderForm url={wopiUrl} token={token} />}
      <iframe
        title="Collabora Online Viewer"
        id="collabora-online-viewer"
        name="collabora-online-viewer"
        allow="clipboard-read *; clipboard-write *; fullscreen *"
      />
    </div>
  );
}

export default Collabora