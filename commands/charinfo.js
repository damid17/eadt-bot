const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const wowapi = require('../lib/wow_api');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('charinfo')
		.setDescription('Informacion del Personaje')
        .addStringOption(option =>
            option.setName('personaje')
                .setDescription('El Personaje a buscar')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reino')
                .setDescription('Reino del Personaje')
                .setRequired(true)),                
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Buscando estadísticas...', fetchReply: true });
        const token = await wowapi.get_token();
        const realm = interaction.options.getString('reino');
        const character = interaction.options.getString('personaje');
        const info = await wowapi.get_char(realm, character, token);
        console.log('Info: ', info);
        await wait (1000);
		await interaction.followUp({embeds: [info]});
	},
};