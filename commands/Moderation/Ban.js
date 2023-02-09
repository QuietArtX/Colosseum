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
    await interaction.deferReply({ ephemeral: true });
    const { channel, options } = interaction;
    
    const user = interaction.options.getUser("target");
    const reason = interaction.options.getString("reason") || "no reason provided";
    
    const member = interaction.guild.members.fetch(user.id);
    
    const errEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`You cannot ban ${user.username}, because it has a higher role`);
    
    if (member.roles.highest.position >= interaction.member.roles.highest.position)
       return interaction.editReply({ embeds: [errEmbed], ephemeral: true })
    
    await member.ban({reason});
    
    const bEmbed = new EmbedBuilder()
    .setColor(client.color)
    .setTitle(`!! BAN WARNING`)
    .setDescription(`are you sure ban this member?`);
    
    const row = ActionRowBuilder()
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
    const msg = await interaction.editReply({ embeds: [bEmbed], components: [row] });
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
    
    collector.on('collect', async (b) =>{
      if (!s.deffered) await s.deferUpdate()
      if (b.user.id !== user.id) return;
      if (b.customId === 'yes') {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`SUCCES`)
        .setDescription(`BAN MEMBER : ${user}\nSUCCESSFULL\nREASON : ${reason}`)
        return msg.edit({ embeds: [embed], components: [] }).then (member => member.ban({reason}))
      }
      if (b.customId === 'no') {
        const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`CANCEL`)
        .setDescription(`CANCELED`)
        return await msg.edit({ embeds: [embed], components: [] })
      }
    });
    
    collector.end('end', async(collected, del) => {
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