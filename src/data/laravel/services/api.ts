import { Mutex } from "async-mutex";
import { nanoid } from "@reduxjs/toolkit";
import { container } from "@src/appEngine";
import { QUERY_KEYS } from "@constants/query";
import { ConfigService } from "@config/ConfigService";
import { loggedOut, tokenReceived } from "@store/actions/auth";
import { auth, gglProvider, storage } from "@config/firebase";
import { isErrorWithMessage, isValidationError } from "@utils/error-handling";
import {
  signOut,
  AuthError,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  RootState,
  IDocument,
  JoteyQueryError,
  LoginUserRequest,
  PaginatedResponse,
  RegisterUserRequest,
} from "@src/types";
import {
  createApi,
  FetchArgs,
  BaseQueryFn,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const configService = container.get<ConfigService>(ConfigService);

export function providesList<
  O extends { id: string | number },
  R extends PaginatedResponse<O> | Array<O> | undefined,
  T extends string
>(
  resultsWithIds: R | undefined,
  error: JoteyQueryError | undefined,
  tagType: T
) {
  if (error) {
    return [QUERY_KEYS.UNKNOWN_ERROR];
  }

  if (resultsWithIds) {
    const result = Array.isArray(resultsWithIds)
      ? resultsWithIds
      : resultsWithIds.data;
    return [
      { type: tagType, id: "LIST" } as const,
      ...result.map(({ id }) => ({ type: tagType, id } as const)),
    ];
  }

  return [{ type: tagType, id: "LIST" }] as const;
}

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: configService.apiBaseURL,
  prepareHeaders: (headers, { getState }) => {
    headers.append("X-Requested-With", "XMLHttpRequest");
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", token);
    }
    return headers;
  },
});

const laravelBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  JoteyQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const err = result.error;

    // you can access all properties of `FetchBaseQueryError` here
    let non_field_error =
      "error" in err
        ? err.error
        : isErrorWithMessage(err.data)
        ? !!err.data.message
          ? err.data.message
          : "Something went wrong"
        : typeof err.data === "string"
        ? (err.data as string)
        : "Server gave invalid error format";

    let field_errors: Record<string, string> = {};

    if (err.data && isValidationError(err.data)) {
      field_errors = Object.entries(err.data.errors).reduce(
        (acc, [fieldName, [errorMessage]]) => {
          acc[fieldName] = errorMessage;
          return acc;
        },
        {} as Record<string, string>
      );
    }

    return {
      error: {
        status: err.status,
        data: {
          field_errors,
          non_field_error,
        },
      },
      meta: result.meta,
    };
  }

  return {
    data: result.data,
    meta: result.meta,
  };
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  JoteyQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await laravelBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (token) {
          api.dispatch(tokenReceived(token));
          // retry the initial query
          result = await laravelBaseQuery(args, api, extraOptions);
        } else {
          await auth.signOut();
          api.dispatch(loggedOut());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await laravelBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    QUERY_KEYS.DOCUMENT,
    QUERY_KEYS.UNKNOWN_ERROR,
    QUERY_KEYS.UNAUTHORIZED_ERROR,
  ],
  endpoints: (builder) => ({
    googleLogin: builder.mutation<{ token: string; user: object }, void>({
      queryFn: async () => {
        try {
          const userCredential = await signInWithPopup(auth, gglProvider);
          const token = await userCredential.user.getIdToken();
          return {
            data: { token, user: userCredential.user.toJSON() },
          };
        } catch (error) {
          const firebaseAuthError = error as AuthError;
          return {
            data: undefined,
            error: {
              status: "CUSTOM_ERROR",
              data: {
                non_field_error: firebaseAuthError.message,
                field_errors: {},
              },
            },
          };
        }
      },
      invalidatesTags: (result) =>
        result ? [QUERY_KEYS.UNAUTHORIZED_ERROR] : [],
    }),
    login: builder.mutation<{ token: string; user: object }, LoginUserRequest>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          const token = await userCredential.user.getIdToken();

          return {
            data: {
              token,
              user: userCredential.user.toJSON(),
            },
          };
        } catch (error) {
          const firebaseAuthError = error as AuthError;
          return {
            data: undefined,
            error: {
              status: "CUSTOM_ERROR",
              data: {
                non_field_error: firebaseAuthError.message,
                field_errors: {},
              },
            },
          };
        }
      },
      invalidatesTags: (result) =>
        result ? [QUERY_KEYS.UNAUTHORIZED_ERROR] : [],
    }),
    refetchErroredQueries: builder.mutation<null, void>({
      queryFn: () => ({ data: null }),
      invalidatesTags: [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    logout: builder.mutation<string, void>({
      queryFn: async () => {
        try {
          await signOut(auth);

          return {
            data: "Logout success",
          };
        } catch (error) {
          const firebaseAuthError = error as AuthError;
          return {
            data: undefined,
            error: {
              status: "CUSTOM_ERROR",
              data: {
                non_field_error: firebaseAuthError.message,
                field_errors: {},
              },
            },
          };
        }
      },
    }),
    register: builder.mutation<object, RegisterUserRequest>({
      queryFn: async ({ email, password }) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          return {
            data: userCredential.user.toJSON(),
          };
        } catch (error) {
          const firebaseAuthError = error as AuthError;
          return {
            data: undefined,
            error: {
              status: "CUSTOM_ERROR",
              data: {
                non_field_error: firebaseAuthError.message,
                field_errors: {},
              },
            },
          };
        }
      },
    }),
    fetchAgoraToken: builder.mutation<
      { token: string },
      { channelName: string }
    >({
      query: (body) => {
        return {
          body,
          method: "POST",
          url: "/agora/generateRtcToken",
        };
      },
    }),
    uploadFile: builder.mutation<
      {
        downloadUrl: string;
      },
      { file: File }
    >({
      queryFn: async function ({ file }, _api, extraOptions, _baseQuery) {
        const storageRef = ref(storage, `uploads/${nanoid()}`);

        // 'file' comes from the Blob or File API
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          return {
            data: {
              downloadUrl,
            },
          };
        } catch (error) {
          console.log(error);
          return {
            error: {
              status: 500,
              data: {
                non_field_error: (error as Error).message,
                field_errors: {},
              },
            },
          };
        }
      },
    }),
    deleteDocument: builder.mutation<
      { success: boolean; message: string },
      {
        documentId: string;
      }
    >({
      query(body) {
        return {
          body,
          method: "DELETE",
          url: `/documents/${body.documentId}`,
        };
      },
      invalidatesTags: (result, error, body) => {
        if (result?.success) {
          return [{ type: QUERY_KEYS.DOCUMENT, id: "LIST" }];
        }
        return [];
      },
    }),
    updateDocument: builder.mutation<
      { success: boolean; message: string },
      {
        title: string;
        documentId: string;
        users: { id: string; read: boolean; write: boolean }[];
      }
    >({
      query(body) {
        return {
          body,
          method: "PUT",
          url: `/documents/${body.documentId}`,
        };
      },
      invalidatesTags: (result, error, body) => {
        if (result?.success) {
          return [{ type: QUERY_KEYS.DOCUMENT, id: body.documentId }];
        }
        return [];
      },
    }),
    createDocument: builder.mutation<
      { success: boolean; message: string },
      {
        title: string;
        documentId: string;
        users: { id: string; read: boolean; write: boolean }[];
      }
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: "/documents",
        };
      },
      invalidatesTags: (result) => {
        if (result?.success) {
          return [{ type: QUERY_KEYS.DOCUMENT, id: "LIST" }];
        }
        return [];
      },
    }),
    getDocuments: builder.query<
      {
        data: {
          _id: string;
          title: string;
          users: {
            [userId: string]: {
              read: boolean;
              write: boolean;
              owner: boolean;
            };
          };
          lastEditedBy: string;
          lastEditedTime: string;
          documentId: string;
        }[];
      },
      {}
    >({
      query() {
        return {
          url: "/documents",
        };
      },
      providesTags: (result, error) =>
        result
          ? [
              { type: QUERY_KEYS.DOCUMENT, id: "LIST" },
              ...result.data.map(({ documentId }) => ({
                type: QUERY_KEYS.DOCUMENT as const,
                id: documentId,
              })),
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED_ERROR]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getDocumentDetails: builder.query<IDocument, { documentId: string }>({
      query({ documentId }) {
        return {
          url: `/documents/${documentId}`,
        };
      },
      providesTags: (result, error, { documentId }) =>
        result
          ? [{ type: QUERY_KEYS.DOCUMENT, id: documentId }]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED_ERROR]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getPeople: builder.query<
      {
        data: {
          uid: string;
          displayName: string;
          photoURL: string;
          email: string;
        }[];
      },
      void
    >({
      query() {
        return {
          url: `/documents/people`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{ type: QUERY_KEYS.DOCUMENT, id: "PEOPLE" }]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED_ERROR]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useGetPeopleQuery,
  useLogoutMutation,
  useRegisterMutation,
  useGetDocumentsQuery,
  useUploadFileMutation,
  useGoogleLoginMutation,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useUpdateDocumentMutation,
  useGetDocumentDetailsQuery,
  useFetchAgoraTokenMutation,
} = api;
