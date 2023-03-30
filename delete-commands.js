const { REST, Routes, } = require('discord.js');
const { clientId, heladoOscuro, token } = require('./config.json');
 
const rest = new REST({ version: '9' }).setToken(token);
rest.get(Routes.applicationCommands(clientId, heladoOscuro))
    .then(data => {
        const promises = [];
        for (const command of data) {
            const deleteUrl = `${Routes.applicationCommands(clientId)}/${command.id}`;
            promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
});