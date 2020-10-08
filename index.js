require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
let token = process.env.TOKEN

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

let rawdata_users = fs.readFileSync('authUsers.json');
let authUsers = JSON.parse(rawdata_users);
let users = authUsers["users"];

let rawdata_servers = fs.readFileSync('serverData.json');
let serverData = JSON.parse(rawdata_servers);

let rawdata_planes = fs.readFileSync('planes.json');
let planesData = JSON.parse(rawdata_planes);

let airlineIndex = ['emirates']
let airlineIndexCaps = ['Emirates']

let prefix = "%"

function embedGenLink(title, message, url, smallTitle) { //Creates a properly formatted embed with a link.
	const embed = new Discord.MessageEmbed()
		.setColor('#ff2b41')
		.setTitle(title)
		.setURL(url)
		.setAuthor(smallTitle, 'https://i.imgur.com/nnvgK45.png', url)
		.setDescription(message)
		.setThumbnail('https://i.imgur.com/nnvgK45.png')
		.setTimestamp()
		.setFooter('© Oryp 2020', 'https://i.imgur.com/nnvgK45.png');
	return embed
}

function embedGenNoLink(title, message, smallTitle) { //Creates a properly formatted embed.
	const embed = new Discord.MessageEmbed()
		.setColor('#ff2b41')
		.setTitle(title)
		.setAuthor(smallTitle, 'https://i.imgur.com/nnvgK45.png')
		.setDescription(message)
		.setThumbnail('https://i.imgur.com/nnvgK45.png')
		.setTimestamp()
		.setFooter('© Oryp 2020', 'https://i.imgur.com/nnvgK45.png');
	return embed
}

function embedGenImageNoLink(title, message, smallTitle, logo, image) { //Creates a properly formatted embed.
	const embed = new Discord.MessageEmbed()
		.setColor('#ff2b41')
		.setTitle(title)
		.setAuthor(smallTitle, 'https://i.imgur.com/nnvgK45.png')
		.setDescription(message)
		.setThumbnail(logo)
		.setImage(image)
		.setTimestamp()
		.setFooter('© Oryp 2020', 'https://i.imgur.com/nnvgK45.png');
	return embed
}

function logsLookup(guild) {
	try {return serverData[guild]}
	catch {return 0}
}

client.on('ready', () => {
	console.log("Starting...")
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '%testverif') {
    let author = msg.author.id
	if (users.includes(author)) {
		msg.reply('You are allowed to create logs!');
	}
	else {
		msg.reply('You do not have permission to create logs.');
	}
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === '%help') {
    const embed = new Discord.MessageEmbed()
		.setColor('#ff2b41')
		.setTitle('pieBase Help Website')
		.setURL('https://dl.piemadd.com/')
		.setAuthor('pieBase Help', 'https://i.imgur.com/nnvgK45.png', 'https://dl.piemadd.com/')
		.setDescription('View the help page on the pieBase website for more information.')
		.setThumbnail('https://i.imgur.com/nnvgK45.png')
		.setTimestamp()
		.setFooter('© Oryp 2020', 'https://i.imgur.com/nnvgK45.png');
	msg.channel.send(embed);
  }
});

client.on('message', msg => {
	if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
	let author = msg.author.id
	if (msg.content.toLowerCase().startsWith("%newentry")) {
		if (users.includes(author)) {
			kontent = String(msg.content).substring(9, String(msg.content).length)
			const args = kontent.split(",, ");
			airline = "Airline: "  + args[0]
			plane = "Plane: " + args[1]
			startTime = "Time of Takeoff: " + args[2]
			endTime = "Time of Landing: " + args[3]
			departure = "Departure Airport: " + args[4]
			arrival = "Arrival Airport: " + args[5]
			notes = "Flight Notes: " + args[6]
			casualties = "Number of Casualties: " + args[7]
			try {
				if (args[0] == undefined || args[1] == undefined || args[2] == undefined || args[3] == undefined || args[4] == undefined || args[5] == undefined || args[6] == undefined || args[7] == undefined) {
				throw Error ('Var problem')
				}	
				embed = embedGenNoLink("Flight Log Entry", airline + "\n" + plane + "\n" + startTime + "\n" + endTime + "\n" + departure + "\n" + arrival + "\n" + notes + "\n" + casualties, "Log by " + msg.author.tag)
				msg.channel.send(embed)
				msg.delete()
				}
			catch {
				embed = embedGenNoLink("Flight Log Error", "No Arguments were passed or not enough arguments passed. Please try again.", "Error")
				msg.channel.send(embed)
			}
		}
		else {
		embed = embedGenNoLink("Flight Log Error", "You need to be a designated pilot to use this command.", "Error")
		msg.channel.send(embed)
		}
	}
});

function ObjectLength(object) {
    var length = 0;
    for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
    }
    return length;
};

function formatPlaneInfo(plane) {
	string = "Plane Name: " + plane.name + "\nPlane Spawncode: " + plane.spawncode + "\nLivery Number(s): " + plane.livery
	return string
}

function formatListPlanes(array) {
	i = 0
	str = ""
	while (i < array.length) {
		x = i + 1
		str = str + x.toString() + ".) " + array[i].name + "\n"
		i = i + 1
	}
	return str
}

client.on('message', msg => {
	if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
	let author = msg.author.id
	if (msg.content.toLowerCase().startsWith("%planedb")) {
		if (0 == 0) {
			kontent = String(msg.content).substring(9, String(msg.content).length)
			const args = kontent.split(",, ");
			if (args.length > 2) {
				embed = embedGenNoLink("Flight Log Error", "An incorrect number of arguments were passed. Please try again.", "Error")
				msg.channel.send(embed)
			}
			else if (args.length == 1) {
				try {
					name = args[0].toLowerCase()
					airlineID = airlineIndex.indexOf(name)
					airlineName = planesData[airlineID].name
					main = formatListPlanes(planesData[airlineID].planes)
					embed = embedGenNoLink(airlineName + " Airplanes", main, "Airplane List")
					msg.channel.send(embed)
				}
				catch {
					embed = embedGenNoLink("Airplane Database", "The airline passed is not a valid airline.", "Error")
					msg.channel.send(embed)
				}
			}
			else if (args.length == 2) {
				try {
					name = args[0].toLowerCase()
					airlineID = airlineIndex.indexOf(name)
					airlineName = planesData[airlineID].name
					planeID = args[1] - 1
					plane = planesData[airlineID].planes[planeID]
					main = formatPlaneInfo(plane)
					embed = embedGenImageNoLink(plane.name, main, "Airplane Info", planesData[airlineID].image, planesData[airlineID].planes[planeID].image)
					msg.channel.send(embed)
				}
				catch {
					embed = embedGenNoLink("Airplane Database", "The airplane ID does not correlate to an airplane.", "Error")
					msg.channel.send(embed)
				}
			}
			
		}
	}
});

client.on('message', msg => {
	if (!msg.content.toLowerCase().startsWith(prefix) || msg.author.bot) return;
	let author = msg.author.id
	if (msg.content.toLowerCase().startsWith("%airlinedb")) {
		try {
			i = 0
			str = ""
			while (i < airlineIndexCaps.length) {
				x = i + 1
				str = "- " + airlineIndexCaps[i] + "\n"
				i = i + 1
			}
			embed = embedGenNoLink("Airlines", str, "Airline List")
			msg.channel.send(embed)
		}
		catch {
			embed = embedGenNoLink("Airline Database", "Unknown error, please try again later.", "Error")
			msg.channel.send(embed)
		}
	}
});


client.on('message', msg => {
	kontent = msg.content
	kontent = kontent.toLowerCase()
  if (kontent === 'piebase sucks') {
    msg.reply('yeah, we know');
  }
});


client.login(token);