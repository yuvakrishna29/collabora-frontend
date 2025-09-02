import React, { useEffect, useRef } from 'react';

const LoaderForm = ({ url, token }) => {
  const formElem = useRef(null);

  useEffect(() => {
    if (formElem.current) {
      formElem.current.submit();
    }
  }, []);

  return (
    <div style={{ display: "none" }}>
      <form
        ref={formElem}
        action={url}
        encType="multipart/form-data"
        method="post"
        target="collabora-online-viewer"
        id="collabora-submit-form"
      >
        <input
          name="access_token"
          value={token}
          type="hidden"
          id="access-token"
        />
        <input type="submit" value="" />
      </form>
    </div>
  );
};

export default LoaderForm;
