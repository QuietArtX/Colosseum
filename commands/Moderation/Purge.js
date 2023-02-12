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
    await interaction.deferReply({ ephemeral: true });
   
    let number = interaction.options.getInteger("amount");
    
    const purEmbed = new EmbedBuilder()
    .setTitle(`WARNING`)
    .setColor(`Are you sure you want to delete ${number} messages?`)
    .setFooter({
      text: `Click **YES** if you want to delete the message`
    });
    
    const purButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('YES')
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId('no')
      .setLabel('NO')
      .setStyle(ButtonStyle.Secondary),
    );
    
    const trash = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('trash')
      .setLabel('🗑️ DEETE THIS MESSAGE!')
      .setStyle(ButtonStyle.Success)
      );
    
    const purge = await interaction.editReply({
      embeds: [purEmbed],
      components: [purButton]
    });
    
    const collector = purge.createMessageComponentCollector({
      componentType: ComponentType.Button
    });
    
    collector.on('collect', async (p) => {
      if (!interaction.guild.members.me.permissions.has("ManageMessage")) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR MENAGE MESSAGE`)]
      });
      if (b.customId === 'trash') {
        await interaction.deleteReply()
      }
      if (b.customId === 'yes') {
        await interaction.channel.bulkDelete(number)
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`SUCCESS DELETED ${number} MESSSAGES`)
          ],
          components: [trash]
        });
      }
      if (b.customId === 'no') {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`CANCELED`)
          ],
          components: [trash]
        });
      }
    });
  }
}