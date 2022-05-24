const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10')
const { token, clientID, guildID } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('search').setDescription('Search for your clan by name.').addStringOption(option => option.setName('clan-name').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('clan').setDescription('Gets your clan and clanmates profiles.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('warlog').setDescription("Gets war log info from a clan.").addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('currentwar').setDescription('Gets info on your clans current war.').addStringOption(option => option.setName('clan-tag').setDescription('Ex: #2QOB822JV').setRequired(true)),
    new SlashCommandBuilder().setName('player').setDescription("Gets player info.").addStringOption(option => option.setName('player-tag').setDescription('Ex: #8YQ9LC2QU').setRequired(true)),
    new SlashCommandBuilder().setName('goldpass').setDescription("Get gold pass end time."),
    new SlashCommandBuilder().setName('troops').setDescription('Sends a link to the fandom troop database.'),
    new SlashCommandBuilder().setName('help').setDescription('Lists all commands and syntaxes.')
]

const rest = new REST({version: '10'}).setToken(token)

rest.put(Routes.applicationGuildCommands(clientID, guildID), {body: commands}).then(() => {
    console.log('Commands registered.')
}).catch(console.error)