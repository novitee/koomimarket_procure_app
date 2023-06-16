import useMutation from 'libs/swr/useMutation';
import {validatePostalCode} from 'utils/validate';
import {useEffect, useState} from 'react';

export default function usePostalCode() {
  const [values, setValues] = useState({
    postalCode: '',
    address: '',
  });
  const {postalCode} = values;
  const [{loading}, postalCodeVerify] = useMutation({
    url: `postalCodes/${postalCode}/verify`,
  });

  useEffect(() => {
    async function verifyPostalCode() {
      const {data, success} = await postalCodeVerify();
      if (success) {
        setValues({...values, address: data.postalCode?.address});
      }
    }
    if (validatePostalCode(postalCode)) {
      verifyPostalCode();
    } else {
      setValues({...values, address: ''});
    }
  }, [postalCode]);

  function handlePostalCodeChange(value: string) {
    setValues({...values, postalCode: value});
  }
  return {
    loading,
    values,
    handlePostalCodeChange,
  };
}
