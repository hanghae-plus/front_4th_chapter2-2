import { HttpResponse } from "msw";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
} as const;

export const createErrorResponse = (
  message: string,
  status: number = HTTP_STATUS.NOT_FOUND
): HttpResponse => {
  return HttpResponse.json({ message, status }, { status });
};

export const createSuccessResponse = <T>(
  data: T,
  status: number = HTTP_STATUS.OK
): HttpResponse => {
  return HttpResponse.json(
    { data },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
