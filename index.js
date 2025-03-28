const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

async function generate(query) {
    try {
        const response = await model.generateContent({
            contents: [query],
            config: {
                responseModalities: ['Text', 'Image']
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                message.text = part.text;
            }
            else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, 'base64');
                fs.writeFileSync('image.png', buffer);
                message.image = 'image.png';
            }
        }

        return message;
    }
    catch (error) {
        console.error("Error generating content:", error);
    }
}

async function chuck() {
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
    const command = message.content.split(' ')[0];
    const query = message.content.split(' ').slice(1).join(' ');

    if (command === '!ping') {
        try {
            await message.channel.send('Pong!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (command === '!vivek') {
        try {
            const guild = message.guild;
            await message.channel.send('Vivek is gay!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (command === '!heil') {
        try {
            await message.channel.send('Heil Hmmmmm!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (command === '!kshit') {
        try {
            await message.channel.send('when is the 5th coming!');
        }
        catch (error) {
            console.error(error);
        }
    }
    else if (command === '!chuck') {
        try {
            const response = await chuck();
            message.channel.send(response);
        }
        catch (error) {
            console.error('Error fetching Chuck Norris joke:', error);
            message.channel.send('Failed to fetch a Chuck Norris joke.');
        }
    }
    else if (command === '!generate') {
        if (!query) {
            await message.channel.send("Please provide a prompt for generation!");
        }
        else {
            try {
                message = await generate(query);
                const attachment = new MessageAttachment(message.image);
                await message.channel.send({files: [attachment], content: [message.text]});
            }
            catch (error) {
                console.error(error);
                message.channel.send('Failed to generate content.');
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);