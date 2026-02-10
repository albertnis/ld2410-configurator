export type Result<T, E> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: E;
    };

export const Result = {
  ok: function <T>(data: T): Result<T, never> {
    return {
      success: true,
      data,
    };
  },
  error: function <E>(error: E): Result<never, E> {
    return {
      success: false,
      error,
    };
  },
};

export function assertNever(_: never) {}
