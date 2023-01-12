/* eslint-disable @typescript-eslint/no-explicit-any */
interface IHttpResponse {
  statusCode: number;
  body: any;
}

interface IHttpRequest {
  body?: any;
  headers?: any;
}

export { IHttpResponse, IHttpRequest };
