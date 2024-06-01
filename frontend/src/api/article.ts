import { axios } from "./index";

export const getArticleInfo = (articleId: string) => {
  return axios.get("/article/getArticleInfo", { params: { id: articleId } });
};

export const getCategoryList = () => {
  return axios.get("/article/getCategoryList");
};

export const createOrUpdateArticle = (params: {
  id?: number;
  title?: string;
  content?: string;
}) => {
  return axios.post("/article/createOrUpdate", params);
};

export const publishArticle = (params: {
  id: number;
  categoryId: number;
  introduction: string;
}) => {
  return axios.post(`/article/publish`, params);
};

export const getMyArticle = () => {
  return axios.get("/article/getMyArticle");
};

export const deleteArticle = (articleId: number) => {
  return axios.post("/article/deleteArticle", { articleId });
};
