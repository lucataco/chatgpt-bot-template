// Create a discord bot using Opatn API
require('dotenv').config();
const { token, apiorg, apikey } = require('./config.json');

const { Client, Events, GatewayIntentBits } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

const configuration = new Configuration({
  organization: apiorg,
  apiKey: apikey
});
const openai = new OpenAIApi(configuration);

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async function(message) {
  try {
    //Dont respond to yourself
    if (message.author.bot) return;
    //Only reply if mentioned
    if (!message.content.startsWith(`<@${client.user.id}>`)) return;

    const gptResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `ChatGPT is a friendly chatbot.\n\
chatGPT: Hello, how are you?\n\
${message.author.username}: ${message.content}\n\
chatGPT:`,
      temperature: 0.9,
      max_tokens: 100,
      stop: ["ChatGPT:", "lucataco:"]
    })

    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch (err) {
    console.log(err)
  }
});

client.login(token);
console.log("chatGPT Bot is Online on Discord")

