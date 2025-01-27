export interface JsonResponseModel<T> {
    msg?: string;
    payload: T;
    status: number;
}