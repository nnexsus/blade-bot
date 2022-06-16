const { clientID, guildID } = require('./config.json');
const { Client, Intents, MessageAttachment, MessageEmbed, MessageButton } = require('discord.js');
const { default: axios } = require('axios');
const { Pagination } = require('pagination.djs');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const dotenv = require('dotenv');


const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

const ids = {
    "townhall": [
        {"name": "th1", "id": "986442086356238407"}, {"name": "th2", "id": "986442085521567765"}, {"name": "th3", "id": "986442084577861712"}, {"name": "th4", "id": "986442082996592751"},
        {"name": "th5", "id": "986442082216456233"}, {"name": "th6", "id": "986442081604100096"}, {"name": "th7", "id": "986442080417112094"}, {"name": "th8", "id": "986442079125254164"},
        {"name": "th9", "id": "986442077887946774"}, {"name": "th10", "id": "986442077359472701"}, {"name": "th11", "id": "986442076197638164"}, {"name": "th12", "id": "986442075308449813"},
        {"name": "th13", "id": "986442074410848276"}, {"name": "th14", "id": "986442073454575647"}
    ],
    "label": [
        {"name": "Clan Wars", "nameid": "ClanWars", "id": "986754361826897982", "no": 0}, {"name": "Clan War League", "nameid": "ClanWarLeague", "id": "986754359490646046", "no": 1}, {"name": "Trophy Pushing", "nameid": "TrophyPushing", "id": "986754357691293706", "no": 2},
        {"name": "Friendly Wars", "nameid": "FriendlyWars", "id": "986754356869222400", "no": 3}, {"name": "Clan Games", "nameid": "ClanGames", "id": "986754358597275698", "no": 4}, {"name": "Builder Base", "nameid": "BuilderBase", "id": "986757742498828358", "no": 5},
        {"name": "Base Designing", "nameid": "BaseDesigning", "id": "986758033940033557", "no": 6}, {"name": "International", "nameid": "International", "id": "986754365614333952", "no": 7}, {"name": "Farming", "nameid": "Farming", "id": "986754356097478676", "no": 8},
        {"name": "Donations", "nameid": "Donations", "id": "986754361382281296", "no": 9}, {"name": "Friendly", "nameid": "Friendly", "id": "986754364800643132", "no": 10}, {"name": "Talkative", "nameid": "Talkative", "id": "986754363638808647", "no": 11},
        {"name": "Underdog", "nameid": "Underdog", "id": "986758301448568843", "no": 12}, {"name": "Relaxed", "nameid": "Relaxed", "id": "986754355262791700", "no": 13}, {"name": "Competitive", "nameid": "Competitive", "id": "986754354222616626", "no": 14},
        {"name": "Newbie Friendly", "nameid": "Newbie", "id": "986754363080978492", "no": 15}, {"name": "Clan Capital", "nameid": "CapitalHall", "id": "986754360400838766", "no": 16},
    ],
    "playerlabel": [
        {"name": "Clan Wars", "nameid": "ClanWars", "id": "986754361826897982", "no": 0}, {"name": "Clan War League", "nameid": "ClanWarLeague", "id": "986754359490646046", "no": 1}, {"name": "Trophy Pushing", "nameid": "TrophyPushing", "id": "986754357691293706", "no": 2},
        {"name": "Friendly Wars", "nameid": "FriendlyWars", "id": "986754356869222400", "no": 3}, {"name": "Clan Games", "nameid": "ClanGames", "id": "986754358597275698", "no": 4}, {"name": "Builder Base", "nameid": "BuilderBase", "id": "986757742498828358", "no": 5},
        {"name": "Base Designing", "nameid": "BaseDesigning", "id": "986758033940033557", "no": 6}, {"name": "Farming", "nameid": "Farming", "id": "986754356097478676", "no": 7}, {"name": "Farming", "nameid": "Farming", "id": "986754364800643132", "no": 8},
        {"name": "Active Daily", "nameid": "ActiveDaily", "id": "986767102197252167", "no": 9}, {"name": "Hungry Learner", "nameid": "HungryLearner", "id": "986770709630038136", "no": 10}, {"name": "Friendly", "nameid": "Friendly", "id": "986754363638808647", "no": 11},
        {"name": "Talkative", "nameid": "Talkative", "id": "986754363638808647", "no": 12}, {"name": "Teacher", "nameid": "Teacher", "id": "986770591082229770", "no": 13}, {"name": "Competitive", "nameid": "Competitive", "id": "986754354222616626", "no": 14},
        {"name": "Veteran", "nameid": "Veteran", "id": "986754352985288715", "no": 15}, {"name": "Clan Capital", "nameid": "CapitalHall", "id": "986754360400838766", "no": 16}, {"name": "Amateur Attacker", "nameid": "AmateurAttacker", "id": "986767299644121158", "no": 17},
        {"name": "Clan Capital", "nameid": "CapitalHall", "id": "986754360400838766", "no": 18},
    ]
}

const commands = [
    new SlashCommandBuilder().setName('search').setDescription('Search for your clan by name.').addStringOption(option => option.setName('clan-name').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('clan').setDescription('Gets your clan and clanmates profiles.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('warlog').setDescription("Gets war log info from a clan.").addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('currentwar').setDescription('Gets info on your clans current war.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('player').setDescription("Gets player info.").addStringOption(option => option.setName('player-tag').setDescription('Ex: #8YQ9LC2QU').setRequired(true)),
    new SlashCommandBuilder().setName('help').setDescription('Lists all commands and syntaxes.'),
    new SlashCommandBuilder().setName('troops').setDescription('Sends info on all regular troops.'),
    new SlashCommandBuilder().setName('troop').setDescription('Sends detailed info on a single troop.').addStringOption(option => option.setName('troop-name').setDescription('Ex: barbarian, babydragon').setRequired(true)),
    new SlashCommandBuilder().setName('supertroops').setDescription('Sends a info on all super troops.'),
    new SlashCommandBuilder().setName('super').setDescription('Sends detailed info on a super troop.').addStringOption(option => option.setName('super-troop-name').setDescription('Ex: superarcher, icehound').setRequired(true)),
    new SlashCommandBuilder().setName('spells').setDescription('Sends info on all spells.'),
    new SlashCommandBuilder().setName('spell').setDescription('Sends detailed info on a single spell.').addStringOption(option => option.setName('spell-name').setDescription('Ex: healspell, skeletonspell').setRequired(true)),
    new SlashCommandBuilder().setName('sieges').setDescription('Sends a info on all siege machines.'),
    new SlashCommandBuilder().setName('siege').setDescription('Sends detailed info on a siege machine.').addStringOption(option => option.setName('siege-machine-name').setDescription('Ex: wallwrecker, siegebarracks').setRequired(true)),
    new SlashCommandBuilder().setName('pets').setDescription('Sends a info on all pets.'),
    new SlashCommandBuilder().setName('pet').setDescription('Sends detailed info on a pet.').addStringOption(option => option.setName('pet-name').setDescription('Ex: lassi, electroowl').setRequired(true)),
    new SlashCommandBuilder().setName('patch').setDescription('Sends detailed info the last patchnotes for Clash of Clans.')
]

dotenv.config()

const rest = new REST({version: '10'}).setToken(process.env.BOT_KEY)


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


//there isnt that many commands, im lazy so its easier just to keep it all in the index for now
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'search') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-name', true)
        const clanname = clan.value.toString()

        if (clanname.length < 3 || clanname.length > 34) {
            interaction.editReply("Clan names must be between 3-24 characters long.")
            return
        }

        const res = await axios.get(`https://api.clashofclans.com/v1/clans?name=${clanname}`, {headers: {Authorization: `Bearer ${process.env.CLASH_KEY}`}}).then((response) => {
            response.data.items.map((dat) => {
                console.log(dat.name, dat.tag)
                const th = ids.townhall.at((dat.requiredTownhallLevel) - 1)
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`${dat.type}`)
                .setImage(dat.badgeUrls.medium)
                .addField("Members", `<:housing:986457789822042155> ${dat.members}`, true)
                .addField("Trophies", `<:trophies:986457790375661619> ${dat.clanPoints}`, true)
                .addField("Versus Trophies", `<:versus_trophies:986466804635402240> ${dat.clanVersusPoints}`, true)
                .addField("Type", `${dat.type}`, true)
                .addField("Required Trophies", `<:trophies:986457790375661619> ${dat.requiredTrophies}, <:versus_trophies:986466804635402240> ${dat.requiredVersusTrophies}`, true)
                .addField("Minimum TH Level", `<:${th.name}:${th.id}> ${dat.requiredTownhallLevel}`, true)
                .addField("Wars", `Won: ${dat.warWins}. Streak: ${dat.warWinStreak}`, true)
                .addField("War Frequency", `${dat.warFrequency}`, true)
                .addField("CWL", `${dat.warLeague.name}`, true)
                .setColor("BLURPLE")
                .setFooter({text: `Requested by ${interaction.user.username + "#" + interaction.user.discriminator}`})

                dat.labels.map((label) => {
                    const labelid = label.id.toString()
                    const labelemote = ids.label.at(labelid.slice(-2))
                    embed.addField(`${label.name}`, `<:${labelemote.nameid}:${labelemote.id}>`, true)
                })

                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.editReply("Error finding searched clan", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'clan') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()

        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}`, {headers: {Authorization: `Bearer ${process.env.CLASH_KEY}`}}).then((response) => {
            const th = ids.townhall.at((response.data.requiredTownhallLevel) - 1)
            const embedOne = new MessageEmbed()
            .setTitle(`${response.data.name} ${response.data.tag}`)
            .setDescription(`${response.data.description}`)
            .setImage(response.data.badgeUrls.medium)
            .addField("Members", `<:housing:986457789822042155> ${response.data.members}`, true)
            .addField("Trophies", `<:trophies:986457790375661619> ${response.data.clanPoints}`, true)
            .addField("Versus Trophies", `<:versus_trophies:986466804635402240> ${response.data.clanVersusPoints}`, true)
            .addField("Type", `${response.data.type}`, true)
            .addField("Required Trophies", `<:trophies:986457790375661619> ${response.data.requiredTrophies}, <:versus_trophies:986466804635402240> ${response.data.requiredVersusTrophies}`, true)
            .addField("Minimum TH Level", `<:${th.name}:${th.id}> ${response.data.requiredTownhallLevel}`, true)
            .addField("Wars", `Won: ${response.data.warWins}. Streak: ${response.data.warWinStreak}`, true)
            .addField("War Frequency", `${response.data.warFrequency}`, true)
            .addField("CWL", `${response.data.warLeague.name}`, true)
            .setColor("WHITE")
            .setFooter({text: `Use buttons to navigate through members.`})

            response.data.labels.map((label) => {
                const labelid = label.id.toString()
                const labelemote = ids.label.at(labelid.slice(-2))
                embedOne.addField(`${label.name}`, `<:${labelemote.nameid}:${labelemote.id}>`, true)
            })

            pages.push(embedOne) 
            response.data.memberList.map((dat) => {
                console.log(dat.name, dat.tag)
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Role: ${dat.role}`)
                .setImage(dat.league.iconUrls.medium)
                .addField("Level", `<:clanxp:986457784956641283> ${dat.expLevel}`, true)
                .addField("Trophies", `<:trophies:986457790375661619> ${dat.trophies}`, true)
                .addField("Versus Trophies", `<:versus_trophies:986466804635402240> ${dat.versusTrophies}`, true)
                .addField("Rank", `<:clanxp:986457784956641283> ${dat.clanRank}`, true)
                .addField("Donations", `<:donation:986457784319115347> ${dat.donations}`, true)
                .addField("Recieved", `<:donation:986457784319115347> ${dat.donationsReceived}`, true)
                .setColor(dat.role == "leader" ? "GOLD" : 
                          dat.role == "coLeader" ? "ORANGE" : 
                          dat.role == "admin" ? "DARK_GOLD" : "DARK_BLUE" )
                .setFooter({text: `Use buttons to navigate through members.`})
                pages.push(embed) 
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.editReply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`, {"ephemeral": true})
            return
        })


    } else if (interaction.commandName === 'warlog') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}/warlog?limit=25`, {headers: {Authorization: `Bearer ${process.env.CLASH_KEY}`}}).then((response) => {
            response.data.items.map((dat) => {
                const embed = new MessageEmbed()
                .setTitle(`${dat.clan.name} ${dat.clan.tag} -V- ${dat.opponent.name} ${dat.opponent.tag}`)
                .setDescription(`Result: ${dat.result}`)
                .setImage(dat.opponent.badgeUrls.medium)
                .addField("Stars", `<:cocstar:986458042507878450> ${dat.clan.stars}`, true)
                .addField("Attacks Used", `<:damage:986457786491736198> ${dat.clan.attacks}`, true)
                .addField("Destruction %", `<:damage:986457786491736198> ${dat.clan.destructionPercentage}`, true)
                .addField("Enemy Stars", `<:cocstar:986458042507878450> ${dat.opponent.stars}`, true)
                .addField("Enemy Attacks Used", `<:damage:986457786491736198> ${dat.opponent.attacks}`, true)
                .addField("Enemy Destruction %", `<:damage:986457786491736198> ${dat.opponent.destructionPercentage}`, true)
                .addField("War Size", `<:housing:986457789822042155> ${dat.teamSize}`, true)
                .addField("Exp Recieved", `<:clanxp:986457784956641283> ${dat.clan.expEarned}`, true)
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
            interaction.editReply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`, {"ephemeral": true})
            return
        })


    } else if (interaction.commandName === 'currentwar') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('clan-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/clans/%23${clantag}/currentwar`, {headers: {Authorization: `Bearer ${process.env.CLASH_KEY}`}}).then((response) => {
            if (response.data.state !== 'notInWar') {
                const dat = response.data
                const embed = new MessageEmbed()
                .setTitle(`${dat.clan.name} ${dat.clan.tag} -V- ${dat.opponent.name} ${dat.opponent.tag}`)
                .setDescription(`State: ${dat.state}`)
                .setImage(dat.opponent.badgeUrls.medium)
                .addField("Stars", `<:cocstar:986458042507878450> ${dat.clan.stars}`, true)
                .addField("Attacks Used", `<:damage:986457786491736198> ${dat.clan.attacks}`, true)
                .addField("Destruction %", `<:damage:986457786491736198> ${dat.clan.destructionPercentage}`, true)
                .addField("Enemy Stars", `<:cocstar:986458042507878450> ${dat.opponent.stars}`, true)
                .addField("Enemy Attacks Used", `<:damage:986457786491736198> ${dat.opponent.attacks}`, true)
                .addField("Enemy Destruction %", `<:damage:986457786491736198> ${dat.opponent.destructionPercentage}`, true)
                .addField("War Size", `<:housing:986457789822042155> ${dat.teamSize}`, true)
                .setColor(dat.state == "inWar" ? "RED" : "DARK_RED")
                .setFooter({text: `Use buttons to navigate through enemies. Use /clan to find your own members.`})
                pages.push(embed)
                dat.opponent.members.map((member) => {
                    const th = ids.townhall.at((member.townhallLevel) - 1)
                    const embedTwo = new MessageEmbed()
                    .setTitle(`${member.name} ${member.tag}`)
                    .setDescription(`Clan: ${member.name} ${member.tag}`)
                    .setImage(`https://www.clashtrack.com/img/buildings/town_hall_${member.townhallLevel}.png`)
                    .addField("Town Hall", `<:${th.name}:${th.id}> ${member.townhallLevel}`, true)
                    .addField("Position", `<:housing:986457789822042155> ${member.mapPosition}`, true)
                    .addField("Attacks Used", `<:damage:986457786491736198> ${member.opponentAttacks}`, true)
                    .setColor("RED")
                    .setFooter({text: `Use buttons to navigate through enemies. Use /clan to find your own members.`})
                    pages.push(embedTwo)
                })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
            return
            } else {
                const dat = response.data
                const embed = new MessageEmbed()
                .setTitle(`${dat.clan.name} ${dat.clan.tag} -V- ${dat.opponent.name} ${dat.opponent.tag}`)
                .setDescription(`State: ${dat.state}`)
                .setImage(dat.opponent.badgeUrls.medium)
                .addField("Stars", `<:cocstar:986458042507878450> ${dat.clan.stars}`, true)
                .addField("Attacks Used", `<:damage:986457786491736198> ${dat.clan.attacks}`, true)
                .addField("Destruction %", `<:damage:986457786491736198> ${dat.clan.destructionPercentage}`, true)
                .addField("Enemy Stars", `<:cocstar:986458042507878450> ${dat.opponent.stars}`, true)
                .addField("Enemy Attacks Used", `<:damage:986457786491736198> ${dat.opponent.attacks}`, true)
                .addField("Enemy Destruction %", `<:damage:986457786491736198> ${dat.opponent.destructionPercentage}`, true)
                .addField("War Size", `<:housing:986457789822042155> ${dat.teamSize}`, true)
                .setColor("RED")
                .setFooter({text: `Use buttons to navigate through enemies. Use /clan to find your own members.`})
                interaction.editReply({"ephemeral": true, "embeds": [embed]})
            }
        }).catch((e) => {
            console.log(e)
            console.log(e.response.data.reason)
            interaction.editReply(`Failed. ${e.response.data.reason}. Note: you do not need to use hashtags (#) in your tags.`, {"ephemeral": true})
            return
        })


    } else if (interaction.commandName === 'player') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);

        const pages = []

        const clan = await interaction.options.get('player-tag', true)
        const clantag = clan.value.toString()
        const res = await axios.get(`https://api.clashofclans.com/v1/players/%23${clantag}`, {headers: {Authorization: `Bearer ${process.env.CLASH_KEY}`}}).then((response) => {
                const dat = response.data
                const th = ids.townhall.at((dat.townHallLevel) - 1)
                const embed = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Clan: ${dat.clan.name} ${dat.clan.tag}, ${dat.role}`)
                .setImage(dat.league != null ? dat.league.iconUrls.medium : `https://www.clashtrack.com/img/buildings/town_hall_${dat.townHallLevel}.png`)
                .addField("Trophies", `<:trophies:986457790375661619> ${dat.trophies}`, true)
                .addField("Highest Trophies", `<:trophies:986457790375661619> ${dat.bestTrophies}`, true)
                .addField("Level", `<:clanxp:986457784956641283> ${dat.expLevel}`, true)
                .addField("Town Hall", `<:${th.name}:${th.id}> ${dat.townHallLevel}`, true)
                .addField("War Stars", `<:cocstar:986458042507878450> ${dat.warStars}`, true)
                .addField("War Preference", `<:damage:986457786491736198> ${dat.warPreference}`, true)
                .addField("Builder Hall", `<:clanxp:986457784956641283> ${dat.builderHallLevel}`, true)
                .addField("Donations", `<:donation:986457784319115347> ${dat.donations}`, true)
                .addField("Received", `<:donation:986457784319115347> ${dat.donationsReceived}`, true)
                .setColor("WHITE")
                .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})

                dat.labels.map((label) => {
                    const labelid = label.id.toString()
                    const labelemote = ids.playerlabel.at(labelid.slice(-2))
                    embed.addField(`${label.name}`, `<:${labelemote.nameid}:${labelemote.id}>`, true)
                })
                
                pages.push(embed) 

                const embedTwo = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Troops`)
                .setColor("ORANGE")
                .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                //it looks awful but because things arent in order i have to put this ugly lookin if statement
                dat.troops.map((troop, index) => { 
                    if (troop.village == "home" && (troop.name !== "Super Barbarian" && troop.name != "Super Archer" && troop.name != "Super Giant" && troop.name != "Super Wall Breaker" && troop.name != "Sneaky Goblin"
                    && troop.name != "Rocket Balloon" && troop.name != "Super Wizard" && troop.name != "Super Dragon" && troop.name != "Inferno Dragon" && troop.name != "Super Minion" && troop.name != "Super Valkyrie" && troop.name != "Super Witch"
                    && troop.name != "Ice Hound" && troop.name != "Super Bowler" && troop.name != "Super Wall Breaker" && troop.name != "Wall Wrecker" && troop.name != "Log Launcher" && troop.name != "Battle Blimp"
                    && troop.name != "Stone Slammer" && troop.name != "Flame Flinger" && troop.name != "Siege Barracks")) {
            
                        embedTwo.addField(`${troop.name}`, `<:clanxp:986457784956641283> ${troop.level} / ${troop.maxLevel}`, true)
                        
                    }
                })
                pages.push(embedTwo) 

                if (dat.townHallLevel >= 11) {
                    const embedTwoHalf = new MessageEmbed()
                    .setTitle(`${dat.name} ${dat.tag}`)
                    .setDescription(`Troops 2`)
                    .setColor("DARK_ORANGE")
                    .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                    dat.troops.map((troop, index) => {
                        if (troop.village == "home" && (troop.name == "Super Barbarian" || troop.name == "Super Archer" || troop.name == "Super Giant" || troop.name == "Super Wall Breaker" || troop.name == "Sneaky Goblin"
                        || troop.name == "Rocket Balloon" || troop.name == "Super Wizard" || troop.name == "Super Dragon" || troop.name == "Inferno Dragon" || troop.name == "Super Minion" || troop.name == "Super Valkyrie" || troop.name == "Super Witch"
                        || troop.name == "Ice Hound" || troop.name == "Super Bowler" || troop.name == "Super Wall Breaker")) {
                
                            embedTwoHalf.addField(`${troop.name}`, `<:clanxp:986457784956641283> ${troop.level} / ${troop.maxLevel}`, true)
                            
                        }
                    })
                    pages.push(embedTwoHalf) 
                }

                if (dat.townHallLevel >= 12) {
                    const embedTwoThird = new MessageEmbed()
                    .setTitle(`${dat.name} ${dat.tag}`)
                    .setDescription(`Troops 3`)
                    .setColor("DARK_RED")
                    .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                    dat.troops.map((troop, index) => {
                        if (troop.name == "Wall Wrecker" || troop.name == "Log Launcher" || troop.name == "Battle Blimp" || troop.name == "Stone Slammer" || troop.name == "Flame Flinger" || troop.name == "Siege Barracks") {
                
                            embedTwoThird.addField(`${troop.name}`, `<:clanxp:986457784956641283> ${troop.level} / ${troop.maxLevel}`, true)
                            
                        }
                    })
                    pages.push(embedTwoThird) 
                }
                
                if (dat.townHallLevel >= 6) {
                    const embedThree = new MessageEmbed()
                    .setTitle(`${dat.name} ${dat.tag}`)
                    .setDescription(`Heroes`)
                    .setColor("PURPLE")
                    .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                    dat.heroes.map((hero) => {
                        if (hero.village == "home") {
                
                            embedThree.addField(`${hero.name}`, `<:clanxp:986457784956641283> ${hero.level} / ${hero.maxLevel}`, true)
    
                        }
                    })
                    pages.push(embedThree)
                }


                const embedFour = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Spells`)
                .setColor("DARK_PURPLE")
                .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                dat.spells.map((spell) => {
                    if (spell.village == "home") {
            
                        embedFour.addField(`${spell.name}`, `<:clanxp:986457784956641283> ${spell.level} / ${spell.maxLevel}`, true)
                        
                    }
                })
                pages.push(embedFour) 

                const embedFive = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Achievements`)
                .setColor("GOLD")
                .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                dat.achievements.map((achievement) => {
                    if (achievement.village == "home" && achievement.completionInfo !== null) {
                        
                        embedFive.addField(`${achievement.name}`, `${achievement.completionInfo}`, true)
                        
                    }
                })
                pages.push(embedFive) 

                const embedSix = new MessageEmbed()
                .setTitle(`${dat.name} ${dat.tag}`)
                .setDescription(`Capital Peak Progess`)
                .setColor("BLUE")
                .setFooter({text: `Use buttons to navigate through troops, heroes, spells, achievements, and capital progress. Limit to home village only.`})
                const mvc = dat.achievements.at(-1)
                const ac = dat.achievements.at(-2)

                embedSix.addField(`${mvc.name}`, `${mvc.completionInfo}`, true)
                embedSix.addField(`${ac.name}`, `${ac.completionInfo}`, true)
                
                pages.push(embedSix)

            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            console.log(e)
            interaction.editReply(`Failed. Note: you do not need to use hashtags (#) in your tags.`, {"ephemeral": true})
            return
        })

        
    } else if (interaction.commandName === 'help') {
        const pagination = new Pagination(interaction);
        
        const embed = new MessageEmbed()
        .setTitle(`<:info:986457785950695524> /help`)
        .setDescription('Commands:')
        .addField("/search", '/search [clan name] - Searches for your clan by name.', true)
        .addField("/clan", '/search [clan-tag] - Gets all your clan info. Clan tag can be found in /search.', true)
        .addField("/warlog", '/warlog [clan-tag] - Gets your clans previous 25 wars. Clan tag can be found in /search.', true)
        .addField("/currentwar", '/currentwar [clan-tag] - Gets all your info on your clans current war. Clan tag can be found in /search.', true)
        .addField("/player", '/player [player-tag] - Gets all player info and troop levels. Player tag can be found in /clan by navigating.', true)
        .addField("/patch", '/patch - Returns the most recent Clash of Clans balances and patchnotes.', true)
        .setColor("BLUE")

        const embedTwo = new MessageEmbed()
        .setTitle(`<:info:986457785950695524> /help`)
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
        .setColor("DARK_BLUE")

        const embedThree = new MessageEmbed()
        .setTitle(`<:info:986457785950695524> /help`)
        .setDescription('Info:')
        .addField("More info:", "Due to heroes having up to 80 levels; it is not possible to create embeds for them, as 50 is the page limit on embeds. It would also be somewhat impractical.")
        .addField("API", "All troop and army info is sourced from my api, which is free to use here: https://blade-api.netlify.app/")
        .setColor("PURPLE")

        var pages = [embed, embedTwo, embedThree]

        pagination.setEmbeds(pages)
        pagination.setAuthorizedUsers([])
        pagination.render()

    } else if (interaction.commandName === 'troops') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/troops`).then((response) => {
            response.data.map((troop) => {
                if (troop.housing > 0) {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname} - ${troop.name}`)
                    .setDescription(`<:housing:986457789822042155>: ${troop.housing}, <:speed:986457788484042862>: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                        const level = troop.levels.at(-1)
                        embed.setImage(`${level.img}`)
                        embed.addField('Level', `${level.level}`)
                        embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
                }
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.reply("Error fetching troops. Please try again later.", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'troop') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('troop-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/troop/${troopnamestring}`).then((response) => {
            if (response.data.levels == null) {
                interaction.editReply("Error finding troop. Be sure there are no spaces in your search, ex. 'hogrider'.", {"ephemeral": true})
                return
            };
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`<:housing:986457789822042155>: ${response.data.housing}, <:speed:986457788484042862>: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    embed.setImage(`${level.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
                })  
                pagination.setEmbeds(pages)
                pagination.setAuthorizedUsers([])
                pagination.render()
            }).catch((e) => {
                interaction.reply("Error finding troop. Be sure there are no spaces in your search, ex. 'hogrider'.", {"ephemeral": true})
                console.log(e)
                return
            })


    } else if (interaction.commandName === 'spells') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/spells`).then((response) => {
            response.data.map((troop) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname} - ${troop.name}`)
                    .setColor("PURPLE")
                    embed.setImage(`${troop.image}`)
                            const level = troop.levels.at(-1)
                            embed.addField('Level', `${level.level}`)
                            if (level.dps != null) {
                                embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                            }
                            if (level.dpa != null) {
                                embed.addField('DPA', `${level.dpa}`, true)
                            }
                            if (troop.spec != null) {
                                embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                            }
                        pages.push(embed)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.reply("Error fetching spells. Please try again later.", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'spell') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('spell-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/spell/${troopnamestring}`).then((response) => {
            if (response.data.levels == null) {
                interaction.editReply("Error finding spell. Be sure to include spell in the name, ex. 'hastespell'.", {"ephemeral": true})
                return
            };
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setColor("PURPLE")
                    embed.setImage(`${response.data.image}`)
                    embed.addField('Level', `${level.level}`)
                    if (level.dps != null) {
                        embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                    }
                    if (level.dpa != null) {
                        embed.addField('DPA', `${level.dpa}`, true)
                    }
                    if (response.data.spec != null) {
                        embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                    }
                    pages.push(embed)
                })
                pagination.setEmbeds(pages)
                pagination.setAuthorizedUsers([])
                pagination.render()  
            }).catch((e) => {
                interaction.reply("Error finding spell. Be sure to include spell in the name, ex. 'hastespell'.", {"ephemeral": true})
                console.log(e)
                return
            })


    } else if (interaction.commandName === 'pets') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/pets`).then((response) => {
            response.data.map((troop) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname} - ${troop.name}`)
                    .setDescription(`<:speed:986457788484042862>: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${troop.img}`)
                            const level = troop.levels.at(-1)
                            embed.addField('Level', `${level.level}`)
                            embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                            embed.addField('DPA', `${level.dpa}`, true)
                            if (troop.spec != null) {
                                embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                            }
                            if (level.hps != null) {
                                embed.addField('Healing Per Second', `${level.hps}`, true)
                            }
                            if (level.hpp != null) {
                                embed.addField('Healing Per Pulse', `${level.hpp}`, true)
                            }
                            embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                        pages.push(embed)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.reply("Error fetching pets. Please try again later.", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'pet') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('pet-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/pet/${troopnamestring}`).then((response) => {
            if (response.data.levels == null) {
                interaction.editReply("Error finding pet. Be sure there are no spaces, ex. 'electroowl'.", {"ephemeral": true})
                return
            };
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`<:speed:986457788484042862>: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${response.data.ability}`, `${response.data.abilityStats}`)
                    embed.setImage(`${response.data.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    if (level.hps != null) {
                        embed.addField('Healing Per Second', `${level.hps}`, true)
                    }
                    if (level.hpp != null) {
                        embed.addField('Healing Per Pulse', `${level.hpp}`, true)
                    }
                    embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
                })
                pagination.setEmbeds(pages)
                pagination.setAuthorizedUsers([])
                pagination.render()  
            }).catch((e) => {
                interaction.reply("Error finding pet. Be sure there are no spaces, ex. 'electroowl'.", {"ephemeral": true})
                console.log(e)
                return
            })


    }  else if (interaction.commandName === 'sieges') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/sieges`).then((response) => {
            response.data.map((troop) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname} - ${troop.name}`)
                    .setDescription(`<:speed:986457788484042862>: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                            const level = troop.levels.at(-1)
                            embed.setImage(`${level.img}`)
                            embed.addField('Level', `${level.level}`)
                            embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                            embed.addField('DPA', `${level.dpa}`, true)
                            if (troop.spec != null) {
                                embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                            }
                            embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                        pages.push(embed)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.reply("Error fetching Siege Machines. Please try again later.", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'siege') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('siege-machine-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/siege/${troopnamestring}`).then((response) => {
            if (response.data.levels == null) {
                interaction.editReply("Error finding Siege Machine. Make sure there are no spaces, ex. 'loglauncher'.", {"ephemeral": true})
                return
            };
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`<:speed:986457788484042862>: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${level.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
                })  
                pagination.setEmbeds(pages)
                pagination.setAuthorizedUsers([])
                pagination.render()    
            }).catch((e) => {
                interaction.reply("Error finding Siege Machine. Make sure there are no spaces, ex. 'loglauncher'.", {"ephemeral": true})
                console.log(e)
                return
            })


    }  else if (interaction.commandName === 'supertroops') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/supers`).then((response) => {
            response.data.map((troop) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${troop.formalname} - ${troop.name}`)
                    .setDescription(`<:housing:986457789822042155>: ${troop.housing}, <:speed:986457788484042862>: ${troop.movespeed}, Attack Speed: ${troop.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${troop.ability}`, `${troop.abilityStats}`)
                    embed.setImage(`${troop.img}`)
                        const level = troop.levels.at(-1)
                        embed.addField('Level', `${level.level}`)
                        embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                        embed.addField('DPA', `${level.dpa}`, true)
                        if (troop.spec != null) {
                            embed.addField(`${troop.spec}`, `${level.dpd}`, true)
                        }
                        embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
            })
            pagination.setEmbeds(pages)
            pagination.setAuthorizedUsers([])
            pagination.render()
        }).catch((e) => {
            interaction.reply("Error fetching super troops, please try again later.", {"ephemeral": true})
            console.log(e)
            return
        })


    } else if (interaction.commandName === 'super') {
        await interaction.deferReply();
        const pagination = new Pagination(interaction);
        var pages = []
        const troopname = await interaction.options.get('super-troop-name', true)
        const troopnamestring = troopname.value.toString()
        const troops = await axios.get(`https://clash-database-api.herokuapp.com/api/super/${troopnamestring}`).then((response) => {
            if (response.data.levels == null) {
                interaction.editReply("Error finding super troop. Make sure to include 'super' in the name, ex. 'superbarbarian'.", {"ephemeral": true})
                return
            };
                response.data.levels.map((level) => {
                    const embed = new MessageEmbed()
                    .setTitle(`${response.data.formalname}`)
                    .setDescription(`<:housing:986457789822042155>: ${response.data.housing}, <:speed:986457788484042862>: ${response.data.movespeed}, Attack Speed: ${response.data.attackspeed}`)
                    .setColor("PURPLE")
                    .addField(`${response.data.ability}`, `${response.data.abilityStats}`)
                    embed.setImage(`${response.data.img}`)
                    embed.addField('Level', `${level.level}`)
                    embed.addField('<:damage:986457786491736198>', `${level.dps}`, true)
                    embed.addField('DPA', `${level.dpa}`, true)
                    if (response.data.spec != null) {
                        embed.addField(`${response.data.spec}`, `${level.dpd}`, true)
                    }
                    embed.addField('<:hp:986457792426672198>', `${level.hp}`, true)
                    pages.push(embed)
                })
                pagination.setEmbeds(pages)
                pagination.setAuthorizedUsers([])
                pagination.render()  
            }).catch((e) => {
                interaction.reply("Error finding super troop. Make sure to include 'super' in the name, ex. 'superbarbarian'.", {"ephemeral": true})
                console.log(e)
                return
            })


    } else if (interaction.commandName === 'patch') {
        const embed = new MessageEmbed()
        .setTitle('Patchnotes')
        .setDescription(`May 2nd, 2022`)
        .setColor("WHITE")
        .addField('Air Defense Lvl 12', '1600<:hp:986457792426672198> increased to 1650<:hp:986457792426672198>')
        .addField('Seeking Air Mine Lvl 4', `2400<:damage:986457786491736198> increased to 2500<:damage:986457786491736198>`)
        .addField('Defensive Builder Lvl 3/4', 'Repair HP 55/60<:hp:986457792426672198> increased to 60/70<:hp:986457792426672198>')
        .addField('Super Dragon Lvl 8/9', '414/448<:damage:986457786491736198> decreased to 405/429<:damage:986457786491736198>')
        .addField('Super Dragon', 'Range <:target:986457787435479071> decreased by 0.5 tiles.')
        .addField('Unicorn Lvl 4-10', 'Healing 59/62/65/69/71/74/77<:hp:986457792426672198> decreased to 58/60/62/64/66/68/70<:hp:986457792426672198>')
    interaction.reply({"embeds": [embed]})
    }

})

client.login(process.env.BOT_KEY);