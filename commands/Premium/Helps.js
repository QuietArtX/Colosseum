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
    
    const embed = new EmbedBuilder()
    .setTitle(`PREMIUM SYSTEM`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    .setColor(client.color)
    .setDescription(`If You Want To Buy Premium Commands Just Click DM Me!\n And After purchasing you will be able to access Premium Commands!`)
    
    let per1 = new ButtonBuilder().setCustomId("home").setLabel("🏠").setStyle(ButtonStyle.Success);
    let per2 = new ButtonBuilder().setCustomId("fitur").setLabel("FEATURES").setEmoji("1013750658643546122").setStyle(ButtonStyle.Success);
    let per3 = new ButtonBuilder().setCustomId("payment").setLabel("PAYMENT").setEmoji("1013750700087451750").setStyle(ButtonStyle.Success);
    let per4 = new ButtonBuilder().setCustomId("price").setLabel("PRICE LIST").setEmoji("1013750577089478707").setStyle(ButtonStyle.Success);
    let editEmbed = new EmbedBuilder();
    
    const m = await interaction.editReply({ embeds: [embed], components: [row, per1, per2, per3, per4]});
    
    const collector = await msg.createMessageComponentCollector({
      filter: (b) => {
        if (b.user && b.message.author.id == client.user.id) return true;
        else {
          b.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`You Can't Use This Button!! Lets Make Your Own Button`)], ephemeral: true });
          return false;
        };
      },
      time: 60000 
    });
    
    collector.on('end', async () =>{
      if(!m) return;
      await m.edit({ components: [new ActionRowBuilder().addComponents(row.setDisable(true), p1.setDisable(true), p2.setDisable(true), p3.setDisable(true), p4.setDisable(true))] }).catch(() => {});
    });
    collector.on('collect', async (b) => {
      if (!b.deffered) await b.deferUpdate()
      if (b.customId === "home") {
        if (!m) return;
        return await m.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(row, per1, per2, per3, per4)]})
      }
      if (b.customId === "fitur") {
        editEmbed.setColor(client.color).setTitle(`FEATURES`).setDescription(`\`\`\`yaml\n\u200b\n  ▸ AUTOPLAY\nPLAYLIST [\n  ▸ Add\n  ▸ Create\n  ▸ Delete\n  ▸ Detail\n  ▸ Import\n  ▸ Private\n  ▸ Public\n ▸ Remove\n  ▸ Save Current\n  ▸ Save Queue\n  ▸ View\n          ]\n▸ SETUP\n\`\`\``)
        return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(row, per1, per2, per3, per4)] })
      }
      if (b.customId === "payment") {
        editEmbed.setColor(client.color).setTitle(`PAYMENT METHOD`).setDescription(`\`\`\`yaml\n\u200b\n  ▸OwO Cash\n ▸ DANA\n ▸ Shopeepay\n\`\`\``)
        return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(row, per1, per2, per3, per4)] })
      }
      if (b.customId === "price") {
        editEmbed.setColor(client.color).setTitle(`PRICE LIST`).setDescription(`\`\`\`yaml\n\u200b\n  ▸OwO Cash\n ▸ DANA\n ▸ Shopeepay\n\`\`\``).setFooter({ text: `If you don't have Indonesian Payments, please pay via OwO Cash only` })
        return await m.edit({ embeds: [editEmbed], components: [new ActionRowBuilder().addComponents(row, per1, per2, per3, per4)] })
      }
    });
  }
}