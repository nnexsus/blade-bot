const { token, key } = require('./config.json');
const { Client, Intents, MessageAttachment, MessageEmbed, MessageButton } = require('discord.js');
const { default: axios } = require('axios');
const { Pagination } = require('pagination.djs');

const client = new Client({intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"]})

client.once('ready', () => {
    console.log('Bot Ready.');
    client.user.setPresence({
        status: "online",
        game: {
            name: "Type /help to see commands.",
            type: "WATCHING"
        }
    })
})

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

        
    } else if (interaction.commandName === 'troops') {
            const embed = new MessageEmbed()
            .setTitle(`Troop`)
            .addField("Link to database: ", `https://clashofclans.fandom.com/wiki/Army`, true)
            .setColor("ORANGE")
        interaction.reply({embeds: [embed]})


    } else if (interaction.commandName === 'help') {
        const embed = new MessageEmbed()
        .setTitle(`/help`)
        .setDescription('Commands:')
        .addField("/search", '/search [clan name] - Searches for your clan by name.', true)
        .addField("/clan", '/search [clan-tag] - Gets all your clan info. Clan tag can be found in /search.', true)
        .addField("/warlog", '/warlog [clan-tag] - Gets your clans previous 25 wars. Clan tag can be found in /search.', true)
        .addField("/currentwar", '/currentwar [clan-tag] - Gets all your info on your clans current war. Clan tag can be found in /search.', true)
        .addField("/player", '/player [player-tag] - Gets all player info and troop levels. Player tag can be found in /clan by navigating.', true)
        .addField("/goldpass", '/goldpass - Gets end date of current season pass.', true)
        .addField("/troops", '/troops - Sends a link to the Clash of Clans troop wiki database.', true)
        .setColor("PURPLE")
    interaction.reply({embeds: [embed]})
    }

})


client.login(token);