import axios from 'libs/axios';
import {getState} from 'stores/app';
import useSWR, {Key, SWRConfiguration} from 'swr';

async function fetcher(
  request: string,
  params: any,
  returnOriginalData: boolean,
  skip: boolean,
) {
  if (skip) {
    return;
  }

  const authToken = getState().authToken || '';
  const authRefreshToken = getState().authRefreshToken || '';

  const result = await axios({authToken, authRefreshToken}).get(request, {
    params,
  });

  if (returnOriginalData) {
    return result;
  }

  return result.data;
}

interface QueryConfig extends SWRConfiguration {
  fallbackData?: any;
  returnOriginalData?: boolean;
  immutable?: boolean;
  skip?: boolean;
}

export default function useQuery(
  requestKey: Key,
  {
    fallbackData,
    immutable = false,
    returnOriginalData = false,
    skip,
    ...config
  }: QueryConfig = {},
) {
  return useSWR(
    requestKey,
    (request: Key) => {
      if (Array.isArray(request)) {
        const [requestStr, params] = request;
        return fetcher(requestStr, params, returnOriginalData, skip);
      } else {
        return fetcher(request as string, {}, returnOriginalData, skip);
      }
    },
    {
      ...config,
      ...(immutable
        ? {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
          }
        : {}),
      fallbackData: fallbackData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: fallbackData,
      },
      onErrorRetry: () => {},
    },
  );
}
