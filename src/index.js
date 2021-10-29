const { Client, MessageEmbed } = require('discord.js');
const client = new Client();

const { getWeather } = require("./request.js")

client.login(process.env.id);

client.on('ready', () => {
    console.log(`Bot is ready as ${client.user.tag}`);
    client.user.setPresence({ activity: { name: `the weather | "!help"`, type: "WATCHING" }, status: 'online' })
        // client.user.setAvatar("./src/avatar.png")
})

client.on('message', message => {
    // Receiving the message

    const symbol = "!";
    const input = message.content;

    if (input.startsWith(symbol)) {
        const arguments = input.substr(symbol.length);
        const [command] = arguments.split(" ");


        if (command === "help") {
            const helpEmbed = new MessageEmbed()
                .setTitle(`**Weather Bot Commands**`)
                .setColor("AQUA")
                .setThumbnail("https://19yw4b240vb03ws8qm25h366-wpengine.netdna-ssl.com/wp-content/uploads/5-Best-Free-and-Paid-Weather-APIs-2019-e1587582023501.png")
                .addFields({ name: "!weather", value: `Gives the weather of the requested place.\nInput: ** !weather City, Country **`, inline: true },
                    //
                    { name: "!help", value: `Lists all available commands and their descriptions\nInput: ** !help **`, inline: true },
                )
            message.channel.send(helpEmbed);
        }


        if (command === "weather") {
            const [city, country] = arguments.substr(command.length + 1).split(", ");
            getWeather(city, country)
            .then((info) => {
                message.react('👌')

                const newCity = city.charAt(0).toUpperCase() + city.slice(1)
                const newCountry = country.charAt(0).toUpperCase() + country.slice(1)


                // Aplicando los espacios para los mensajes
                const espacioDay = (espacios) =>{
                    do espacios += " ";
                    while (espacios.length<9);
                    return espacios
                }
                const espacioDes = (espacios) =>{
                    if (espacios.length < 17){
                        do espacios += " ";
                        while (espacios.length<17);
                        return espacios
                    }
                    else {
                        const newEspacio = espacios.slice(0,13) + '... '
                        return newEspacio
                    }
                }
                const espacioTem = (espacios) =>{
                    do espacios += " ";
                    while (espacios.length<6);
                    return espacios
                }


                const weatherEmbed = new MessageEmbed()
                    .setColor("AQUA")
                    .setTitle(`**Weather in ${newCity}, ${newCountry}**`)
                    .setThumbnail(`http://openweathermap.org/img/wn/${info.icon}@2x.png`)
                    .addField(info.text,'\u200B')
                
                message.channel.send(weatherEmbed);

                const signo = "```"
                message.channel.send(signo + "For the next week:\nDay      Description      Low   High  \n" + 
                                espacioDay(info.days[1]) + espacioDes(info.nextDaysDesctiption[1]) + espacioTem(info.nextDaysTempMin[1]) + espacioTem(info.nextDaysTempMax[1]) + "\n" +
                                espacioDay(info.days[2]) + espacioDes(info.nextDaysDesctiption[2]) + espacioTem(info.nextDaysTempMin[2]) + espacioTem(info.nextDaysTempMax[2]) + "\n" +
                                espacioDay(info.days[3]) + espacioDes(info.nextDaysDesctiption[3]) + espacioTem(info.nextDaysTempMin[3]) + espacioTem(info.nextDaysTempMax[3]) + "\n" + 
                                espacioDay(info.days[4]) + espacioDes(info.nextDaysDesctiption[4]) + espacioTem(info.nextDaysTempMin[4]) + espacioTem(info.nextDaysTempMax[4]) + "\n" +
                                espacioDay(info.days[5]) + espacioDes(info.nextDaysDesctiption[5]) + espacioTem(info.nextDaysTempMin[5]) + espacioTem(info.nextDaysTempMax[5]) + "\n" +
                                espacioDay(info.days[6]) + espacioDes(info.nextDaysDesctiption[6]) + espacioTem(info.nextDaysTempMin[6]) + espacioTem(info.nextDaysTempMax[6]) + signo)

                })
                .catch((error) => {
                    console.log(error)

                })
        }

    }

})