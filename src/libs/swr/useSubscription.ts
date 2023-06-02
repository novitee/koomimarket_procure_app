import useSWRSubscription from 'swr/subscription';

import {useMemo} from 'react';
import {buildQueryString} from 'utils/format';
import ApiConfig from 'configs/apiConfig';

type UrlArray = [string, Record<string, string | string[]>];

interface Callbacks {
  onOpen?: () => void;
  onMessage?: (data: any) => void;
  onClose?: () => void;
}
const config = ApiConfig();

function convertToURI(arr: UrlArray): string {
  const url = arr[0];
  const params = arr[1];
  const queryParams = buildQueryString(params);
  return encodeURI(`${url}?${queryParams}`);
}

export default function useSubscription(
  url: string | UrlArray | undefined,
  callbacks?: Callbacks,
) {
  const key = useMemo(() => {
    if (url === undefined) {
      return url;
    }
    return typeof url === 'string' ? url : convertToURI(url);
  }, [url]);

  return useSWRSubscription(key, (_key, {next}) => {
    const socket = new WebSocket(`${config.WEBSOCKET_URL}${_key}`);
    socket.addEventListener('message', event => {
      const data = JSON.parse(event.data);
      callbacks?.onMessage && callbacks.onMessage(data);
      next(null, event.data);
    });
    socket.addEventListener('error', event => next(event));
    return () => socket.close();
  });
}
