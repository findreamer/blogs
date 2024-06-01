import { axios } from "./index";

export const getArticleInfo = (articleId: string) => {
  return axios.get("/article/getArticleInfo", { params: { articleId } });
};

export const getCategoryList = () => {
  return axios.get("/article/getCategoryList");
};
