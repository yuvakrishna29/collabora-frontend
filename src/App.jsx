import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaFile, FaUpload, FaHistory, FaSearch, FaRegFilePdf, FaRegFileWord, FaRegFileExcel, FaRegFilePowerpoint, FaRegFileImage, FaFileAlt } from 'react-icons/fa';
import './App.css'; // Assuming you have the necessary CSS

const App = () => {
  const [activeCategory, setActiveCategory] = useState('Recommended');
  const [showCollabora, setShowCollabora] = useState(false); // State to toggle between static screen and Collabora
  const [startLoading, setStartLoading] = useState(false);
  const [wopiUrl, setWopiUrl] = useState('');
  const [token, setToken] = useState('');
  const fileInputRef = useRef(null);
  const [serverAddress, setServerAddress] = useState(''); // Default server address

  const recentFiles = [
    { id: 1, name: 'Annual Report', type: 'pdf', lastOpened: 'Yesterday at 10:34 PM' },
    { id: 2, name: 'Project Proposal', type: 'docx', lastOpened: '2 days ago' },
    { id: 3, name: 'Financial Data', type: 'xlsx', lastOpened: '3 days ago' },
    { id: 4, name: 'Presentation Deck', type: 'pptx', lastOpened: 'Last week' },
    { id: 5, name: 'Design Mockups', type: 'png', lastOpened: '2 weeks ago' },
    { id: 6, name: 'Research Notes', type: 'docx', lastOpened: '3 weeks ago' },
  ];

  const categories = ['Recommended', 'Letters', 'Invoices', 'Business documents', 'Events', 'Meetings'];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaRegFilePdf className="text-red-500" />;
      case 'docx': return <FaRegFileWord className="text-blue-500" />;
      case 'xlsx': return <FaRegFileExcel className="text-green-500" />;
      case 'pptx': return <FaRegFilePowerpoint className="text-orange-500" />;
      case 'png': return <FaRegFileImage className="text-purple-500" />;
      default: return <FaFile className="text-gray-500" />;
    }
  };

  const handleSubmit = (fileName = 'BlankDocument.docx') => {
    const locationOrigin = window.location.origin;
    const scheme = locationOrigin.startsWith('https') ? 'https' : 'http';
    console.log(`locationOrigin: ${locationOrigin}, scheme: ${scheme}`);

    // Hardcoded default server address
    const wopiClientHost = serverAddress;;
    
    // Validate scheme compatibility
    if (!wopiClientHost.startsWith(scheme + '://')) {
      alert('Collabora Online server address scheme does not match the current page URL scheme');
      return;
    }

    // Use a dynamic WOPI source based on the file or default for blank document
    const wopiSrc = 'https://collabora-backend.b2yinfy.com/wopi/files/TMS_Manual2.docx';
    console.log(`wopiSrc: ${wopiSrc}`);

    fetch(`https://collabora-backend.b2yinfy.com/collaboraUrl?server=${wopiClientHost}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const wopiClientUrl = data.url;
        const accessToken = data.token;
        const wopiUrl = `${wopiClientUrl}WOPISrc=${encodeURIComponent(wopiSrc)}`;
        console.log(`wopiUrl: ${wopiUrl}`);

        setWopiUrl(wopiUrl);
        setToken(accessToken);
        setStartLoading(true);
      })
      .catch((error) => {
        console.error('Error fetching Collabora URL:', error);
        alert('Failed to load Collabora editor. Please try again.');
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShowCollabora(true);
      setServerAddress('https://collabora.b2yinfy.com');
      console.log('Uploaded file:', file.name);
      handleSubmit(file.name);
    }
  };

  const handleCreateBlankDocument = () => {
    setShowCollabora(true);
    setServerAddress('https://collabora.b2yinfy.com');
    handleSubmit();
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleBackToStatic = () => {
    setShowCollabora(false); // Switch back to static screen
    setWopiUrl('');
    setToken('');
    setStartLoading(false);
  };

  useEffect(() => {
    if (startLoading) {
      // Reset after one render so LoaderForm runs once
      setStartLoading(false);
    }
  }, [startLoading]);

  console.log('App rendered'); // Debug log

  return (
    <div className="flex flex-col h-full">
      {showCollabora ? (
        <div className="App">
          <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <FaArrowLeft className="text-2xl mr-2 text-blue-500 cursor-pointer" onClick={handleBackToStatic} />
              <FaFileAlt className="text-2xl mr-2 text-blue-500" />
              <span className="text-xl font-bold">DocHub</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            {startLoading && <LoaderForm url={wopiUrl} token={token} />}
            <iframe
              title="Collabora Online Viewer"
              id="collabora-online-viewer"
              name="collabora-online-viewer"
              allow="clipboard-read *; clipboard-write *; fullscreen *"
              className="w-full h-[80vh]"
            />
          </main>
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <FaFileAlt className="text-2xl mr-2 text-blue-500" />
              <span className="text-xl font-bold">DocHub</span>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-y-auto">
            <section className="mb-8">
              <h1 className="text-2xl mb-4">Welcome!</h1>
              <div className="flex gap-6">
                <div
                  className="flex-1 p-6 bg-white border border-gray-200 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center flex-col"
                  onClick={handleCreateBlankDocument}
                >
                  <FaFile className="text-4xl mb-2 text-green-500" />
                  <h3 className="text-lg mb-2">Create Blank Document</h3>
                  <p className="text-gray-600">Start from scratch with a new document</p>
                </div>
                <div
                  className="flex-1 p-6 bg-white border border-gray-200 rounded-lg text-center cursor-pointer hover:shadow-md transition-shadow flex items-center justify-center flex-col"
                  onClick={handleUploadClick}
                >
                  <FaUpload className="text-4xl mb-2 text-blue-500" />
                  <h3 className ="Margot mb-2">Upload a File</h3>
                  <p className="text-gray-600">Upload existing documents from your device</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    accept=".docx,.doc,.pdf,.txt,.rtf,.png,.jpg,.jpeg"
                  />
                </div>
              </div>
            </section>
            <section className="mb-8">
              <h2 className="text-xl mb-2 flex items-center">
                <FaHistory className="mr-2 text-gray-500" />
                Jump back in
              </h2>
              <p className="text-gray-600 mb-2">You last opened documents yesterday at 10:34 PM</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer flex items-center hover:shadow-md transition-shadow"
                    onClick={() => {
                      setShowCollabora(true);
                      handleSubmit(file.name);
                    }}
                  >
                    {getFileIcon(file.type)}
                    <div className="ml-2">
                      <h3 className="text-base">{file.name}</h3>
                      <p className="text-sm text-gray-600">Last opened: {file.lastOpened}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl mb-2">Create with templates</h2>
              <div className="flex gap-2 mb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 border border-gray-200 rounded-lg ${
                      activeCategory === category ? 'bg-blue-500 text-white' : 'bg-white text-black'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex items-center border border-gray-200 rounded-lg p-2 w-48">
                <FaSearch className="mr-2 text-gray-500" />
                <input type="text" placeholder="Search templates" className="flex-1 outline-none" />
              </div>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

// LoaderForm Component
const LoaderForm = ({ url, token }) => {
  useEffect(() => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = 'collabora-online-viewer';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'access_token';
    input.value = token;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }, [url, token]);

  return null;
};

export default App;