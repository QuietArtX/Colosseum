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
    
    const { channel, options } = interaction;
    
    const user = options.getUser("target");
    const reason = options.getString("reason") || "no provided reason";
    
    const member = await interaction.guild.members.fetch(user.id);
    
    const errEmbed = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`KAMU TIDAK BISA BAN MEMBER INI KARNA DIA MEMPUNYAI ROLE PALING TINGGI DARI KAMU`)
      ],
      ephemeral: true,
    });
    
    const bButton = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('YES')
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId('no')
      .setLabel('NO')
      .setStyle(ButtonStyle.Secondary)
    );
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({
        embeds : [errEmbed],
        ephemeral: true,
      });
      
    const bEmbed = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`BAN SYSTEM!`)
        .setDescription(`KAMU YAKIN BAN MEMBER INI?\nUsername: **${member}**\nReason: **${reason}**`)
      ],
      ephemeral: true,
      components: [bButton]
    });
    
    const collector = bEmbed.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000
    });
    
    collector.on('collect', async (b) => {
      if (b.customId === 'yes') {
        await member.ban({reason})
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setTitle(`BAN SYSTEM`).setDescription(`BAN SUSCES!!\nUsername: **${member}**\nReason: **${reason}**\nTelah Di Banned Dari Server!!`)],
          components: [bButton.setDisabled(true)],
          ephemeral: true
        });
      }
      if (b.customId === 'no') {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setTitle(`BAN SYSTEM`).setDescription(`BAN DIBATALKAN!!`)],
          components: [bButton.components.forEach(b => setDisabled(true)],
          ephemeral: true
        });
      }
    });
    
    collector.on('end', async (collected, timeded) => {
      if (timeded === 'time') {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`TIMEOUT`)],
          components: []
        }).then (bEmbed => bEmbed.delete({ Timeout: 5000 }))
      }
    });
  }
}