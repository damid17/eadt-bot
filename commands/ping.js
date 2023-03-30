const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Bot Ping'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		await wait(2000);
		await interaction.editReply(`Latencia: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
		await wait(10000);
		await interaction.deleteReply();
	},
};