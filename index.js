const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
	console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
	bot.user.setActivity("サーバー管理!", {type: "PLAYING"});
});

bot.on("guildMemberAdd", async member => {
	console.log(`${member.id} joined the server.`);
	
	let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
	welcomechannel.send(`take that grin off your face! your in my house now >O ${member} has joined the server!`);
});

bot.on("guildMemberRemove", async member => {
	console.log(`${member.id} left the server.`);
	
	let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
	welcomechannel.send(`GOOD RIDDANCE!! ${member} has been one hit KO'D!`);
});

bot.on("channelCreate", async channel => {
	console.log(`${channel.name} has been created.`);
	
	let sChannel = channel.guild.channels.find(`name`, "important_notices");
	sChannel.send(`${channel} has been created`);
});

bot.on("channelDelete" ,async channel => {
	console.log(`${channel.name} has been deleted.`);
	
	let sChannel = channel.guild.channels.find(`name`, "important_notices");
	sChannel.send(`${channel.name} has been deleted`);
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	
	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0]
	let args = messageArray.slice(1);
	
	if(cmd === `${prefix}clear`){
		
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("oof.");
		if(!args[0]) return message.channel.send("oof.");
		message.channel.bulkDelete(args[0]).then(() => {
			message.channel.send(`cleared ${args[0]} messages.`).then(msg => msg.delete(5000));
		});
	}
	
	if(cmd === `${prefix}say`){
		
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("No");
		let botmessage = args.join(" ");
		message.delete().catch();
		message.channel.send(botmessage);
	}
		
	if(cmd === `${prefix}ban`){
		
		let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if (!bUser) return message.channel.send("Cant find user!");
		let bReason = args.join(" ").slice(22);
		if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("Invalid! You are not allowed to use that command!");
		if(bUser.hasPermission("MANAGE_MESSAGES"))return message.channel.send("That person can't be banned!");
		
		let banEmbed = new Discord.RichEmbed()
		.setDescription("~Ban~")
		.setColor("#bc0000")
		.addField("Banned User", `${bUser} with ID ${bUser.id}`)
		.addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
		.addField("Banned In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", bReason);
		
		let incidentChannel = message.guild.channels.find(`name`, "incidents");
		if(!incidentChannel) return message.channel.send("Cant find incidents channel..");
		
		message.guild.member(bUser).ban(bReason);
		incidentChannel.send(banEmbed);
		
		return;
		
	}
	
	if(cmd === `${prefix}kick`){
		
		let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if (!kUser) return message.channel.send("Cant find user!");
		let kReason = args.join(" ").slice(22);
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Invalid! You are not allowed to use that command!");
		if(kUser.hasPermission("MANAGE_MESSAGES"))return message.channel.send("That person can't be kicked!");
		
		let kickEmbed = new Discord.RichEmbed()
		.setDescription("~kick~")
		.setColor("#e56b00")
		.addField("Kicked User", `${kUser} with ID ${kUser.id}`)
		.addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
		.addField("Kicked In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", kReason);
		
		let kickChannel = message.guild.channels.find(`name`, "incidents");
		if(!kickChannel) return message.channel.send("Cant find incidents channel..");
		
		message.guild.member(kUser).kick(kReason);
		kickChannel.send(kickEmbed);
		
		return;
	}
	
	if(cmd === `${prefix}report`){
		
		let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!rUser) return message.channel.send("Coulden't find user.");
		let reason = args.join(" ").slice(22);
		
		let reportEmbed = new Discord.RichEmbed()
		.setDescription("Reports")
		.setColor("#15f153")
		.addField("Reported User", `${rUser} with ID: ${rUser.id}`)
		.addField("Reported By", `${message.author} with ID: ${message.author.id}`)
		.addField("Channel", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", reason);
		
		let reportschannel = message.guild.channels.find(`name`, "reports");
		if(!reportschannel) return message.channel.send("Coulden't find reports channel");
		
		
		message.delete().catch(O_o=>{});
		reportschannel.send(reportEmbed);
		
		return;
	}
  
  if(cmd === `${prefix}help`){
    return message.channel.send("Hello, ok so you want my help? no problem. My prefix is i+ and my commands are as follows: \n i+help \n i+ban \n i+kick \n i+botinfo \n i+say \n Do be aware the ban kick and say commands require admin powers. \n This was to avoid bot spam");
  }
  
	if(cmd === `${prefix}botinfo`){
		
		let bicon = bot.user.displayAvatarURL;
		let botembed = new Discord.RichEmbed()
		.setDescription("Bot Information")
		.setColor("#15f153")
		.setAuthor("I-26", "https://tiniermeprofilelayoutcentral.weebly.com/uploads/7/7/0/2/7702876/i-26_orig.png")
		.setThumbnail(bicon)
		.addField("Bot Name", bot.user.username)
		.addField("Created On", bot.user.createdAt)
		.addField("Bot version", botconfig.version)
		.addField("Bot Devloper", botconfig.devloper)
		.addField("More Info", botconfig.dev)
		.addField("Dev Website", botconfig.link)
		.setImage("https://tiniermeprofilelayoutcentral.weebly.com/uploads/7/7/0/2/7702876/i-26_orig.png")
		.setFooter("I created this bot useing the, Discord.js API", "https://tiniermeprofilelayoutcentral.weebly.com/uploads/7/7/0/2/7702876/i-26_orig.png")
		.setTimestamp();
		
		return message.channel.send(botembed);
	}
	
});

bot.login(process.env.BOT_TOKEN);
