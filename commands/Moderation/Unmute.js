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
  name: ["unmute"],
  description: "Unmute member from this server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a target for unmute",
      required: true,
      type: ApplicationCommandOptionType.User,
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
    const member = guild.members.cache.get(users.id)
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCES DENIED! YOU DONT HAVE ACCESS FOR MODERATE MEMBERS`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
      embeds: [errEmbed],
      ephemeral: true
    });
    if (!interaction.guild.members.me.permissions.has("ModerateMembers")) return interaction.reply({
      embeds: [errEmbed],
      ephemeral: true
    });
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`UNMUTE PENDING!`)
        .setDescription(`ARE YOU SURE FOR UNMUTE THIS MEMBER?\n－－－－－－－\n◈ User: ${member}\n－－－－－－－`)
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
      if (!b.deferred) await b.deferUpdate();
      if (!interaction.guild.members.me.permissions.has("ModerateMembers")) return interaction.reply({
        embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR MODERATE MEMBERS`)],
        ephemeral: true
    });      
      if (b.customId === "yes") {
        await member.timeout(null)
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`UNMUTE SUCCESS`)
            .setDescription(`\n－－－－－－－\n◈ User: ${member}\n－－－－－－－`)
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
            .setDescription(`UNMUTE CANCELED`)
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