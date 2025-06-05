const { Client, GatewayIntentBits, Events, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY);

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
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp-image-generation',
            contents: query,
            config: {
                responseModalities: ['Text', 'Image']
            },
        });
        
        const result = { text: null, image: null };
        
        // Check if response has candidates
        if (!response.candidates || !response.candidates[0]) {
            return 'Error: No response from API';
        }
        
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                result.text = part.text;
            }
            else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, 'base64');
                const filename = `generated_${Date.now()}.png`;
                fs.writeFileSync(filename, buffer);
                result.image = filename;
            }
        }

        return result;
    }
    catch (error) {
        console.error('Generate function error:', error);
        return `Error generating content: ${error.message}`;
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
            await message.channel.send("Please provide a prompt for image generation!");
            return;
        }
        
        await message.channel.send("🎨 Generating image... This may take a moment!");
        
        try {
            const result = await generate(query);
            
            if (typeof result === 'string') {
                // Error case
                await message.channel.send(result);
            } else {
                // Success case
                const messageOptions = {};
                
                if (result.text) {
                    messageOptions.content = result.text;
                }
                
                if (result.image) {
                    const attachment = new AttachmentBuilder(result.image);
                    messageOptions.files = [attachment];
                    
                    // Clean up the temporary file after sending
                    setTimeout(() => {
                        try {
                            fs.unlinkSync(result.image);
                        } catch (err) {
                            console.log('Could not delete temp file:', err.message);
                        }
                    }, 5000);
                }
                
                if (messageOptions.content || messageOptions.files) {
                    await message.channel.send(messageOptions);
                } else {
                    await message.channel.send('No content generated');
                }
            }
        }
        catch (error) {
            console.error(error);
            await message.channel.send('Failed to generate content.');
        }
    }
});

client.login(process.env.BOT_TOKEN);