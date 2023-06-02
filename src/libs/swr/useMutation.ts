import axios from 'libs/axios';
import {useReducer} from 'react';
import {getState} from 'stores/app';

const REQUEST_START = 'REQUEST_START';
const REQUEST_SUCCESS = 'REQUEST_SUCCESS';
const REQUEST_FAIL = 'REQUEST_FAIL';

interface MutationProps {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  onSuccess?: (response: any) => void;
  onError?: (response: any) => void;
}

type MutateOpts = {
  overrides: {
    url?: string;
  };
  useFormData?: boolean;
};

function useMutation({
  method = 'POST',
  url,
  onSuccess,
  onError,
}: MutationProps) {
  const [state, dispatch] = useReducer(reducer, {
    success: false,
    data: null,
    loading: false,
    error: null,
    message: null,
  });

  function reducer(state: any, action: any) {
    switch (action.type) {
      case REQUEST_START:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case REQUEST_SUCCESS:
        return {
          ...state,
          success: true,
          loading: false,
          data: action.payload,
          message: action.message,
        };
      case REQUEST_FAIL:
        return {
          ...state,
          success: false,
          loading: false,
          error: action.payload,
          message: action.message,
        };
    }
  }

  async function mutate(
    params: any,
    opts: MutateOpts = {
      overrides: {
        url: '',
      },
      useFormData: false,
    },
  ) {
    const overrideUrl = opts.overrides?.url;
    const authToken = getState().authToken || '';
    const authRefreshToken = getState().authRefreshToken || '';
    try {
      dispatch({type: REQUEST_START});

      let dataParams = params;
      if (opts.useFormData && params) {
        const formData = new FormData();
        Object.keys(params).forEach(key => formData.append(key, params[key]));
        dataParams = formData;
      }

      const resp = (await axios({authToken, authRefreshToken}).request({
        method: method,
        url: overrideUrl ? overrideUrl : url,
        data: dataParams,
        headers: {
          'Content-Type': opts.useFormData
            ? 'multipart/form-data'
            : 'application/json',
        },
      })) as any;
      if (!resp.success) {
        throw resp;
      }
      dispatch({
        type: REQUEST_SUCCESS,
        payload: resp?.data,
      });

      if (typeof onSuccess === 'function') {
        onSuccess(resp);
      }
      return {
        success: true,
        ...resp,
      };
    } catch (error: any) {
      dispatch({
        type: REQUEST_FAIL,
        payload: error,
        message: error?.message,
      });
      if (typeof onError === 'function') {
        onError({error: error, message: error?.message});
      }
      return {
        success: false,
        ...error,
      };
    }
  }
  return [state, mutate];
}

export default useMutation;
