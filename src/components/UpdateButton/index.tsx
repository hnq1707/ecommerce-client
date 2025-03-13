'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';

const UpdateButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      className=" rounded-md cursor-pointer disabled:bg-pink-200 disabled:cursor-not-allowed max-w-96"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            ></path>
          </svg>
          Updating...
        </>
      ) : (
        'Update'
      )}
    </Button>
  );
};

export default UpdateButton;
