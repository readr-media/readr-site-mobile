import { TALK_SERVER, } from 'api/config.js'

export function renderComment (target_parent, taget_ele, url, talk_server) {
  Coral && Coral.Talk.render(target_parent.querySelector(taget_ele), {
    talk: talk_server || TALK_SERVER,
    asset_url: url,
  })
}