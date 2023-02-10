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
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({
        embeds : [errEmbed],
      });
      
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`BAN SYSTEM!`)
        .setDescription(`KAMU YAKIN BAN MEMBER INI?\nUsername: **${member}**\nReason: **${reason}**`)
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId('no')
          .setLabel('NO')
          .setStyle(ButtonStyle.Secondary)
        )
      ]
    });
    
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000
    });
    
    collector.on('collect', async (b) => {
      if (b.customId === 'yes') {
        await member.ban({reason})
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setTitle(`BAN SYSTEM`).setDescription(`BAN SUSCES!!\nUsername: **${member}**\nReason: **${reason}**\nTelah Di Banned Dari Server!!`)],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
              .setLabel('YES')
              .setStyle(ButtonStyle.Danger)
              .setDisabled(true)
            )
          ]
        });
      }
      if (b.customId === 'no') {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setTitle(`BAN SYSTEM`).setDescription(`BAN DIBATALKAN!!`)],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
              .setLabel('NO')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
            )
          ]
        });
      }
    });
    
    collector.on('end', async (collected, reason) => {
      if (reason === 'time') {
        msg.edit({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`TIMEOUT`)],
          components: []
        }).then (msg => msg.delete({ Timeout: 5000 }))
      }
    });
  }
}