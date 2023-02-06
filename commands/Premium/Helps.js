const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require("discord.js");

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
      .setLabel(`BUY`)
      .setEmoji('917981825736011846')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.com/users/989430735561715712')
      );
    
    const per1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("home")
      .setLabel("🏠")
      .setStyle(ButtonStyle.Success)
    );
    
    const per2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("feature")
      .setLabel("FEATURES")
      .setEmoji("1013750658643546122")
      .setStyle(ButtonStyle.Secondary)
    );
    
    const per3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("payment")
      .setLabel("PAYMENT")
      .setEmoji("1013750700087451750")
      .setStyle(ButtonStyle.Secondary)
    );
    
    const per4 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId("price")
      .setLabel("PRICE")
      .setEmoji("1013750577089478707")
      .setStyle(ButtonStyle.Secondary)
    );
    
    const embed = new EmbedBuilder()
    .setTitle(`PREMIUM SYSTEM`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setColor(client.color)
    .setDescription(`If You Want To Buy Premium Commands Just Click DM Me!\n And After purchasing you will be able to access Premium Commands!`)
    
    let buttonRow = new ActionRowBuilder().addComponents([per1, per2, per3 per4]]
    const allbtn = [buttonRow]
    const m = await interaction.editReply({ embeds: [embed], components: [row, per1, per2, per3, per4] });
    
    const collector = m.createMessageComponentCollector({
      filter: (b) => {
        if (b.user && b.message.author.id == client.user.id) return true;
        else {
          b.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`You Can't Use This Button!! Lets Make Your Own Button`)], ephemeral: true });
          return false;
        };
      },
      time: 60000 
    });
    
    let dbtnRow = new ActionRowBuilder().addComponents([per1, per2, per3, per4]
    const disableBtn = [dbtnRow]
    collector.on('end', async () =>{
      if(!m) return;
      await m.edit({ components: [disableBtn] }).catch(() => {});
    });
    collector.on('collect', async (b) => {
      if (!b.deffered) await b.deferUpdate()
      if (b.customId === "home") {
        if (!m) return;
        return await m.edit({ embeds: [embed], components: [row, per1, per2, per3, per4] })
      }
      if (b.customId === "feature") {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`FEATURES`)
        .setDescription(`\`\`\`yaml\n\u200b\nAUTOPLAY\nPLAYLIST [\n  ▸ Add\n  ▸ Create\n  ▸ Delete\n  ▸ Detail\n  ▸ Import\n  ▸ Private\n  ▸ Public\n ▸ Remove\n  ▸ Save Current\n  ▸ Save Queue\n  ▸ View\n          ]\nSETUP\n\`\`\``)
        return await m.edit({ embeds: [embed], components: [row, per1, per2, per3, per4] })
      }
      if (b.customId === "payment") {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`PAYMENT METHOD`)
        .setDescription(`\`\`\`yaml\n\u200b\n ▸ OwO Cash\n ▸ DANA\n ▸ Shopeepay\n\`\`\``)
        .setFooter({ text: `If you don't have Indonesian Payments, please pay via OwO Cash only` })
        return await m.edit({ embeds: [embed], components: [row, per1, per2, per3, per4] })
      }
      if (b.customId === "price") {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`PRICE LIST`)
        .setDescription(`\`\`\`yaml\nOwO Cash:\n ▸ Daily = 300K OwO Cash\n ▸ Weekly = 1M OwO Cash\n ▸ Monthly = 3M OwO Cash\n ▸ Yearly = 10M OwO Cash\n ▸ Lifetime = 25M OwO Cash\n\nDANA:\n ▸ Daily = 5.000 IDR\n ▸ Weekly = 10.000 IDR\n ▸ Monthly = 20.000 IDR\n ▸ Yearly = 50.000 IDR\n ▸ Lifetime = 150.000 IDR\`\`\``)
        return await m.edit({ embeds: [embed], components: [row, per1, per2, per3, per4] })
      }
    });
  }
}