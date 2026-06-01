import { httpGet } from './request'
// TODO add Notice

const owner = 'YM040923'
const repo = 'ym-music-desktop'

const address = [
  [`https://raw.githubusercontent.com/${owner}/${repo}/master/publish/version.json`, 'direct'],
  [`https://cdn.jsdelivr.net/gh/${owner}/${repo}/publish/version.json`, 'direct'],
  [`https://fastly.jsdelivr.net/gh/${owner}/${repo}/publish/version.json`, 'direct'],
  [`https://gcore.jsdelivr.net/gh/${owner}/${repo}/publish/version.json`, 'direct'],
]

const request = async(url, retryNum = 0) => {
  return new Promise((resolve, reject) => {
    httpGet(url, {
      timeout: 10000,
    }, (err, resp, body) => {
      if (err || resp.statusCode != 200) {
        ++retryNum >= 3
          ? reject(err || new Error(resp.statusMessage || resp.statusCode))
          : request(url, retryNum).then(resolve).catch(reject)
      } else resolve(body)
    })
  })
}

const getDirectInfo = async(url) => {
  return request(url).then(info => {
    if (info.version == null) throw new Error('failed')
    return info
  })
}

export const getVersionInfo = async(index = 0) => {
  const [url] = address[index]
  const promise = getDirectInfo(url)

  return promise.catch(async(err) => {
    index++
    if (index >= address.length) throw err
    return getVersionInfo(index)
  })
}

// getVersionInfo().then(info => {
//   console.log(info)
// })
