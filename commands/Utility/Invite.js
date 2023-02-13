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
    
    const loading = await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.color).setDescription(`<a:waiting:802770372516118561> Generate Invite Link...`)]
    });
    
    const iEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`HERE YOUR INVITE LINK\nCLICK ON BUTTON BELOW`);
    
    const iButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel('INVITE')
      .setEmoji('1024428007215091712')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/api/oauth2/authorize?client_id=1064974505597993152&permissions=8&scope=bot%20applications.commands')
    );
    await delay(3000)
    loading.edit({
        embeds: [iEmbed],
        components: [iButton]
    });
  }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}