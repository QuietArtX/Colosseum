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
    await interaction.deferReply({ ephemeral: false });
    
    const { channel, options } = interaction;
    
    const user = options.getUser("target");
    const reason = options.getString("reason") || "NO REASON PROVIDED";
    const member = await interaction.guild.members.fetch(user.id);
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`Action denied! cannot ban the role above you!`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
      embeds: [errEmbed],
      ephemeral: true
    });
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`BAN PENDING!`)
        .setDescription(`ARE YOU SURE FOR BAN THIS MEMBER?\n--------------\nUser: ${member}\nModerator: ${interaction.author.id}\nReason: ${reason}`)
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
      if (b.customId === "yes") {
        await member.ban({reason})
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`BAN SUCCESS`)
            .setDescription(`SUCCESSFUL BANNED!\nUser: ${member}\nReason: ${reason}`)
          ],
          components: []
        });
      }
      if (b.customId === "no") {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`BAN CANCEL`)
            .setDescription(`BANNED CANCELED`)
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