const Nimble = require("./library/Nimble.js")
const Datalore = require("./library/Datalore.js")

module.exports.handler = new Nimble.LambdaHandler(async (event) => {
    return {
        "channel": await Datalore.getChannel(event.pathParameters.channelId)
    }
})

// {
//     "channel": {
//         "id": "123456789",
//         "tally": {
//             "3": 1000,
//             "4": 2000,
//         }
//     },
//     "user": {
//         "oid": "123456789",
//         "id": "124567789",
//         "best": 98,
//         "tally": 123,
//     }
// }

// CHANNELS_TABLE > what is the distribution of scores?
// SESSIONS_TABLE > what is the highest score for a channel? (channel id and sorted score, session unique)
// USERS_TABLE > what are my scores? (user id and sorted score, session unique) -> GSI!!