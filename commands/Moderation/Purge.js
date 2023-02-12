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
    
    await interaction.channel.bulkDelete(number)
    
    const purEmbed = new EmbedBuilder()
    .setTitle(`PURGE SUCCESS`)
    .setColor(client.color)
    .setDescription(`SUCCESSFULLY DELETED **${number}** MESSAGES`)
    
    const trashButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('trash')
      .setLabel('🗑️ DEETE THIS MESSAGE!')
      .setStyle(ButtonStyle.Success)
      );
    
    const purge = await interaction.editReply({
      embeds: [purEmbed],
      components: [trashButton]
    });
    
    const collector = purge.createMessageComponentCollector({
      componentType: ComponentType.Button
    });
    
    collector.on('collect', async (p) => {
      if (!interaction.guild.members.me.permissions.has("ManageMessage")) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR MENAGE MESSAGE`)]
      });
      if (p.customId === 'trash') {
        await interaction.deleteReply()
      }
    });
  }
}