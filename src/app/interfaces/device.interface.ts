
/**
 * An interface defining the structure of a device object. Used predominently in the NetworkService class.
 */
export interface Device {
    api_token?: string,
    model?: string,
    platform?: string,
    version?: string,
    build?: string,
    identifier?: string,
    network?: string,
    uuid?: string,
    screen?: {
        width: number,
        height: number
    }
}