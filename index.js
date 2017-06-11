"use strict";

const https = require('https');
const querystring = require('querystring');

const tier_names = Object.freeze([
  'Unranked',
  'Bronze I', 'Bronze II', 'Bronze III',
  'Silver I', 'Silver II', 'Silver III',
  'Gold I', 'Gold II', 'Gold III',
  'Platinum I', 'Platinum II', 'Platinum III',
  'Diamond I', 'Diamond II', 'Diamond III',
  'Champion I', 'Champion II', 'Champion III',
  'Grand Champion',
]);

const division_strings = [
  '', 'I', 'II', 'III', 'IV'
];

const tier_to_string = (input) => {
  return tier_names[input];
}

const convert_platform = (name) => {
  if (name === 'steam') return 1;
  else if (name == 'ps4') return 2;
  else if (name == 'xbox') return 3;

  throw new TypeError("Legal platform names are: steam, ps4 and xbox");
}

const clean_result = (input, request_time) => {
  if (input.error.status) {
    return Object.freeze({
      error: Object.freeze({
        status: input.error.status,
      })
    })
  }

  return Object.freeze({
    request_time: request_time,
    player: Object.freeze({
      id: input.player.id,
      nickname: input.player.nickname,
      platform_id: input.player.platform_id,
      platform: ['', 'steam', 'ps4', 'xbox'][input.player.platform_id],
      player_id: input.player.player_id,
      updated_at: new Date(input.player.updated_at),
      intern_id: input.player.intern_id,
      avatar: input.player.avatar,
    }),
    stats: Object.freeze({
      wins: input.stats.wins,
      goals: input.stats.goals,
      mvps: input.stats.mpvs,
      saves: input.stats.saves,
      shots: input.stats.shots,
      assists: input.stats.assists,
      ranked_games: (() => {
        return input.ranking['10'].matches_played +
               input.ranking['11'].matches_played +
               input.ranking['12'].matches_played +
               input.ranking['13'].matches_played ;
      })(),
      average_mmr: (() => {
        return ( input.ranking['10'].rating +
                 input.ranking['11'].rating +
                 input.ranking['12'].rating +
                 input.ranking['13'].rating ) / 4;
      })(),
    }),
    duels: Object.freeze({
      playlist: '1v1',
      rating: input.ranking['10'].rating,
      tier_id: input.ranking['10'].tier_id,
      tier_name: tier_to_string(input.ranking['10'].tier_id),
      division: input.ranking['10'].division,
      division_string: division_strings[input.ranking['10'].division],
      matches_played: input.ranking['10'].matches_played,
      mu: input.ranking['10'].mu,
      sigma: parseFloat(input.ranking['10'].sigma),
      mmr: parseFloat(input.ranking['10'].mmr),
      rank: input.ranking['10'].tier_id === 0 ? 0 : ( (input.ranking['10'].tier_id * 4) - 3) + (input.ranking['10'].division - 1),
    }),
    doubles: Object.freeze({
      playlist: '2v2',
      rating: input.ranking['11'].rating,
      tier_id: input.ranking['11'].tier_id,
      tier_name: tier_to_string(input.ranking['11'].tier_id),
      division: input.ranking['11'].division,
      division_string: division_strings[input.ranking['11'].division],
      matches_played: input.ranking['11'].matches_played,
      mu: input.ranking['11'].mu,
      sigma: parseFloat(input.ranking['11'].sigma),
      mmr: parseFloat(input.ranking['11'].mmr),
      rank: input.ranking['11'].tier_id === 0 ? 0 : ( (input.ranking['11'].tier_id * 4) - 3) + (input.ranking['11'].division - 1),
    }),
    solo: Object.freeze({
      playlist: '3v3s',
      rating: input.ranking['12'].rating,
      tier_id: input.ranking['12'].tier_id,
      tier_name: tier_to_string(input.ranking['12'].tier_id),
      division: input.ranking['12'].division,
      division_string: division_strings[input.ranking['12'].division],
      matches_played: input.ranking['12'].matches_played,
      mu: input.ranking['12'].mu,
      sigma: parseFloat(input.ranking['12'].sigma),
      mmr: parseFloat(input.ranking['12'].mmr),
      rank: input.ranking['12'].tier_id === 0 ? 0 : ( (input.ranking['12'].tier_id * 4) - 3) + (input.ranking['12'].division - 1),
    }),
    standard: Object.freeze({
      playlist: '3v3',
      rating: input.ranking['13'].rating,
      tier_id: input.ranking['13'].tier_id,
      tier_name: tier_to_string(input.ranking['13'].tier_id),
      division: input.ranking['13'].division,
      division_string: division_strings[input.ranking['13'].division],
      matches_played: input.ranking['13'].matches_played,
      mu: input.ranking['13'].mu,
      sigma: parseFloat(input.ranking['13'].sigma),
      mmr: parseFloat(input.ranking['13'].mmr),
      rank: input.ranking['13'].tier_id === 0 ? 0 : ( (input.ranking['13'].tier_id * 4) - 3) + (input.ranking['13'].division - 1),
    }),
  });
};

module.exports = (conf) => {
  const defaults = {
    api_key: process.env.RLTRACKER_API_KEY
  }

  const config = Object.assign({}, defaults, conf || {});

  if (typeof(config.api_key) !== 'string') {
    throw new TypeError('Missing api_key')
  }

  return (platform, id, callback) => {
    platform = convert_platform(platform);

    if (typeof(id) !== 'string') {
      if (id.toString && !(id = id.toString() ) ) {
        throw new TypeError("id must be string");
      }
    }

    if (typeof(callback) !== 'function') {
      throw new TypeError("callback must be a function");
    }

    const https_opts = {
      method: 'GET',
      host: 'rltracker.pro',
      path: '/api/profile/get?' + querystring.stringify({
        api_key: config.api_key,
        platform: platform,
        id: id,
      }),
    }

    const start_time = new Date();
    const request = https.request(https_opts, (req) => {
      let result = '';

      req.on('data', (fragment) => {
        result += fragment;
      })

      req.on('end', () => {
        callback(null, clean_result(JSON.parse(result), (new Date() - start_time) ) );
      })
    })

    request.on('error', (e) => {
      callback(e, null);
    })

    request.end();
  }
}
