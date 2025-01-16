export const parseRequest = async <T>(request: Request): Promise<T> => {
  try {
    const data = await request.json();
    return data as T;
  } catch {
    throw new Error("Invalid request data");
  }
};
