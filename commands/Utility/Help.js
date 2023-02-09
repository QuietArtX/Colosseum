const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: ["help"],
    description: "Displays all commands that the bot has.",
    category: "Utility",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: false,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
    run: async (interaction, client, user, language) => {
        await interaction.deferReply({ ephemeral: false });
        
        const categories = readdirSync("./commands/")

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 })
            .setTitle(`Colosseum Music`)
            .setDescription(`I Am **${client.user.tag\n}**!\nAn Advenced Discord Music Bot With Many Features!\nSupport Many Source\nYouTube • SoundCloud • Spotify • etc.\nAnd **Premium** users are available`)

        const row = new ActionRowBuilder()
            .addComponents([
                new SelectMenuBuilder()
                    .setCustomId("help-category")
                    .setPlaceholder(`Please Select Category!`)
                    .setMaxValues(1)
                    .setMinValues(1)
                    /// Map the categories to the select menu
                    .setOptions(categories.map(category => {
                        return new SelectMenuOptionBuilder()
                            .setLabel(category)
                            .setValue(category)
                        }
                    ))
                ])

            interaction.editReply({ embeds: [embed], components: [row] }).then(async (msg) => {
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
                collector.on('collect', async (m) => {
                    if(m.isSelectMenu()) {
                        if(m.customId === "help-category") {
                            await m.deferUpdate();
                            let [directory] = m.values;

                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `${interaction.guild.members.me.displayName} Help Command!`, iconURL: interaction.guild.iconURL({ dynamic: true })})
                                .setDescription(`prefix is: \`/\``)
                                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                                .setColor(client.color)
                                .addFields({ name: `▸  ${directory.toUpperCase()} [${client.slash.filter(c => c.category === directory).size}]`, value: `${client.slash.filter(c => c.category === directory).map(c => `\`${c.name.at(-1)}\``).join(", ")}`, inline: false })
                                .setFooter({ text: `© ${interaction.guild.members.me.displayName} | Total Commands: ${client.slash.size}`, iconURL: client.user.displayAvatarURL({ dynamic: true })})

                            msg.edit({ embeds: [embed] });
                        }
                    }
                });

            collector.on('end', async (collected, reason) => {
                if(reason === 'time') {
                    const timed = new EmbedBuilder()
                    .setDescription(`**Timeout! Try again!**`)
                    .setColor(client.color)

                    msg.edit({ embeds: [timed], components: [] }).then(msg => msg.delete({ Timeout: 6000 }))
                }
            });
        })
    }
}