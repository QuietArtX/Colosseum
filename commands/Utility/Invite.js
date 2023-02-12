const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");

module.exports = {
  name: ["invite"],
  description: "Invite me to your seever",
  category: "Utility",
  ooption: [],
  permissions: {
        channel: [],
        bot: [],
        user: []
    },
  settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
  },
  
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: false });
    
    const invite = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`INVITE ME TO YOUR SERVER!\nCLICK THE BUTTON BELOW`);
    
    const bInvite = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('inv')
      .setLabel('INVITE')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/api/oauth2/authorize?client_id=1064974505597993152&permissions=8&scope=bot%20applications.commands')
      )
      await interaction.editReply({
        embeds: [invite],
        components: [bInvite]
      });
  }
}