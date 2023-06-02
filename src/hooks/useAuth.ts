import {useGlobalStore} from 'stores/global';

export default function useAuth() {
  const authToken = useGlobalStore(state => state.authToken);
  return !!authToken;
}
