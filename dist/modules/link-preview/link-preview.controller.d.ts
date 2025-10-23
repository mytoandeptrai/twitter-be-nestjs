import { ResponseDTO } from 'common';
export declare class LinkPreviewController {
    private readonly linkPreviewService;
    getLinkMetadata(url: string): Promise<ResponseDTO>;
}
