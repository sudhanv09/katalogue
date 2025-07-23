export type UploadResult =
    | {
        status: 'success';
        id: string;
    }
    | {
        status: 'error';
        error: string;
    };