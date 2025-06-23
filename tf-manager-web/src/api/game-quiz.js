import https from "@/utils/https";
import { ContentType, Method } from "axios-mapper";

export const getGameQuiz = (query) => {
  return https().request("/game-quiz", Method.GET, query, ContentType.form);
};

export const createGameQuiz = (gameQuiz) => {
  return https().request("/game-quiz", Method.POST, gameQuiz, ContentType.form);
};

export const updateGameQuiz = (id, gameQuiz) => {
  return https().request(`/game-quiz/${id}?_method=PUT`, Method.POST, gameQuiz, ContentType.form);
};

export const endGameQuiz = (id, gameQuiz) => {
  return https().request(`/game-quiz/${id}/end?_method=PUT`, Method.POST, gameQuiz, ContentType.form);
};

export const cancelGameQuiz = (id) => {
  return https().request(`/game-quiz/${id}/cancel?_method=PUT`, Method.POST);
};

export const getGameQuizTitle = (siteId) => {
  return https().request("/game-quiz/title", Method.GET, { siteId: siteId }, ContentType.form);
};

export const getGameQuizOccasionsList = (promoCode) => {
  return https().request("/game-quiz/occasions", Method.GET, { promoCode: promoCode }, ContentType.form);
};

export const getGameQuizAnswers = (query) => {
  return https().request("/game-quiz-answer", Method.GET, query, ContentType.form);
};

export const updateGameQuizAnswer = (id, status) => {
  return https().request(`/game-quiz-answer/${id}?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const getGameQuizAnswersForExport = (query) => {
  return https().request("/game-quiz-answer/export", Method.GET, query, ContentType.form);
};

export const getGameQuizOccasions = (query) => {
  return https().request("/game-quiz-occasion", Method.GET, query, ContentType.form);
};

export const updateGameQuizOccasions = (id, status) => {
  return https().request(`/game-quiz-occasion/${id}?_method=PUT`, Method.POST, { status: status }, ContentType.form);
};

export const getGameQuizOccasionsForExport = (query) => {
  return https().request("/game-quiz-occasion/export", Method.GET, query, ContentType.form);
};
