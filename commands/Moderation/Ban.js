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
    
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "no reason provided";
    
    const member = await interaction.guild.members.fetch(user.id);
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`You cannot ban ${user.username}, because it has a higher role`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
       return interaction.editReply({ embeds: [errEmbed], ephemeral: true });
       
    const bBan = await interaction.editReply({
      embeds: [
       new EmbedBuilder()
       .setColor(client.color)
       .setTitle(`!BAN WARNING`)
       .setDescription(`ARE YOU SURE FOR BANN THIS MEMBER ${user}`)
      ],
      components: [
        new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setCustomId('yes')
          .setLabel('YES')
          .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
          .setCustomId('no')
          .setLabel('NO')
          .setStyle(ButtonStyle.Danger),
        )
      ],
      ephemeral: true
    });
    
    const collector = bBan.messageCreateComponentCollector({
      componentType: ComponentType.Button
    })
    collector.on('collect', async (b) => {
      if (b.customId === 'yes') {
        await member.ban({reason})
        interaction.editReply({
        embeds: [new EmbedBuilder().setColor(client.color).setDescription(`BAN SUCESS FOR BANNING ${member}`)],
        components: [],
        ephemeral: true,
        });
      }
      if (b.customId === 'no') {
        interaction.editReply({
          embeds: [new EmbedBuilder().setColor(client.color).setDescription(`BAN CANCELED`)],
          components: [],
          ephemeral: true,
          });
      }
    });
    
    collect.on('end', async () =>{
      interaction.deleteReply().then (msg => msg.delete({ Timeout: 6000 }))
    });
  }
}