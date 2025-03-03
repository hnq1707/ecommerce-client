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
      {pending ? 'Updating...' : 'Update'}
    </Button>
  );
};

export default UpdateButton;
