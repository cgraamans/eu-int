import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { MessageEmbed, CommandInteraction, Role } from "discord.js";
import discord from "../services/discord";
import {Eurobot} from "../../types/index";

const data = new SlashCommandBuilder()
	.setName('gruppierung')
	.setDescription('Erstellen Sie eine Gruppe mit anderen Benutzern');

data.addStringOption((option:SlashCommandStringOption)=>{
	option.setName('name')
		.setDescription('Name der Gruppe');
	return option;
});

data.addBooleanOption((option:SlashCommandBooleanOption)=>{
	option.setName('verlassen')
		.setDescription('Geben Sie an, ob Sie die ausgewählte Gruppe verlassen möchten');
	return option;
});

module.exports = {
	data: data,
	async execute(interaction:CommandInteraction) {

		if(!interaction.guild) return;

		const embed = new MessageEmbed();
		embed.setColor(0x001489);
		const stringOption = interaction.options.getString('name');
		const booleanOption = interaction.options.getBoolean('verlassen');

		if(!stringOption) {
			const groupRoles = interaction.guild.roles.cache
				.filter(role => role.name.endsWith("gruppe"))
				.map(role => role.name.substring(0, role.name.lastIndexOf("gruppe")));

			embed.setDescription('Hier sind die verfügbaren Gruppen:\n' + groupRoles.join(`\n`));
			embed.setTitle("Verfügbare Gruppen");
			await interaction.reply({embeds:[embed],ephemeral:true});
			return;

		}

		const user = interaction.guild.members.cache.get(interaction.member.user.id);
		const groupName = stringOption.replace(/\s/g, "") + 'gruppe';
		const groupRole = Array.from(interaction.guild.roles.cache.values()).find(role => role.name === groupName);

		if (booleanOption) {
			if (groupRole) {
				await user.roles.remove(groupRole);
				embed.setDescription('Du bist aus der ' + groupName + ' ausgestiegen!');
				embed.setTitle('Erfolgreich!');
				if (groupRole.members.size == 0) {
					groupRole.delete('All group members left');
				}
			} else {
				embed.setDescription('Es gibt keine Rolle mit diesem Namen');
				embed.setTitle('Unbekannte Rolle!');
			}
			await interaction.reply({embeds:[embed],ephemeral:true});
			return;
		}

		if (groupRole) {
			await user.roles.add(groupRole);
			embed.setDescription('Sie haben sich der ' + groupName + ' angeschlossen!');
			embed.setTitle('Erfolgreich!');
			await interaction.reply({embeds:[embed],ephemeral:true});
		} else { // Create a new group
			console.log('User roles: ' + Array.from(user.roles.cache.values()));
			if (Array.from(user.roles.cache.values()).filter(role => role.name.endsWith("gruppe")).length < 10) {
				interaction.guild.roles.create({
					name: groupName,
					mentionable: true,
					reason: user.username + ' created a new group'
				})
				.then(newRole => user.roles.add(newRole))
				.catch(console.error);

				embed.setDescription('Sie haben eine ' + groupName + ' geschaffen!');
				embed.setTitle('Erfolgreich!');
				await interaction.reply({embeds:[embed],ephemeral:true});
			} else { // Or reprimand the user for being too greedy
				embed.setDescription('Allzuviel ist ungesund. Sie können sich nicht mehr als 10 Rollen zuweisen!');
				embed.setTitle('Das ist zu viel!');
				await interaction.reply({embeds:[embed],ephemeral:true});
			}
		}
	}
};
