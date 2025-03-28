const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

async function generate() {
    const response = await fetch('https://api.chucknorris.io/jokes/random');
    const data = await response.json();
    return data.value;
}

client.once(Events.ClientReady, () => {
    console.log('Bot is ready!');
});

// client.on(Events.GuildMemberAdd, async (member) => {
//     try {
//         const guild = member.guild;
//         const channel = guild.channels.cache.get(Welcome_Channel_ID);
//         const role = guild.roles.cache.get(Exec_Role_ID);

//         await member.roles.add(role);
//         const message = `Welcome to the server, ${member}!`;
//         await channel.send(message);
//     }

//     catch (error) {
//         console.error(error);
//     }
// });

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
    else if (message.content === '!heil') {
        try {
            await message.channel.send('Heil Hmmmmm!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (message.content === '!kshit') {
        try {
            await message.channel.send('when is the 5th coming!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (message.content === '!chuck') {
        try {
            const response = await fetch('https://api.chucknorris.io/jokes/random');
            const data = await response.json();
            message.channel.send(data.value);
        }
        catch (error) {
            console.error('Error fetching Chuck Norris joke:', error);
            message.channel.send('Failed to fetch a Chuck Norris joke.');
        }
    }
    else if (message.content === '!generate') {
        try {
            message = await generate();
            await message.channel.send(message);
        }
        catch (error) {
            console.error(error);
        }
    }
});

client.login(process.env.BOT_TOKEN);