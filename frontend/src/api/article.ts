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
  return axios.post("/articles/createOrUpdate", params);
};

export const publishArticle = (params: {
  id: number;
  categoryId: number;
  introduction: string;
}) => {
  return axios.post(`/articles/publish`, params);
};
