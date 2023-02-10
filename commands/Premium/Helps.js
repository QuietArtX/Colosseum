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
    
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`COLOSSEUM PREMIUM SYSTEM`)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setDescription(`If You Want To Buy Premium Commands, Click the **BUY** button below\nAnd After purchasing you will be able to access Premium Commands!`)
      .setImage(`https://media.discordapp.net/attachments/1073472346322653224/1073578137864114217/20230210_191457.jpg`)
      
      const blink = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('BUY')
          .setEmoji('867721862570311700')
          .setStyle(ButtonStyle.Link)
          .setURL('https://discord.com/users/989430735561715712')
        );
      
      const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('help-prem')
          .setPlaceholder('Click Here!')
          .setMinValues(1)
          .setMaxValues(1)
          .addOptions([
            {
              label: 'Features',
              emoji: '1013750658643546122',
              value: 'Features',
            },
            {
              label: 'Price List',
              emoji: '1013750577089478707',
              value: 'Price',
            },
            {
              label: 'Payment',
              emoji: '1013750700087451750',
              value: 'Payment',
            },
          ]),
        );
        const msg = await interaction.editReply({ embeds: [embed], components: [blink, row] });
        const collector = msg.createMessageComponentCollector({
          filter: (i) => {
            if (i.user.id === interaction.user.id) return true;
            else {
              i.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`Only **${interaction.user.tag}** can use this button, if you want then you've run the command again!`)], ephemeral: true });
              return false;
            };
          },
          time: 60000
        });
     
        collector.on('collect', async (s) => {
          if (!s.deffered) await s.deferUpdate()
          const options = s.values[0]
          if (options === 'Features') {
            const nembed = new EmbedBuilder()
              .setTitle(`PREMIUM FEATURES`)
              .setColor(client.color)
              .setDescription(`\`\`\`yaml\n\u200b\nAUTOPLAY\nPLAYLIST [\n  ▸ Add\n  ▸ Create\n  ▸ Delete\n  ▸ Detail\n  ▸ Import\n  ▸ Private\n  ▸ Public\n  ▸ Remove\n  ▸ Save Current\n  ▸ Save Queue\n  ▸ View\n          ]\nSETUP\n\`\`\``);
              if (!msg) return;
              return msg.edit({
                embeds: [nembed],
                components: [blink, row],
              });
          }
          if (options === 'Price') {
            const nembed = new EmbedBuilder()
              .setTitle(`PRICE LIST`)
              .setColor(client.color)
              .setDescription(`\`\`\`yaml\nOwO Cash:\n ▸ Daily = 300K OwO Cash\n ▸ Weekly = 1M OwO Cash\n ▸ Monthly = 3M OwO Cash\n ▸ Yearly = 10M OwO Cash\n ▸ Lifetime = 25M OwO Cash\n\nDANA & Shopeepay:\n ▸ Daily = 5.000 IDR\n ▸ Weekly = 10.000 IDR\n ▸ Monthly = 20.000 IDR\n ▸ Yearly = 50.000 IDR\n ▸ Lifetime = 150.000 IDR\`\`\``);
              if (!msg) return;
              return msg.edit({
                embeds: [nembed],
                components: [blink, row],
              });
          }
          if (options === 'Payment') {
            const nembed = new EmbedBuilder()
              .setTitle(`PAYMENT`)
              .setColor(client.color)
              .setDescription(`\`\`\`yaml\n\u200b\n ▸ OwO Cash\n ▸ DANA\n ▸ Shopeepay\n\`\`\``)
               .setFooter({ text: `If you don't have Indonesian Payments, please pay via OwO Cash only` });
              if (!msg) return;
              return msg.edit({
                embeds: [nembed],
                components: [blink, row],
              });
          }
        });
        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            const timbed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle(`DELETED`)
              .setDescription(`Timeout! Please Try Again!`)
              msg.edit({ embeds: [timbed], components: [] }).then (msg => msg.delete({ timeout: 6000 }))
          }
        });        
  }
}