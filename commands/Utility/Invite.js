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
    await interaction.deferReply({ ephemeral: false});
    
    const iEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`HERE YOUR INVITE LINK\n CLICK ON BUTTON BELLOW`);
    
    const iButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel('INVITE')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/api/oauth2/authorize?client_id=1064974505597993152&permissions=8&scope=bot%20applications.commands')
    );
    
    await interaction.editReply({
      content: `Loading...`
    }).then (msg => msg.edit({
      content: ` `
      embeds: [iEmbed],
      components: [iButton]
    }), 10000);
  }
}