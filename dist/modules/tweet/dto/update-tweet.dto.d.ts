export declare enum EUpdateTweetType {
    CONTENT = "content",
    RETWEET = "retweet",
    REACT = "react",
    SAVE = "save",
    SHARE = "share"
}
export declare class UpdateTweetDto {
    type: EUpdateTweetType;
    content: string;
    tags: string[];
    media: string[];
    audience: number;
}
