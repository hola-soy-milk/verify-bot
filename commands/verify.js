const { SlashCommandBuilder } = require("discord.js");
const channelID = process.env.CHANNEL_ID;
const messageID = process.env.MESSAGE_ID;
const roleID = process.env.ROLE_ID;
const emojiID = process.env.EMOJI_ID;
const serverID = process.env.SERVER_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Replies with Pong!"),
  async execute(client, interaction) {
    const channel = await client.channels.fetch(channelID);
    const message = await channel.messages.fetch(messageID);
    const guild = await client.guilds.fetch(serverID);
    const reaction = message.reactions.cache.get(emojiID);
    const role = guild.roles.cache.get(roleID);
    const users = await reaction.users.fetch();

    console.log(`Ready to verify users in ${guild} ${role} with ${users}`);

    // e.g. add a role to each user
    users.each(async (user) => {
      // get the member object as users don't have roles
      try{
      const member = await guild.members.fetch(user.id);
      //   member.roles.remove("ROLE ID");
      if (member) {
        const role = member.roles.cache.find((r) => r.name === "unverified");
        if (role) {
          console.log("verified");

          member.roles.remove(role.id);
        }
      } else {
        console.log(member, user.id,  "not found, not verifying?");
      }
      } catch(e) {
        console.log('err: unknown member', user.displayName);
      }
    });
    await interaction.reply(`Verifying members`);
  },
};
