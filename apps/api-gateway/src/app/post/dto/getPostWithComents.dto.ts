export interface CommentDto {
  commentId: string;
  postId: number;
  message: string;
}
export interface PostWithCommentsDto {
  postId: number;
  title: string;
  content: string;
  comments: CommentDto[];
}
