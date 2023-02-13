const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  ComponentType
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: ["mute"],
  description: "Mute member from this server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a target for mute",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "time",
      description: "provided a reason",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "reason",
      description: "set mute time",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissions: {
        channel: [],
        bot: ["ModerateMembers"],
        user: ["ModerateMembers"]
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
    
    const { guild, options } = interaction;
    
    const users = options.getUser("target");
    const reason = options.getString("reason") || "NO REASON PROVIDED";
    const time = options.getString("time")
    const member = guild.members.cache.get(users.id);
    const convertedTime = ms(time);
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`Action denied! Please Try Again Later!`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({
      embeds: [errEmbed],
      ephemeral: true
    });
    if (!interaction.guild.members.me.permissions.has("ModerateMembers")) return interaction.reply({
      embeds: [errEmbed],
      ephemeral: true
    });
    if (!convertedTime) return interaction.editReply({
      embeds: [errEmbed],
      ephemeral: true
    });
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`MUTE PENDING!`)
        .setDescription(`ARE YOU SURE FOR MUTE THIS MEMBER?\n－－－－－－－\n◈ User: ${member}\n◈ Reason: **${reason}**\n◈  Duration: ${time}\n－－－－－－－`)
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
      if (!interaction.guild.members.me.permissions.has("ModerateMembers")) return interaction.reply({
        embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR MODERATE MEMBERS`)],
        ephemeral: true
      });      
      if (b.customId === "yes") {
        await member.timeout(convertedTime, reason)
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`MUTE SUCCESS`)
            .setDescription(`\n－－－－－－－\n◈ User: ${member}\n◈ Reason: **${reason}**\n◈  Duration: ${time}\n－－－－－－－`)
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
            .setDescription(`MUTE CANCELED`)
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