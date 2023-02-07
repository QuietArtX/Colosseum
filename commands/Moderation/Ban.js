const {
  EmbedBuilder,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: ["ban"],
  description: "ban user from server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a user",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "provide a reason",
      type: ApplicationCommandOptionType.String,
    },
    ],
    permissions: {
        channel: [],
        bot: ["Administrator"],
        user: ["Administrator"]
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user) => {
      const people = interaction.option.getUser("target");
      const reason = interaction.option.getString("reason");
      const member = await interaction.guild.members
        .fetch(people.id)
        .catch(console.error);
      
      if (!reason) reason = "no reason provided";
      
      await member.ban({
        deleteMessageDays: 1,
        reason: reason,
      })
      await interaction.reply({ 
        content: `Succesful! ${user.tag} Has Banned From This Server`
      })
    }
}