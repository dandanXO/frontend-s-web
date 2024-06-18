import https from '@/utils/https'
import { ContentType, Method } from 'axios-mapper'

export const getCompetitions = competition => {
  return https().request(
    '/platform-competition',
    Method.GET,
    competition,
    ContentType.form
  )
}

export const createCompetition = competition => {
  return https().request(
    '/platform-competition',
    Method.POST,
    competition,
    ContentType.form
  )
}

export const updateCompetition = async competition => {
  await https().request(
    `/platform-competition/${competition.id}?_method=PUT`,
    Method.POST,
    competition,
    ContentType.form
  )
}

export const deleteCompetition = async ids => {
  await https().request(
    `/platform-competition?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}

export const getCompetitionsCode = competitionCode => {
  return https().request(
    '/platform-competition-code',
    Method.GET,
    competitionCode,
    ContentType.form
  )
}

export const createCompetitionCode = competitionCode => {
  return https().request(
    '/platform-competition-code',
    Method.POST,
    competitionCode,
    ContentType.form
  )
}

export const updateCompetitionCode = async competitionCode => {
  await https().request(
    `/platform-competition-code/${competitionCode.id}?_method=PUT`,
    Method.POST,
    competitionCode,
    ContentType.form
  )
}

export const deleteCompetitionCode = async ids => {
  await https().request(
    `/platform-competition-code?_method=DELETE`,
    Method.POST,
    { ids: ids.join(',') },
    ContentType.form
  )
}

export const getCompetitionGameList = (platformId) => {
  return https().request(
    '/platform-competition-code/game-list',
    Method.GET,
    { platformId },
    ContentType.form
  )
}
