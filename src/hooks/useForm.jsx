import {useState} from'react'
export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setError('');
    setSuccess('');
  };

  return {
    values,
    error,
    success,
    loading,
    setError,
    setSuccess,
    setLoading,
    handleChange,
    resetForm
  };
}