import DB from "./db";
import {Eurobot} from "../../types/index";
import * as T from "../../types";

import {Intents, Message, User, Client, Guild, Role, MessageReaction} from "discord.js";
import * as fs from "fs";

class Discord {

    private static instance:Discord;

    public Client:Client

    public Timers:NodeJS.Timeout[] = [];

    public Config:Eurobot.Config = {};

    private Roles:string[] = [];

    private key:string = process.env.EUROBOT_DISCORD;

    // Service Instance Initialization
    static getInstance() {
        
        if (!Discord.instance) {
            Discord.instance = new Discord();
        }
        return Discord.instance;

    }

    constructor() {

        try {

            //
            // CONFIG
            //

            // INIT DISCORD CLIENT
            this.Client = new Client({ 
                intents: [
                    Intents.FLAGS.GUILDS,
                    Intents.FLAGS.GUILD_MESSAGES,
                    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
                ]
            });

            // FILL CONFIG
            this.getConfig().then(()=>{

                console.log('Processing discord event files...')
                // get events and set client on/once for each event
                const eventFiles = fs.readdirSync(`${__dirname}/../events`).filter(file=>!file.endsWith('.map'));

                for (const file of eventFiles) {
                    const event = require(`${__dirname}/../events/${file}`);
                    if (event.once) {
                        this.Client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        this.Client.on(event.name, (...args) => event.execute(...args));
                    }
                }

                // error
                this.Client.on("error",e=>{

                    console.log("!! Discord Service Client Error",e);
                    setTimeout(()=>{
                        console.log(`Logging into Discord...`);
                        this.Client.login(this.key);
                    },15000);
                
                });

                // disconnect
                this.Client.on('disconnect',(message:Message)=>{

                    if(message) console.log("!! Disconnected from Discord",message);
                    setTimeout(()=>{
                        console.log(`Logging into Discord...`);
                        this.Client.login(this.key);
                    },15000);
                
                });

                // login
                console.log(`Logging into Discord...`);
                this.Client.login(this.key);

            }).catch(e=>{console.log(e)});

        } catch(e) {

            throw e;
        
        }

    }

    // Retrieve configs from database for constructor
    private async getConfig() {

        console.log(`Retrieving Config...`)

        this.Config.Routes = await DB.q("SELECT * FROM discord_conf_routes").catch(e=>{throw e});
        this.Config.BadWords = await DB.q("SELECT * FROM discord_conf_badwords").catch(e=>{throw e});
        this.Config.Channels = await DB.q("SELECT * FROM discord_conf_channels").catch(e=>{throw e});
        this.Config.Reactions = await DB.q("SELECT * FROM discord_conf_reactions").catch(e=>{throw e});
        this.Config.Roles = {
            Countries:(await DB.q("SELECT * FROM discord_conf_role_countries").catch(e=>{throw e})),
            Users:(await DB.q("SELECT * FROM discord_conf_role_users").catch(e=>{throw e}))
        };

        return;

    }

    // is a user authorized for an action?
    public async authorizeMessage(message:Message,roles:string[]) {

        let userRoles:Eurobot.Roles.User[] = [];
        let userRoleList:Role[] = [];

        userRoles = this.isConfigRole(roles);

        // None of the roles exist
        if(userRoles.length < 1) return;

        userRoles.forEach(userRole=>{

            const RoleGuild = message.guild.roles.cache.find(guildRole=>guildRole.id === userRole.role_id);
            if(RoleGuild) {

                const hasRole = message.member.roles.cache.get(userRole.role_id);
                if(hasRole) userRoleList.push(hasRole);

            }

        });

        return userRoleList;    

    }

    // is a user authorized for an action?
    public async authorizeReaction(reaction:MessageReaction,roles:string[]) {

        let userRoles:Eurobot.Roles.User[] = [];
        let userRoleList:Role[] = [];

        userRoles = this.isConfigRole(roles);

        // None of the roles exist
        if(userRoles.length < 1) return;

        userRoles.forEach(userRole=>{

            const RoleGuild = reaction.message.guild.roles.cache.find(guildRole=>guildRole.id === userRole.role_id);
            if(RoleGuild) {

                const hasRole = reaction.client.guilds.cache.find(guild=>guild.id === reaction.message.guild.id).roles.cache.get(userRole.role_id);
                if(hasRole) userRoleList.push(hasRole);

            }

        });

        return userRoleList;  

    }

    private isConfigRole(roles:string[]) {

        let userRoles:Eurobot.Roles.User[] = [];
        // Which Available Roles Correspond to the requested ones
        roles.forEach(role=>{
            const UserRole = this.Config.Roles.Users.find(userRole=>userRole.category === role)
            if(UserRole) userRoles.push(UserRole);
        });
        return userRoles;

    }

}

export default Discord.getInstance();