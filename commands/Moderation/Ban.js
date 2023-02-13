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
  
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: false });
    
    const { channel, options } = interaction;
    
    const users = options.getUser("target");
    const reason = options.getString("reason") || "NO REASON PROVIDED";
    const member = await interaction.guild.members.fetch(users.id);
    const uTag = await interaction.user.tag;
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`Action denied! cannot ban the role above you!`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({
      embeds: [errEmbed],
      ephemeral: true
    });
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`BAN PENDING!`)
        .setDescription(`ARE YOU SURE FOR BAN THIS MEMBER?\n－－－－－－－\n◈  Moderator: @${uTag}\n◈ User: ${member}\n◈ Reason: **  ${reason}**\n－－－－－－－`)
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
      if (!interaction.guild.members.me.permissions.has("BanMembers")) return interaction.reply({
      embeds: [new EmbedBuilder().setColor(client.color)    .setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR BANNED MEMBERS`)],
      ephemeral: true
      });
      if (b.customId === "yes") {
        await member.ban({reason})
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`BAN SUCCESS`)
            .setDescription(`SUCCESSFUL BANNED!\n－－－－－－－\n◈  Moderator: @${uTag}\n◈ User: ${member}\n◈ Reason: **${reason}**\n－－－－－－－`)
            .setFooter({
              text: `Colosseum Music Moderator`
            })
            .setTimestamp()
          ],
          components: []
        });
        await delay(5000);
        interaction.deleteReply();
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
        await delay(5000);
        interaction.deleteReply();
      }
    });
    
    collector.on('end', async () => {
      msg.edit({ content: `timeout!` })
      await delay(5000);
      msg.delete();
    });
  }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}