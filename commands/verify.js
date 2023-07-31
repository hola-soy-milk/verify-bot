const { SlashCommandBuilder } = require("discord.js");
const channelID = process.env.CHANNEL_ID;
const messageID = process.env.MESSAGE_ID;
const roleID = process.env.ROLE_ID;
const emojiID = process.env.EMOJI_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const channel = await client.channels.fetch(channelID);
    const message = await channel.messages.fetch(messageID);
    const reaction = message.reactions.cache.get(emojiID);
    const users = await reaction.users.fetch();

    console.log(users);

    // e.g. add a role to each user
    users.each(async (user) => {
      // get the member object as users don't have roles
      const member = await message.guild.members.fetch(user.id);
      //   member.roles.remove("ROLE ID");
      await interaction.reply(user.name);
    });
    await interaction.reply("Pong!");
  },
};
