import { ContentType, Method } from 'axios-mapper'
import https from '../utils/https'

export const loadPoster = query => {
  return https().request('sitePoster', Method.GET, query, ContentType.form)
}

export const loadSize = siteId => {
  return https().request(
    'sitePoster/size',
    Method.GET,
    { siteId: siteId },
    ContentType.form
  )
}

export const increaseDownloadCount = id => {
  return https().request(
    'sitePoster/download?_method=PUT',
    Method.POST,
    { id: id },
    ContentType.form
  )
}

export const getPathById = id => {
  return https().request(
    `sitePoster/${id}`,
    Method.GET,
  )
}
