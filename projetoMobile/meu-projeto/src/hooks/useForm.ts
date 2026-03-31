import { useState } from 'react';

export const useForm = (initialValues: any) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (name: string, value: string) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const resetForm = () => setValues(initialValues);

  return { values, handleChange, resetForm };
};