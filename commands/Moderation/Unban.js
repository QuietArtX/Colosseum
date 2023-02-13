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
      description: "input user id for unban",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
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
    await interaction.deferReply();
    
    const targetUsers = interaction.options.getUser("userid");
    const uTag = await interaction.user.tag;
    
    const targetMember = await interaction.guild.members.fetch(targetUsers)
    const targetMemberRolePosition = targetMember.roles.highest.position;
    const requestMemberRolePosition = interaction.member.roles.highest.position
    const botRolePosition = interaction.guild.members.me.roles.highest.position
    const PermsBot = interaction.guild.members.me.permissions.has("BanMembers")
    
    const erroleEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! BECAUSE THEY HAVE THE SAME/HIGHER ROLE THAN YOU.`);
    const ownEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! YOU CANT UNBAN OWNER!!`);
    const yourEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! YOU CANT UNBAN YOURSELF!!`);
    
    const timeoutBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNBAN TIMEOUT!`)
    .setDescription(`UNBANNED FAILED DUE TO OUT OF TIME!\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n◈ \n─────────────────────`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const succBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNBAN SUCCESS`)
    .setDescription(`SUCCESSFUL UNBANNED!\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n◈ \n─────────────────────`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const cnclBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNBAN CANCEL`)
    .setDescription(`CANCELED UNBANNED FOR!\n─────────────────────\n◈ User: ${targetMember}\n─────────────────────`)
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
        .setTitle(`UNBAN PENDING!`)
        .setDescription(`ARE YOU SURE FOR UNBAN THIS MEMBER?\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n─────────────────────`)
        .setFooter({
          text: `Colosseum Music Moderator | TIME 30s`
        })
        .setTimestamp()
      ],
      components: [actvButton]
    });
    
    const collector = msg.createMessageComponentCollector({
      filter: (b) => {
        if (b.user.id == interaction.user.id) return true;
        else {
          b.reply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`ACCESS DENIED!`)],
          ephemeral: true
          });
          return false;
        };
      },
      componentType: ComponentType.Button,
      time: 30000
    });
    
    collector.on('collect', async (b) => {
      if (!b.deferred) await b.deferUpdate();
      if (b.customId === "yes") {
        await interaction.guild.members.unban(targetUsers)
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