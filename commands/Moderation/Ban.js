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
      name: "user",
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
      await interaction.deferReply({ ephemeral: false });
      
      const member = await interaction.guild.members.fetch(interaction.options.getUser('user'));
      const reason = interaction.options.getString('reason') || 'Not given';
      if (member.permissions.has("BanMembers") || member.permissions.has("BanMembers")) return interaction.editReply({ content: `You cant ban a moderator` });
      
      const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle(`BANNED!`)
      .setDescription(`ARE YOU SURE DUDE?!?!? LETS GOOO!!`)
      
      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('b-yes')
        .setLabel('YES')
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId('b-no')
        .setLabel('NO')
        .setStyle(ButtonStyle.Secondary)
      );
      
      const msg = await interaction.editReply({
        embeds: [Embed],
        components: [row]
      }).then( async (msg) => {
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
          if(!b.deffered) await b.deferUpdate()
          if(b.user.id !== user.id) return
          switch(b.customId) {
            case "b-yes":
              member.ban({ reason })
              const embed = new EmbedBuilder()
              .setTitle('BANNED SUCCESS!')
              .setDescription(`BANNED HAS SUCCESS\n\nUser: ${member.tag}\nReason: ${reason}`)
              return await msg.edit({ embeds: [embed], components: [] })
            break;
            case "b-no":
            const embed = new EmbedBuilder()
             .setTitle('BANNED CANCELED')
             .setDescription(`WHY YOU DONT BAN THIS USER?! ARE YOU IDIOOTS?`)
            return await msg.edit({ embeds: [embed], components: [] })
            break;
          }
        });
        collector.on('end', async (collected, timed) => {
          if(timed === "time") {
            const timbed = new EmbedBuilder()
              .setColor(client.color)
              .setTitle(`DELETED`)
              .setDescription(`Timeout! Please Try Again!`)
              return await msg.edit({ embeds: [timbed], components: [] }).then (msg => msg.delete({ timeout: 6000 }))
          }
        });
      })
    }
}