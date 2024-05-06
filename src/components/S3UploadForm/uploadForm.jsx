"use client";
import { useEffect } from "react";
import { uploadFile } from "./action";
import { useFormState } from "react-dom";

import SubmitButton from "@/components/S3UploadForm/SubmitButton";

const initialState = { data: [], message: null };
const UploadForm = ({ setFiles }) => {
  const [state, formAction] = useFormState(uploadFile, initialState);
  useEffect(
    () =>
      setFiles(Array.isArray(state.data) ? state.data : JSON.parse(state.data)),
    [state]
  );
  return (
    <>
      <form action={formAction}>
        <input type="file" id="file" name="file" accept="images/*" multiple />
        <SubmitButton />
      </form>
    </>
  );
};

export default UploadForm;
