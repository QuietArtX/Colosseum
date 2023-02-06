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
    isOwner: false,
    inVoice: false,
    sameVoice: false,
    },
    
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: false });
    
    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setLabel(`DM ME`)
      .setEmoji('800609264124821546')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/users/989430735561715712')
      );
    
    const embed = new EmbedBuilder()
    .setTitle(`PREMIUM SYSTEM`)
    .setThumbnail(client.user.DisplayAvatarURL({ dynamic: true, size: 2048 }))
    .setColor(client.color)
    .setDescription(`If You Want To Buy Premium Commands Just Click DM Me!\n And After purchasing you will be able to access Premium Commands!`)
    .setFields([
      { name: `PREMIUM FEATURES`, value: `\`\`\`yaml\n ▸ AUTOPLAY\n ▸ PLAYLIST\n ▸ SETUP\nAnd Much More!\n\`\`\``, inline: true },      
      { name: `PRICE LIST`, value: `\`\`\`yaml\nOwO Cash:\n ▸ Daily = 300K OwO Cash\n ▸ Weekly = 1M OwO Cash\n ▸ Monthly = 3M OwO Cash\n ▸ Lifetime = 5M OwO Cash\n\nIDR (DANA, Shopeepay):\n ▸ Daily = Rp5.000\n ▸ Weekly = Rp10.000\n ▸ Monthly = Rp25.000\n ▸ Lifetime = Rp50.000\n\`\`\``, inline: true },
      { name: `PAYMENT`, value: `\`\`\`yaml\n ▸OwO Cash\n ▸ DANA\n ▸ Shopeepay\n\`\`\``, inline: true },
    ])
    .setFooter({ text: `If you don't have Indonesian Payments, please pay via OwO Cash only` });
   
    interaction.editReply({
      embeds: [embed], 
      components: [row]
    });
  }
}