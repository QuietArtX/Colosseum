const {
  EmbedBuilder,
} = require("discord.js");
const moment = require("moment");

module.exports = {
    name: ["premium", "list"],
    description: "Setup channel song request",
    category: "Premium",
    permissions: {
        channel: [],
        bot: [],
        user: []
    },
    settings: {
        isPremium: true,
        isPlayer: false,
        isOwner: false,
        inVoice: false,
        sameVoice: false,
    },
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   */
  run: async (interaction, client, user) => {
    await interaction.deferReply({ ephemeral: true })

    let data = client.premiums
      .filter((data) => data?.isPremium === true)
      .map((data) => {
        return `• **Username:** <@${data.Id}\n• **Plan** : **${
          data.premium.plan
        }**\n• **Expire At** :  <t:${Math.floor(
          data.premium.expiresAt / 1000
        )}:F> `;
      });

    interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`LIST PREMIUM USERS`)
          .setColor(client.color)
          .setDescription(data.join("\n") || "No Premium User Found"),
      ],
    });
  },
};