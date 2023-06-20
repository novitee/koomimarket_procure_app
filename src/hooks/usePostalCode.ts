import useMutation from 'libs/swr/useMutation';
import {validatePostalCode} from 'utils/validate';
export default function usePostalCode() {
  const [{loading}, postalCodeVerify] = useMutation({url: ''});

  async function handlePostalCodeChange(value: string) {
    if (!validatePostalCode(value)) return null;

    const {data, success} = await postalCodeVerify(
      {},
      {
        overrides: {
          url: `postalCodes/${value}/verify`,
        },
      },
    );
    if (success) {
      return data.postalCode?.address;
    }
    return null;
  }

  return {loading, handlePostalCodeChange};
}
