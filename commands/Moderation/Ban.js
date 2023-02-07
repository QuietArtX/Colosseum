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
    run: async (interaction, client, user, guild) => {
      await interaction.deferReply({ ephemeral: false })
      
      const { options } = interaction
      const member = interaction.options.getMember("target")
      const reason = interaction.options.getString("reason") || "No reason provided"
      
      if(member.id === user.id) return interaction.editReply(`You Can Banned Yourself`)
      if(guild.ownerId === member.id) return interaction.editReply(`Cant Ban Owner`)
      if(interaction.member.roles.highest.position => member.roles.highest.position) return interaction.editReply('can ban this member because your roles are same or higher')
      
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
        
      const page = interaction.editReply({
        embeds: [
          Embed.setDescription(`are you serious about banning this guy?`)
          ],
        components: [row]
      });
      const collector = page.createMessageComponentCollector({
          componentType: componentType.Button,
          time: 15000
        });
        
      collector.on('collect', async (i) => {
        if(i.user.id !== user.id) return

        switch(i.customId) {
          case "ban-yes": {
            member.ban({ reason })
            interaction.editReply({
              embeds: [
                new EmbedBuilder().setDescription(`${member} has been banned from the server`)
                ],
              components: []
            })
          }
            break;
          case "ban-no": {
            interaction.editReply({
              embeds: [
                new EmbedBuilder().setDescription(`Cancel!`)
                ],
              components: []
            })
          }
            break;
        }
      });
      
      collector.on('end', async(collected) => {
        interaction.editReply({
              embeds: [
                new EmbedBuilder().setDescription(`Cancel!`)
                ],
              components: []
            })
      });
    }
}