const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Informacion sobre el servidor.'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`El servidor se llama ${interaction.guild.name} y tiene ${interaction.guild.memberCount} miembros.`);
	},
};