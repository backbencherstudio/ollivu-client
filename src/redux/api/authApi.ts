import { baseApi } from './baseApi';

export interface ICreateUserRequest {
  first_name: string;
  email: string;
  password: string;
}

export interface ICreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      first_name: string;
      email: string;
    };
    token: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<ICreateUserResponse, ICreateUserRequest>({
      query: (data) => ({
        url: '/auth/create-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useCreateUserMutation } = authApi;