# rltracker-api

This is a small piece of the PTP bot running on the Part Time Pros discord
server. It's used to run rank checks using the RLTracker.pro API.

usage:

```javascript
const rank_check = require('rltracker-api')({
  api_key: 'my-awesome-key'
});

rank_check('steam', 'illegal-function', (error, rank_info) => {
  console.log(rank_info)
})
```

It should return something like this:

```javascript
{
  "request_time": 2054,
  "player": {
    "id": 43904,
    "nickname": "illegal-function | PTP",
    "platform_id": 1,
    "platform": "steam",
    "player_id": "76561198287846589",
    "updated_at": "2017-06-11T14:06:54.000Z",
    "intern_id": "illegal-function",
    "avatar": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ec/ec02096fd0706b643b4806cef62e4d7683131f79_full.jpg"
  },
  "stats": {
    "wins": 3018,
    "goals": 5898,
    "mvps": 933,
    "saves": 4432,
    "shots": 12081,
    "assists": 2601,
    "ranked_games": 680,
    "average_mmr": 658.25
  },
  "duels": {
    "playlist": "1v1",
    "rating": 518,
    "tier_id": 6,
    "tier_name": "Silver III",
    "division": 1,
    "division_string": "I",
    "matches_played": 30,
    "mu": 20.9,
    "sigma": 2.5,
    "mmr": 20.9,
    "rank": 21
  },
  "doubles": {
    "playlist": "2v2",
    "rating": 777,
    "tier_id": 9,
    "tier_name": "Gold III",
    "division": 3,
    "division_string": "III",
    "matches_played": 274,
    "mu": 33.85,
    "sigma": 2.5,
    "mmr": 33.85,
    "rank": 35
  },
  "solo": {
    "playlist": "3v3s",
    "rating": 468,
    "tier_id": 4,
    "tier_name": "Silver I",
    "division": 4,
    "division_string": "IV",
    "matches_played": 259,
    "mu": 18.4,
    "sigma": 2.5,
    "mmr": 18.4,
    "rank": 16
  },
  "standard": {
    "playlist": "3v3",
    "rating": 870,
    "tier_id": 10,
    "tier_name": "Platinum I",
    "division": 4,
    "division_string": "IV",
    "matches_played": 117,
    "mu": 38.5,
    "sigma": 2.5,
    "mmr": 38.5,
    "rank": 40
  }
}
```
