const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType
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
    
    const bEmbed = new EmbedBuilder()
    .setColor(client.color)
    
    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setCustomId('yes')
      .setLabel('YES')
      .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
      .setCustomId('no')
      .setLabel('NO')
      .setStyle(ButtonStyle.Secondary)
    );
    const msg = await interaction.editReply({ embeds: [bEmbed.setTitle(`!! BAN WARNING`).setDescription(`are you sure ban this member?`)], components: [row] });
    const collector = msg.createMessageComponentCollector({
      filter: (i) => {
        if (i.user.id === interaction.user.id) return true;
        else {
          i.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`Only **${interaction.user.tag}** can use this button, if you want then you've run the command again!`)], ephemeral: true });
          return false;
          };
      },
      time: 60000
    });
    
    collector.on('collect', async (b) => {
      if(!b.deferred) await b.deferUpdate()
      const id = interaction.customId
      if (id === "yes") {
        await member.ban({reason})
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`Ban!`)
        await interaction.reply({
          embeds: [embed],
          components: []
        })
      } else if(id === "no") {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setDescription(`NOO`)
        interaction.reply({
          embeds: [embed],
          components: []
        })
      }
    });
    
    collector.on('end', async(collected, del) => {
      if (del === 'time') {
            const timbed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle(`DELETED`)
              .setDescription(`Timeout! Please Try Again!`)
              msg.edit({ embeds: [timbed], components: [] }).then (msg => msg.delete({ timeout: 6000 }))
      }
    });
  }
}