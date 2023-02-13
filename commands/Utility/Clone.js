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
    
    const loading = await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.color).setDescription(`<a:waiting:802770372516118561 Loading...`)]
    });
    
    const cEmbed = new EmbedBuilder()
    .setTitle(`<a:Attention:1013754096316063814> CLONE WARNING !!`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setDescription(`U Want To Clone This Bot?\nClick The Button Below\n\n**JUST PUT YOUR BOT TOKEN IN ENV SECRET & DON'T CHANGE ANYTHING**`)
    .setFooter({
      text: `don't forget to give star to my repository, thank you!!`
    })
    .setColor(client.color)
    .setTimestamp();
    
    const cButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setLabel('Repl.it')
      .setEmoji('1045961018645422080')
      .setStyle(ButtonStyle.Link)
      .setURL('https://replit.com/github/QuietArtX/Colloseum'),
      new ButtonBuilder()
      .setLabel('Fork on GitHub!')
      .setEmoji('1064244587541045319')
      .setStyle(ButtonStyle.Link)
      .setURL('https://github.com/QuietArtX/Colloseum/fork')
    );
    
    await delay(3000);
    loading.edit({
      embeds: [cEmbed],
      components: [cButton]
    });
  }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}