
/**
 * Defines the structure of http request options which are passed to the ApiService get, put, post and delete methods.
 */
export interface HttpRequest {
    url: string,
    headers?: Object
    getParams?: Object,
    postParams?: Object
}