const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");

module.exports = {
  name: ["purge"],
  description: "The purges channel message",
  category: "Moderation",
  options: [
    {
      name: "amount",
      description: "input amount",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    }
  ],
  permissions: {
        channel: [],
        bot: ["ManageMessage"],
        user: ["ManageMessage"]
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
   
    let number = interaction.options.getInteger("amount");
    
    const purEmbed = new EmbedBuilder()
    .setTitle(`PURGE SUCCESS`)
    .setColor(client.color)
    .setDescription(`SUCCESSFULLY DELETED **${number}** MESSAGES`)
    
    const trashButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('trash')
      .setLabel('🗑️ DELETE THIS MESSAGE!')
      .setStyle(ButtonStyle.Success)
      );
      
    const PButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('YES')
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId('no')
      .setLabel('NO')
      .setStyle(ButtonStyle.Secondary)
      )
    
    const purge = await interaction.editReply({
      embeds: [purEmbed],
      components: [PButton]
    });
    
    const collector = purge.createMessageComponentCollector({
      componentType: ComponentType.Button
    });
    
    collector.on('collect', async (p) => {
      if (!interaction.guild.members.me.permissions.has("ManageMessage")) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR MENAGE MESSAGE`)]
      });
      if (p.customId === 'yes') {
        interaction.channel.bulkDelete(number).then(() => {
          interaction.editReply({ embeds: [purEmbed], components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
              .setCustomId('trs')
              .setLabel('hapus')
              .setStyle(ButtonStyle.Success)
            )
            ] 
          }).then(() => {
            if (p.customId === 'trs') {
              interaction.deleteReply()
            }
          })
        })
      }
      if (p.customId === 'no') {
        interaction.editReply({
          content: 'cancel',
          components: [trashButton]
        })
      }
    });
  }
}