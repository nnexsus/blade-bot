const { token, key, clientID, guildID } = require('./config.json');
const { Client, Intents, MessageAttachment, MessageEmbed, MessageButton } = require('discord.js');
const { default: axios } = require('axios');
const { Pagination } = require('pagination.djs');
const db = require('./db.json');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10')



const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})



const commands = [
    new SlashCommandBuilder().setName('search').setDescription('Search for your clan by name.').addStringOption(option => option.setName('clan-name').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('clan').setDescription('Gets your clan and clanmates profiles.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('warlog').setDescription("Gets war log info from a clan.").addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('currentwar').setDescription('Gets info on your clans current war.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('player').setDescription("Gets player info.").addStringOption(option => option.setName('player-tag').setDescription('Ex: #8YQ9LC2QU').setRequired(true)),
    new SlashCommandBuilder().setName('goldpass').setDescription("Get gold pass end time."),
    new SlashCommandBuilder().setName('help').setDescription('Lists all commands and syntaxes.'),
    new SlashCommandBuilder().setName('troops').setDescription('Sends info on all regular troops.'),
    new SlashCommandBuilder().setName('troop').setDescription('Sends detailed info on a single troop.').addStringOption(option => option.setName('troop-name').setDescription('Ex: barbarian, babydragon').setRequired(true)),
    new SlashCommandBuilder().setName('supertroops').setDescription('Sends a info on all super troops.'),
    new SlashCommandBuilder().setName('super').setDescription('Sends detailed info on a super troop.').addStringOption(option => option.setName('super-troop-name').setDescription('Ex: superarcher, icehound').setRequired(true)),
    new SlashCommandBuilder().setName('spells').setDescription('Sends info on all spells.'),
    new SlashCommandBuilder().setName('spell').setDescription('Sends detailed info on a single spell.').addStringOption(option => option.setName('spell-name').setDescription('Ex: healingspell, skeletonspell').setRequired(true)),
    new SlashCommandBuilder().setName('sieges').setDescription('Sends a info on all siege machines.'),
    new SlashCommandBuilder().setName('siege').setDescription('Sends detailed info on a siege machine.').addStringOption(option => option.setName('siege-machine-name').setDescription('Ex: wallwrecker, siegebarracks').setRequired(true)),
    new SlashCommandBuilder().setName('pets').setDescription('Sends a info on all pets.'),
    new SlashCommandBuilder().setName('pet').setDescription('Sends detailed info on a pet.').addStringOption(option => option.setName('pet-name').setDescription('Ex: lassi, electroowl').setRequired(true)),
]



const rest = new REST({version: '10'}).setToken(token)


//global, takes an hour to register on npm start
rest.put(Routes.applicationCommands(clientID), {body: commands}).then(() => {
    console.log('Commands registered globally.')
}).catch(console.error)


//guild-specific, instantly registers
rest.put(Routes.applicationGuildCommands(clientID, guildID), {body: commands}).then(() => {
    console.log('Commands registered locally.')
}).catch(console.error)



client.once('ready', () => {
    console.log('Blade[⚔] Bot Ready.');
    client.user.setPresence({
        status: "online",
        game: {
            name: "Type /help to see commands.",
            type: "WATCHING"
        }
    })
})


//there isnt too many commands, i found it easier just to keep it all in the index for now
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'search') {
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-name', true)
        const clanname = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans?name=${clanname}`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
            response.data.items.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`${dat.type}`)
                .setImage(dat.badgeUrls.medium)
                .addField("Members", `:members: ${dat.members}`, true)
                .addField("Trophies", `:trophies: ${dat.clanPoints}`, true)
                .addField("Wars", `Won: ${dat.warWins}. Streak: ${dat.warWinStreak}`)
                .addField("CWL", `${dat.warLeague.name}`, true)
                .setColor("GREYPLE")
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        })


    } else if (interaction.commandName === 'clan') {
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
            const embedOne = new MessageEmbed()
            .setTitle(`${response.data.name} ${response.data.tag}`)
            .setDescription(`${response.data.type}`)
            .setImage(response.data.badgeUrls.medium)
            .addField("Members", `:members: ${response.data.members}`, true)
            .addField("Stats", `:trophies: ${response.data.clanPoints}`, true)
            .addField("Wars", `Won: ${response.data.warWins}. Streak: ${response.data.warWinStreak}`)
            .addField("CWL", `${response.data.warLeague.name}`, true)
            .setFooter({text: `Use buttons to navigate through members.`})
            pages.push(embedOne) 
            response.data.memberList.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Lvl: ${dat.expLevel}, Role: ${dat.role}`)
                .setImage(dat.league.iconUrls.medium)
                .addField("Trophies", `:trophies: ${dat.trophies}`, true)
                .addField("Versus Trophies", `:versusTrophies: ${dat.versusTrophies}`, true)
                .addField("Donations", `:donations: ${dat.donations}`)
                .addField("Recieved", `:recieved: ${dat.donationsReceived}`, true)
                .setColor("WHITE")
                .setFooter({text: `Use buttons to navigate through members.`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.reply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`)
        })


    } else if (interaction.commandName === 'warlog') {
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}/warlog?limit=25`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
            response.data.items.map((dat) => {
                console.log(dat)
                const embed = new MessageEmbed()
                .setTitle(`${dat.clan.name} ${dat.clan.tag} -V- ${dat.opponent.name} ${dat.opponent.tag}`)
                .setDescription(`Result: ${dat.result}`)
                .setImage(dat.opponent.badgeUrls.medium)
                .addField("Stars", `:stars: ${dat.clan.stars}`, true)
                .addField("Enemy Stars", `:stars: ${dat.opponent.stars}`, true)
                .addField("Attacks Used", `:attack: ${dat.clan.attacks}`)
                .addField("War Size", `:size: ${dat.teamSize}`, true)
                .addField("Exp Recieved", `:exp: ${dat.clan.expEarned}`, true)
                .setColor(dat.result === "lose" ? "RED" : "GREEN")
                .setFooter({text: `Use buttons to navigate through the war log. Limit past 25 wars.`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.reply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`)
        })


    } else if (interaction.commandName === 'currentwar') {
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}/currentwar`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
                const dat = response.data
                const embed = new MessageEmbed()
                .setTitle(`${dat.clan.name} ${dat.clan.tag} -V- ${dat.opponent.name} ${dat.opponent.tag}`)
                .setDescription(`State: ${dat.state}`)
                .setImage(dat.opponent.badgeUrls.medium)
                .addField("Stars", `:stars: ${dat.clan.stars}`, true)
                .addField("Enemy Stars", `:stars: ${dat.opponent.stars}`, true)
                .addField("Attacks Used", `:attack: ${dat.clan.attacks}`)
                .addField("War Size", `:size: ${dat.teamSize}`, true)
                .setColor("RED")
                .setFooter({text: `Use buttons to navigate through enemies. Use /clan to find your own members.`})
                pages.push(embed) 
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.reply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`)
        })


    } else if (interaction.commandName === 'player') {
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('player-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/players/%23${clantag}`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
                const dat = response.data
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Clan: ${dat.clan.name} ${dat.clan.tag}, ${dat.role}`)
                .setImage(dat.league.iconUrls.medium)
                .addField("Trophies", `:trophies: ${dat.trophies}`, true)
                .addField("Highest Trophies", `:trophies: ${dat.bestTrophies}`, true)
                .addField("Town Hall", `:th${dat.townHallLevel}: ${dat.townHallLevel}`)
                .addField("War Stars", `:stars: ${dat.warStars}`)
                .addField("War Preference", `:war: ${dat.warPreference}`, true)
                .addField("Donations", `:donations: ${dat.donations}`)
                .addField("Received", `:donations: ${dat.donationsReceived}`, true)
                .setColor("PURPLE")
                .setFooter({text: `Use buttons to navigate through troops. Limit to home village only.`})
                pages.push(embed) 
                dat.troops.map((troop) => {
                    if (troop.village == "home") {
                        const embedTwo = new MessageEmbed()
                        .setTitle(`${dat.name} ${dat.tag}`)
                        .setDescription(`Labels: ${dat.labels[0].name}, ${dat.labels[1].name}, ${dat.labels[2].name}`)
                        .addField(`${troop.name}`, `:stars: ${troop.level}`, true)
                        .setColor("PURPLE")
                        .setFooter({text: `Use buttons to navigate through troops. Limit to home village only.`})
                        pages.push(embedTwo) 
                    }
                })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.reply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`)
        })

        
    } else if (interaction.commandName === 'goldpass') {
        const res = await axios.get(`https://api.clashofclans.com/v1/goldpass/seasons/current`, {headers: {Authorization: `Bearer ${key}`}}).then((response) => {
                const dat = response.data
                const endtime = (dat.startTime).split("T")[0]
                const embed = new MessageEmbed()
                .setTitle(`Goldpass`)
                .addField("Ends", `:goldpass: ${endtime}`, true)
                .setColor("PURPLE")
            interaction.reply({embeds: [embed]})
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.reply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`)
        })

        
    } else if (interaction.commandName === 'help') {
        const pagination = new Pagination(interaction);
        
        const embed = new MessageEmbed()
        .setTitle(`/help`)
        .setDescription('Commands:')
        .addField("/search", '/search [clan name] - Searches for your clan by name.', true)
        .addField("/clan", '/search [clan-tag] - Gets all your clan info. Clan tag can be found in /search.', true)
        .addField("/warlog", '/warlog [clan-tag] - Gets your clans previous 25 wars. Clan tag can be found in /search.', true)
        .addField("/currentwar", '/currentwar [clan-tag] - Gets all your info on your clans current war. Clan tag can be found in /search.', true)
        .addField("/player", '/player [player-tag] - Gets all player info and troop levels. Player tag can be found in /clan by navigating.', true)
        .addField("/goldpass", '/goldpass - Gets end date of current season pass.', true)
        .setColor("PURPLE")

        const embedTwo = new MessageEmbed()
        .setTitle(`/help`)
        .setDescription('Commands:')
        .addField("/troops", '/troops - Sends a message with details on all troops.', true)
        .addField("/troop", '/troop [troop-name] - Sends detailed info on a troop.', true)
        .addField("/supertroops", '/supertroops - Sends a message with details on all super troops.', true)
        .addField("/super", '/super [super-troop-name] - Sends detailed info on a super troop.', true)
        .addField("/sieges", '/sieges - Sends a message with details on all siege machines.', true)
        .addField("/siege", '/siege [siege-machine-name] - Sends detailed info on a siege machine.', true)
        .addField("/spells", '/spells - Sends a message with details on all spells.', true)
        .addField("/spell", '/spell [spell-name] - Sends detailed info on a spell.', true)
        .addField("/pets", '/pets - Sends a message with details on all pets.', true)
        .addField("/pet", '/pet [pet-name] - Sends detailed info on a pet.', true)
        .setColor("PURPLE")

        const embedThree = new MessageEmbed()
        .setTitle(`/help`)
        .setDescription('Info:')
        .addField("More info:", "Due to heroes having up to 80 levels; it is nos possible to create embeds for them, as 50 is the page limit on embeds. It would also be somewhat impractical.")
        .addField("API", "All troop and army info is sourced from my api, which is free to use here: https://blade-api.netlify.app/")

        var pages = [embed, embedTwo, embedThree]

        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()

    } else if (interaction.commandName === 'troops') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/troops`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname}`)
                    .setDescription(`Housing: ${troop.housing}, Move Speed: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    troop.levels.map((level) => {
                        if (level.level === 1) {
                            embed.setImage(`${level.img}`)
                        }
                        embed.addField('Level', `${level.level}`)
                        embed.addField('DPS', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            console.log("spec")
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('HP', `${level.hp}`, true)
                    })
                    pages.push(embed)
                }
            })
        }).catch((e) => {
            console.log(e)
        })
        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()


    } else if (interaction.commandName === 'troop') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('troop-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/troop/${troopnamestring}`).then((response) => {
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`Housing: ${response.data.housing}, Move Speed: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    embed.setImage(`${level.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('DPS', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        console.log("spec")
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('HP', `${level.hp}`, true)
                    pages.push(embed)
                })  
            }).catch((e) => {
                console.log(e)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()


    } else if (interaction.commandName === 'spells') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/spells`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname}`)
                    .setColor("PURPLE")
                    embed.setImage(`${troop.image}`)
                    troop.levels.map((level) => {
                        embed.addField('Level', `${level.level}`)
                        embed.addField('DPS', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            console.log("spec")
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('HP', `${level.hp}`, true)
                    })
                    pages.push(embed)
                }
            })
        }).catch((e) => {
            console.log(e)
        })
        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()


    } else if (interaction.commandName === 'spell') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('spell-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/spell/${troopnamestring}`).then((response) => {
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setColor("PURPLE")
                    embed.setImage(`${response.data.image}`)
                    embed.addField('Level', `${level.level}`)
                    if (response.data.spec != null) {
                        console.log("spec")
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    pages.push(embed)
                })  
            }).catch((e) => {
                console.log(e)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()


    } else if (interaction.commandName === 'pets') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/pets`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname}`)
                    .setDescription(`Housing: ${troop.housing}, Move Speed: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${troop.img}`)
                    troop.levels.map((level) => {
                        embed.addField('Level', `${level.level}`)
                        embed.addField('DPS', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            console.log("spec")
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('HP', `${level.hp}`, true)
                    })
                    pages.push(embed)
                }
            })
        }).catch((e) => {
            console.log(e)
        })
        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()


    } else if (interaction.commandName === 'pet') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('pet-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/pet/${troopnamestring}`).then((response) => {
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`Housing: ${response.data.housing}, Move Speed: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${response.data.ability}`, `${response.data.abilityStats}`)
                    embed.setImage(`${response.data.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('DPS', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        console.log("spec")
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('HP', `${level.hp}`, true)
                    pages.push(embed)
                })  
            }).catch((e) => {
                console.log(e)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()


    }  else if (interaction.commandName === 'sieges') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/sieges`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname}`)
                    .setDescription(`Housing: ${troop.housing}, Move Speed: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    troop.levels.map((level) => {
                        if (level.level === 4) {
                            embed.setImage(`${level.img}`)
                        }
                        embed.addField('Level', `${level.level}`)
                        embed.addField('DPS', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            console.log("spec")
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('HP', `${level.hp}`, true)
                    })
                    pages.push(embed)
                }
            })
        }).catch((e) => {
            console.log(e)
        })
        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()


    } else if (interaction.commandName === 'siege') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('siege-machine-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/siege/${troopnamestring}`).then((response) => {
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`Housing: ${response.data.housing}, Move Speed: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${level.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('DPS', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        console.log("spec")
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('HP', `${level.hp}`, true)
                    pages.push(embed)
                })  
            }).catch((e) => {
                console.log(e)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()


    }  else if (interaction.commandName === 'supertroops') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/supers`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname}`)
                    .setDescription(`Housing: ${troop.housing}, Move Speed: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${troop.img}`)
                    troop.levels.map((level) => {
                        embed.addField('Level', `${level.level}`)
                        embed.addField('DPS', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            console.log("spec")
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('HP', `${level.hp}`, true)
                    })
                    pages.push(embed)
                }
            })
        }).catch((e) => {
            console.log(e)
        })
        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()


    } else if (interaction.commandName === 'super') {
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('super-troop-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/super/${troopnamestring}`).then((response) => {
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`Housing: ${response.data.housing}, Move Speed: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${troop.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('DPS', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        console.log("spec")
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('HP', `${level.hp}`, true)
                    pages.push(embed)
                })  
            }).catch((e) => {
                console.log(e)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
    }

})


client.login(token);