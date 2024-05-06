import { uploadFile } from "./action";

import React, { useState, useEffect } from "react";
import SubmitButton from "@/components/S3UploadForm/submitButton";

const UploadForm = ({ setFiles, setUploading }) => {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setUploading(pending);
  }, [pending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    try {
      const formData = new FormData(event.target);
      const result = await uploadFile(formData);
      console.log(result);
      setFiles(
        Array.isArray(result.data) ? result.data : JSON.parse(result.data)
      ),
        setPending(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" id="file" name="file" accept="images/*" multiple />
      <SubmitButton pending={pending} />
    </form>
  );
};

export default UploadForm;

// import { useFormState } from "react-dom";

// import SubmitButton from "@/components/S3UploadForm/SubmitButton";

// const initialState = { data: [], message: null };
// const UploadForm = ({ setFiles }) => {
//   const [state, formAction] = useFormState(uploadFile, initialState);
//   useEffect(
//     () =>
//       setFiles(Array.isArray(state.data) ? state.data : JSON.parse(state.data)),
//     [state]
//   );
//   return (
//     <>
//       <form action={formAction}>
//         <input type="file" id="file" name="file" accept="images/*" multiple />
//         <SubmitButton />
//       </form>
//     </>
//   );
// };

// export default UploadForm;
