const { SlashCommandBuilder } = require("discord.js");
const channelID = process.env.CHANNEL_ID;
const messageID = process.env.MESSAGE_ID;
const roleID = process.env.ROLE_ID;
const emojiID = process.env.EMOJI_ID;
const serverID = process.env.SERVER_ID;

const fetchAllUsers = async (reaction) => {
  const users = [];
  let last_id;

  while(true) {
    const options = {limit: 100};
    if (last_id) {
      options.after = last_id;
    }
    const newUsers = await reaction.users.fetch(options);
    users.push(...Array.from(newUsers));
    last_id = newUsers.last().id;

    if (newUsers.size !== 100 || users >= 100) {
      break;
    }
  }
  return users.flat(Infinity);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Replies with whether users are verified!"),
  async execute(client, interaction) {
    const channel = await client.channels.fetch(channelID);
    const message = await channel.messages.fetch(messageID);
    const guild = await client.guilds.fetch(serverID);
    const reaction = message.reactions.cache.get(emojiID);
    const role = guild.roles.cache.get(roleID);

    const users = await fetchAllUsers(reaction);

    console.log(`Ready to verify users in ${guild} ${role} with ${users.length}`);

    // e.g. add a role to each user
    users.forEach(async (user) => {
      // get the member object as users don't have roles
      try{
      const member = await guild.members.fetch(user.id);
      //   member.roles.remove("ROLE ID");
      if (member) {
        const role = member.roles.cache.find((r) => r.name === "unverified");
        if (role) {
          console.log(user.displayName, "verified");

          member.roles.remove(role.id);
        }
      } else {
        console.log(member, user.id,  "not found, not verifying?");
      }
      } catch(e) {
        console.log('err: unknown member', user.displayName);
        await reaction?.users.remove(user.id);
      }
    });
    await interaction.reply(`Verifying members`);
  },
};
