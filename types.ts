export interface PullRequest {
    number: number
    mergedBy: User
}
export interface User {
    login: string
}

export interface Dictionary<T> {
    [key: string]: T
}