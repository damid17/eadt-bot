const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Prueba tu Suerte'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Tirando...', fetchReply: true });
        const tirada = Math.floor(Math.random() * 100);
		await interaction.editReply(`${interaction.user.username} rolls: ${tirada} (1-100)`);
		await wait(5);
		if(tirada == 1){
			await interaction.followUp(`F`);
		}
	},
};