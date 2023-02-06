const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: ["premium", "helps"],
  description: "Premium help if u want to buy premium",
  category: "Premium",
  permissions: {
    channel: [],
    bot: [],
    user: []
    },
  settings: {
    isPremium: false,
    isPlayer: false,
    isOwner: true,
    inVoice: false,
    sameVoice: false,
    },
    
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: false });
    
    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('dc')
      .setLabel(`DM ME`)
      .setEmoji('800609264124821546')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/users/989430735561715712')
      );
    
    const embed = new EmbedBuilder()
    .setTitle(`PREMIUM SYSTEM`)
    .setColor(client.color)
    .setDescription(`If You Want To Buy Premium Commands Just Click DM Me!\n And After purchasing you will be able to access Premium Commands\n Payment:\n  • OwO Cash\n  • DANA\n  • Shopeepay`)
    .addFields({
      name: `PREMIUM FEATURES`,
      value: `\`\`\`yaml\n ▸ AUTOPLAY\n ▸ PLAYLIST\n ▸ SETUP\nAnd Much More!`,
      inline: true
    })
    .setFields({
      name: `PRICE LIST`, value: `\`\`\`yaml\nOwO Cash:\n ▸ Daily = 300K OwO Cash\n ▸ Weekly = 1M OwO Cash\n ▸ Monthly = 3M OwO Cash\n ▸ Lifetime = 5M OwO Cash\n\nIDR (DANA, Shopeepay):\n ▸ Daily = Rp5.000\n ▸ Weekly = Rp10.000\n ▸ Monthly = Rp25.000\n ▸ Lifetime = Rp50.000\n\`\`\``, inline: true
    })
    .setFooter({ text: `if you don't have Indonesian payments, please pay via OwO Cash only` });
   
    interaction.editReply({
      embeds: [embed], 
      components: [row]
    });
  }
}