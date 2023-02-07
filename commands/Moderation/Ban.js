const {
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  name: ["ban"],
  description: "ban user from server",
  category: "Moderation",
  options: [
    {
      name: "target",
      description: "mention a user",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "provide a reason",
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
        isOwner: true,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user) => {
      await interaction.deferReply({ ephemeral: false })
      
      const { options, guild } = interaction
      const member = interaction.options.getMember("target")
      const reason = interaction.options.getString("reason") || "No reason provided"
      const members = guild.members.cache.get(user.id)
      
      if(member.id === user.id) return interaction.editReply(`You Can Banned Yourself`)
      if(guild.ownerId === member.id) return interaction.editReply(`Cant Ban Owner`)
      if(guild.members.roles.me.highest.position <= members.roles.highest.position) return interaction.editReply('can ban this member because your roles are same or higher')
      if(interaction.member.roles.highest.position <= members.roles.highest.position) return interaction.editReply(`can ban uu`)
      
      const Embed = new EmbedBuilder()
     .setColor(client.color)
     
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('ban-yes')
        .setStyle(ButtonStyle.Danger)
        .setLabel('Yes'),
        new ButtonBuilder()
        .setCustomId('ban-no')
        .setStyle(ButtonStyle.Secondary)
        .setLabel('No')
      );
        
      const msg = interaction.editReply({
        embeds: [
          Embed.setDescription(`are you serious about banning this guy?`)
          ],
        components: [row]
      });
      const collector = msg.createMessageComponentCollector({
        filter: (i) => {
          if (i.user.id === interaction.user.id) return true;
          else {
            i.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`Only **${interaction.user.tag}** can use this button, if you want then you've run the command again!`)], ephemeral: true });
            return false;
            };
        },
          time: 15000
        });
        
      collector.on('collect', i => {
        if(i.user.id !== user.id) return
        switch(i.customId) {
          case "ban-yes": {
            members.ban({ reason })
            interaction.editReply({
              embeds: [
                Embed.setDescription(`${members} has been banned from the server`)
                ],
              components: []
            })
          }
            break;
          case "ban-no": {
            interaction.editReply({
              embeds: [
                new Embed.setDescription(`Cancel!`)
                ],
              components: []
            })
          }
            break;
        }
      });
      
      collector.on('end', async(collected, reasons) => {
        if(reasons === 'time') {
          const timed = new EmbedBuilder()
          .setDescription(`**Timeout! Try again!**`)
          .setColor(client.color)
          msg.edit({ embeds: [timed], components: [] }).then(msg => msg.delete({ Timeout: 6000 }))
        }
      });
    }
}