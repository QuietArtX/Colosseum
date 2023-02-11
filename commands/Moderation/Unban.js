const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");

module.exports = {
  name: ["unban"],
  description: "Unban member from this server",
  category: "Moderation",
  options: [
    {
      name: "userid",
      description: "input userid",
      required: true,
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
  
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: false });
    
    const { channel, options } = interaction;
    
    const userId = options.getString("userid");
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`UNBAN PENDING!`)
        .setDescription(`ARE YOU SURE FOR UNBAN THIS MEMBER?\n－－－－－－－\n◈ User: <@${userId}>\n－－－－－－－`)
        .setFooter({
          text: `Colosseum Music Moderator`
        })
        .setTimestamp()
      ],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId(`yes`)
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId(`no`)
          .setLabel('NO')
          .setStyle(ButtonStyle.Secondary)
        )
      ]
    });
    
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 25000
    });
    
    collector.on('collect', async (b) => {
      if (!b.deffered) await b.deferUpdate();
      if (!interaction.guild.members.me.permissions.has("BanMembers")) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR BAN MEMBERS`)],
      ephemeral: true
      });
      if (b.customId === "yes") {
        await interaction.guild.members.unban(userId)
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`UNBAN SUCCESS`)
            .setDescription(`SUCCESSFUL UNBANNED!\n－－－－－－－\n◈ User: <@${userId}>\n－－－－－－－`)
            .setFooter({
              text: `Colosseum Music Moderator`
            })
            .setTimestamp()
          ],
          components: []
        });
      }
      if (b.customId === "no") {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`BANNED CANCELED`)
            .setFooter({
              text: `Colosseum Music Moderator`
            })
            .setTimestamp()
          ],
          components: []
        });
      }
    });
    
    collector.on('end', async (collected, reason) => {
      if (reason === "time") {
        const timbed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`Timeout! Please Try Again!`)
        msg.edit({ embeds: [timbed], components: [] }).then (msg => msg.delete({ timeout: 6000 }))
      }
    });
  }
}