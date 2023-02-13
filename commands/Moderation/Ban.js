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
    .setDescription(`ACTION DENIED!ACCESS DENIED! BECAUSE YOUR ROLE IS LOWER THAN HIM`);
 
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.editReply({
      embeds: [errEmbed],
      ephemeral: true
    });
    
    const timeoutBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`BAN TIMEOUT!`)
    .setDescription(`BANNED FAILED DUE TO OUT OF TIME!\n－－－－－－－\n◈  Moderator: @${uTag}\n◈ User: ${member}\n◈ Reason: **${reason}**\n－－－－－－－`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const succBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`BAN SUCCESS`)
    .setDescription(`SUCCESSFUL BANNED!\n－－－－－－－\n◈  Moderator: @${uTag}\n◈ User: ${member}\n◈ Reason: **${reason}**\n－－－－－－－`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const cnclBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`BAN CANCEL`)
    .setDescription(`CANCELED BANNED FOR!\n－－－－－－－\n◈User: ${member}\n◈ Reason: **${reason}**\n－－－－－－－`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const actvButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId(`yes`)
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId(`cancel`)
          .setLabel('CANCEL')
          .setStyle(ButtonStyle.Secondary)
        )
    
    const deactvButton = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
          .setCustomId(`yes`)
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger)
          .setDisabled(true),
          new ButtonBuilder()
          .setCustomId(`cancel`)
          .setLabel('CANCEL')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
        )
    
    const msg = await interaction.editReply({
      embeds: [
        new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`BAN PENDING!`)
        .setDescription(`ARE YOU SURE FOR BAN THIS MEMBER?\n－－－－－－－\n◈  Moderator: @${uTag}\n◈ User: ${member}\n◈ Reason: **  ${reason}**\n－－－－－－－`)
        .setFooter({
          text: `Colosseum Music Moderator | TIME 30s`
        })
        .setTimestamp()
      ],
      components: [actvButton]
    });
    
    const collector = msg.createMessageComponentCollector({
      filter: (b) => {
        if (!interaction.guild.members.me.permissions.has("BanMembers")) return interaction.reply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`ACCESS DENIED! YOU DO NOT HAVE ACCESS FOR BANNED MEMBERS`)],
          ephemeral: true
      });
      },
      componentType: ComponentType.Button,
      time: 30000
    });
    
    collector.on('collect', async (b) => {
      if (!b.deferred) await b.deferUpdate();
      if (b.customId === "yes") {
        await member.ban({reason})
        interaction.editReply({
          embeds: [succBan],
          components: [deactvButton]
        });
        await delay(10000);
        interaction.deleteReply();
      }
      if (b.customId === "cancel") {
        interaction.editReply({
          embeds: [cnclBan],
          components: [deactvButton]
        });
        await delay(10000);
        interaction.deleteReply();
      }
    });
    
    collector.on('end', async () => {
      msg.edit({ content: ` `, embeds: [timeoutBan], components: [deactvButton] })
      await delay(10000);
      msg.delete();
    });
  }
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}