import {setState} from 'stores/app';

export async function saveAuthData({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) {
  setState({authToken: token, authRefreshToken: refreshToken});
}

export async function resetAuthData() {
  setState({
    authToken: '',
    authRefreshToken: '',
    authStatus: 'NOT_AUTH',
    authRegisterType: '',
  });
}
