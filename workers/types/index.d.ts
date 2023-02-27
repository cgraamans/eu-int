export namespace ITypes {

    export interface category {
        id:number
        name:string
        stub:string
        language:string
    }

    export interface source {

        id:number
        stub:string
        name:string
        image:string

        url_rss?:string
        url_twitter?:string
        url_reddit?:string
        url_twitterlist?:string
        country?:string
        language?:string

        categories?:category[]

        link:string

        type?:string

        isActive?:number

        user?:{
            isFavorited:number
        }
        
    }

    export interface item {

        id?:number
        stub:string

        source_id:number
        dt_ins:number
        dt_pub:number
        created_by?:string
        text:string
        link:string
        image?:string
        raw?:string

    }

    export namespace feeds {

        export interface rss {
            id:number
            ref:string
        }

    }


}

/*

{

    id:number
    stub:string
    text:string
    link:string
    image:string
    raw:string
    created_by:string
    dt_publish:number
    dt_insert:number

    likes:number

    locations:[
        {
            lat:string
            lon:string
            id_country?:number
            id_city?:number
            id_special?:number
            shape?:string
        }
    ]
    
    source:{

        id:number
        name:string
        stub:string
        link:string
        categories:[
            {
                id:number
                name:string
                stub:string
            }
        ]
        image?:string
        language?:number
        feed_rss?:number
        feed_reddit?:number
        feed_youtube?:number
        feed_twitterlist?:number
        isActive:number

    },
    
    
    comments:[
        {
            id:number
            stub:string
            comment:string
            user_id:number
            dt:number
            link:string
            reports:[
                {
                    user_id:number
                    reason:string
                }
            ]
            isActive:boolean
            isBanned:boolean
            isDeleted:boolean

        }
    ],
    
    user?:{
        id:number
        name:string
        nickname:string
        isSaved:boolean
        isLiked:boolean
    },


}

FILTERS

- likes (#)
- comments (#)
- item (stub)
- source (source > stub)
- language (source > language)
- category (source > categories)

- isRSS (B)
- isTwitterList (B)
- isReddit (B)
- isYoutube (B)
- isDiscord (B)


*/


// import { Submission } from 'snoowrap';
// import { GuildEmoji, Role, User } from 'discord.js';
// import mastodon from 'src/services/mastodon';

// declare module '*';

// declare module "discord.js" {
//     export interface Client {
//       commands: Collection<unknown, any>
//     }
// }

// export namespace Eurobot {

//     export interface Config {
//         BadWords?:string[],
//         Channels?:Channel[],
//         Reactions?:Reaction[],
//         Roles?:Roles.Countries,
//         Routes?:Route[]
//     }

//     export namespace Roles {

//         export interface Country {
//             alias:string,
//             role_id:string,
//             emoji:string,
//             isAlias:number|null,
            
//             toggle_result?:number,
//             toggle_role?:Role
    
//         }
    
//         export interface User {
//             role_id:string,
//             category:string,
//             user_level:number
//         }

//         export interface Countries {
//             Countries:Roles.Country[],
//             Users:Roles.User[]
//         }

//     }

//     export interface Reaction {
//         reaction:string,
//         category:string
//     }

//     export interface Channel {
//         channel_id:string,
//         category:string
//     }

//     export interface Route {

//         from:string,
//         to:string,
//         isActive:number

//     }
    
//     export namespace Message {
        
//         export interface Comment {
//             emoji?:GuildEmoji,
//             category?:string,random?:boolean
//         }
    
//     }

//     export namespace News {

//         export interface Obj {

//             subreddit?:Submission[],
//             twitter?:any[],
//             row?:Row,
//             keyword:string,

//         }

//         export interface Row {

//             key:string,
//             name?:string,
//             subreddit?:string,
//             twitter_list?:string,
//             twitter?:string,
//             url?:string

//         }

//     }
        
//     export namespace Twitter {
        
//         export interface MediaObj {
//             size:string,
//             type:string,
//             data:Buffer
//         }
    
//     }

//     export namespace Calendar {

//         export interface Span {
//             human:string
//             range:Calendar.Range
//         }

//         export interface Range {
//             from:Date
//             to?:Date
//         }

//     }

//     export namespace Rank {

//         export interface Row {

//             rank:number,
//             xp:number,
//             user_id:string

//         }

//     }

//     // OLD MODELS FOR REFERENCE
//     export namespace Models {

//         export namespace Polls {

//             export interface Poll {
        
//                 author:string,
//                 channel:string,
//                 end:number,
//                 start:number
//                 text:string,
        
//                 message?:string,
//                 results?:PollResultTotals
//                 user?:User
        
//             }
        
//             export interface PollResults {
        
//                 totals:PollResultTotals
//                 up?:string[],
//                 down?:string[],
//                 shrug?:string[]
        
//             }
        
//             export interface PollResultTotals {
//                     "up":number,
//                     "down":number,
//                     "shrug":number,
//             }
        
//             export interface PollResultDBTotal {
        
//                 vote:string,
//                 num:number
        
//             }
        
//         }

//     }

// }
