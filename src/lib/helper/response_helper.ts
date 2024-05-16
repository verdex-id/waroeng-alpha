export function successResponse(data: any) {
  return Response.json({
    status: 200,
    message: "success",
    error: null,
    data: data,
  });
}

export function errorResponse(code: number, message: string, error: any) {
  return Response.json(
    {
      status: code,
      message: message,
      error: error,
      data: null,
    },
    {
      status: code,
    }
  );
}
