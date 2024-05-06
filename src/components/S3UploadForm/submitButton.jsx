"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="submit-button" aria-disabled={pending}>
      {pending ? "Uploading..." : "File Upload"}
    </button>
  );
}
