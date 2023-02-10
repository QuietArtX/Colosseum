const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");

module.exports = {
  name: ["ban"],
  description: "ban member from this server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a target for ban",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "provided a reason",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissions: {
        channel: [],
        bot: ["BanMembers"],
        user: ["BanMembers"]
    },
  settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
  },
  
  run: async (interaction, client) => {
    await interaction.deferReply({ ephemeral: true });
    
    const user = options.getUser("target");
    const reason = options.getString("reason");
    
    const member = await interaction.guild.members.fetch(user.id);
    
    const errEmbed = await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.color).setDescription(`kamu tidak bisa ban member ini karena role dia lebih tinggi!!`)],
      ephemeral: true,
    })
    
    const bEmbed = await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(client.color).setDescription(`kamu yakin ban member ini? ${member}`)],
      components: [
        new ActtionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId('no')
          .setLabel('NO')
          .setStyle(ButtonStyle.Secondary)
        )
      ],
      ephemeral: true,
    });
    
    const collector = bEmbed.createMessageComponentCollector({
      componentType: ComponentType.Button
    });
    
    collector.on('collect', async (b) => {
      if (b.customId === 'yes') {
        await member.ban({reason})
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`BAN MEMBER ${member} BERHASIL!!\nDENGAN ALASAN ${reason}`)],
          components: [],
        });
      }
      if (b.customId === 'no') {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`BAN DI BATALKAN!`)],
          components: [],
        });
      }
    });
    
    collector.on('end', async() => {
      await interaction.deleteReply().then (msg => msg.delete({ Timeout: 6000 }))
    });
  }
}