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
  description: "muta member from this server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a target for unmute",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
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
    await interaction.deferReply();
    
    const targetUsers = interaction.options.getUser("target");
    const uTag = await interaction.user.tag
    
    const targetMember = await interaction.guild.members.fetch(targetUsers)
    const targetMemberRolePosition = targetMember.roles.highest.position;
    const requestMemberRolePosition = interaction.member.roles.highest.position
    const botRolePosition = interaction.guild.members.me.roles.highest.position
    const PermsBot = interaction.guild.members.me.permissions.has("ModerateMembers")
    
    if (!targetMember) return interaction.followUp({ content: `This user is not on the server` });
    if (!PermsBot) return interation.followUp({
      embeds: [new EmbedBuilder().setColor(client.color).setDescription(`I DON'T HAVE PERMISSIONS TO UNMUTE THIS MEMBERS`)]
    })
    
    const erroleEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! BECAUSE THEY HAVE THE SAME/HIGHER ROLE THAN YOU.`);
    const ownEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! YOU CANT UNMUTE OWNER!!`);
    const yourEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`ACCESS DENIED! YOU CANT UNMUTE YOURSELF!!`);
    const botEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`UPSS! YOU CAN'T BAN ME 🧸`);
    
    if (targetMember.id === interaction.guild.ownerId) return interaction.followUp({ embeds: [ownEmbed], ephemeral: true });
    if (targetMember.id === interaction.member.id) return interaction.followUp({ embeds: [yourEmbed], ephemeral: true });
    if (targetMember.id === interaction.client.user.id) return interaction.followUp({ embeds: [botEmbed], ephemeral: true })
    if (targetMemberRolePosition >= requestMemberRolePosition ) return interaction.followUp({ embeds: [erroleEmbed], ephemeral: true });
    
    const timeoutBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNMUTE TIMEOUT!`)
    .setDescription(`UNMUTE FAILED DUE TO OUT OF TIME!\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n─────────────────────`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const succBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNMUTE SUCCESS`)
    .setDescription(`SUCCESSFUL UNMUTE!\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n─────────────────────`)
    .setFooter({
      text: `Colosseum Music Moderator`
            })
    .setTimestamp()
    
    const cnclBan = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`UNMUTE CANCEL`)
    .setDescription(`CANCELED UNMUTE FOR!\n─────────────────────\n◈ User: ${targetMember}\n─────────────────────`)
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
        .setTitle(`UNMUTE PENDING!`)
        .setDescription(`ARE YOU SURE FOR UNMUTE THIS MEMBER?\n─────────────────────\n◈ Moderator: @${uTag}\n◈ User: ${targetMember}\n─────────────────────`)
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
        await targetMember.timeout(null)
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