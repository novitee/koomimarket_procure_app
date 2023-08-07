import axios from 'libs/axios';
import {getState} from 'stores/app';
import {BareFetcher} from 'swr';
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader,
} from 'swr/infinite';

const fetcher = async (request: string, params: any) => {
  const authToken = getState().authToken || '';
  const authRefreshToken = getState().authRefreshToken || '';

  const result = await axios({authToken, authRefreshToken}).get(request, {
    params,
  });

  const {data} = result || {};
  return data?.data;
};

export default function useQueryInfinite<T>(
  getKey: SWRInfiniteKeyLoader,
  config?: SWRInfiniteConfiguration<T, Error, BareFetcher<T>> | undefined,
) {
  return useSWRInfinite(getKey, fetcher, {
    ...config,
    onErrorRetry: () => {},
  });
}
