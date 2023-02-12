const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");

module.exports = {
  name: ["bot", "clone"],
  description: "Clone bot for your discord server",
  category: "Utility",
  permissions: {
        channel: [],
        bot: [],
        user: []
    },
  settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
  },
  
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: true });
    
    const cEmbed = new EmbedBuilder()
    .setTitle(`!! CLONE WARNING !!`)
    .setDescription(`U Want To Clone This Bot?\nwhere can i get this code? Click The Button Below\n\n**JUST PUT YOUR BOT TOKEN IN ENV SECRET & DON'T CHANGE ANYTHING**`)
    .setColor(client.color)
    .setTimestamp();
    
    const cButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel('Repl.it')
      .setEmoji('1045961018645422080')
      .setStyle(ButtonStyle.Link)
      .setURL('https://replit.com/github/QuietArtX/Colloseum'),
      new ButtonBuilder()
      .setLabel('Fork on GitHub')
      .setEmoji('1064244587541045319')
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/QuietArtX/Colloseum/fork')
    );
    await interaction.editReply({
      embeds: [cEmbed],
      components: [cButton]
    });
  }
}