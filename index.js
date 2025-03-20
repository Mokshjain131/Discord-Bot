const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

const Welcome_Channel_ID = "1242883438214647841";
const Exec_Role_ID = "1242885356886691871";

client.once(Events.ClientReady, () => {
    console.log('Bot is ready!');
});

client.on(Events.GuildMemberAdd, async (member) => {
    try {
        const guild = member.guild;
        const channel = guild.channels.cache.get(Welcome_Channel_ID);
        const role = guild.roles.cache.get(Exec_Role_ID);

        await member.roles.add(role);
        const message = `Welcome to the server, ${member}!`;
        await channel.send(message);
    }

    catch (error) {
        console.error(error);
    }
});

client.on(Events.MessageCreate, async (message) => {
    if (message.content === '!ping') {
        try {
            await message.channel.send('Pong!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (message.content === '!vivek') {
        try {
            const guild = message.guild;
            await message.channel.send('Vivek is gay!');
        }
        catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.BOT_TOKEN);