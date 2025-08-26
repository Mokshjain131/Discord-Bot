const { Client, GatewayIntentBits, Events, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

async function generateImageStability(prompt) {
    try {
        const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                text_prompts: [
                    {
                        text: prompt,
                        weight: 1
                    }
                ],
                cfg_scale: 7,
                height: 1024,
                width: 1024,
                samples: 1,
                steps: 30,
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.artifacts && data.artifacts[0]) {
            const imageBase64 = data.artifacts[0].base64;
            const buffer = Buffer.from(imageBase64, 'base64');
            
            const filename = `generated_${Date.now()}.png`;
            fs.writeFileSync(filename, buffer);
            
            return {
                success: true,
                filename: filename
            };
        } else {
            throw new Error('No image data received');
        }
    }
    catch (error) {
        console.error('Stability AI Error:', error);
        return {
            success: false,
            error: error.message
        };
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

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    
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
            await message.channel.send(response);
        }
        catch (error) {
            console.error('Error fetching Chuck Norris joke:', error);
            await message.channel.send('Failed to fetch a Chuck Norris joke.');
        }
    }
    else if (command === '!generate') {
        if (!query) {
            await message.channel.send("Please provide a prompt for image generation!");
            return;
        }
        
        await message.channel.send("🎨 Generating image... This may take a moment!");
        
        try {
            const result = await generateImageStability(query);
            
            if (result.success) {
                const attachment = new AttachmentBuilder(result.filename);
                await message.channel.send({
                    files: [attachment],
                    content: "Here's your generated image!"
                });
                
                // Clean up temporary file
                fs.unlinkSync(result.filename);
            } else {
                await message.channel.send(`❌ Failed to generate image: ${result.error}`);
            }
        }
        catch (error) {
            console.error('Generate command error:', error);
            await message.channel.send('❌ An error occurred while generating the image.');
        }
    }
});

client.login(process.env.BOT_TOKEN);