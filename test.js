const Discord = require("discord.js")
const fs = require('fs')
const client = new Discord.Client()
var data = null
var save = null
var stop = false
const ADMIN = ["515240299660967957","229509268154351617","299560596976697344"]
const separator = "\n--------------=<( ⚜ )>=--------------\n"
const craftable = ["potions","armes","armures"]
const prefix = ","
var timers = {}

client.login("")

client.on("ready" , () => {
	data = loadFile('data.json')
	save = loadFile('save.json')
	for(playerID in save.players){
		timers[playerID] = {
			"aventure": newDate(),
			"mine": newDate(),
			"garde": newDate(),
			"récolte": newDate(),
			"taverne": newDate()
		}
	}
	client.user.setActivity(`${prefix}help | ${client.guilds.size} serveurs !`)
    console.log("\nBot prêt ! \n-------------------------------------------")
})

client.on("message", function (message){
	if(message.system || message.author.bot || message.channel.type === 'dm')return;
    if(!ADMIN.includes(message.guild.owner.id))ADMIN.push(message.guild.owner.id)
    if(stop && message.member.id !== "515240299660967957")return;
    if (message.content.startsWith(prefix + "help")){
	    var embed = new Discord.RichEmbed()
	        .setTitle("Besoin d'aide ?!")
	        .setDescription('Voici toutes les commandes :wink:'+separator)
	       	.setThumbnail(client.user.avatarURL)
	       	.addField("Spéciales :",
				`> \`${prefix}start\` - Commencer l'aventure !\n`+
	       		`> \`${prefix}sexe\` - Changer de sexe :new: \n`+
				`> \`${prefix}titre <num>\` - Changer de titre`
	       	)
	        .addField("Informations :",
				`> \`${prefix}help\` - Voir ce menu\n`+
				`> \`${prefix}inventaire\` - Voir l'inventaire\n`+
				`> \`${prefix}profil\` - Voir le profil\n`+
				`> \`${prefix}info <donnée>\` - Informations sur une donnée du jeu :new: \n`+
				`> \`${prefix}titres\` - Voir vos titres\n`+
				`> \`${prefix}shop\` - Afficher la boutique\n`+
				`> \`${prefix}crafting\` - Afficher les crafts possibles`
			)
			.addField("Gestion des ressources :",
				`> \`${prefix}équiper <équipement>\` - S'équiper d'une armure ou d'une arme\n`+
				`> \`${prefix}potion <potion>\` - Boire une potion\n`+
				`> \`${prefix}craft <item>\` - Convertir vos ressources en items\n`+
				`> \`${prefix}banque <quantité> <ressource>\` - \`${prefix}banque\` pour plus d'info\n`+
				`> \`${prefix}send <quantité> <ressource> @membre\` - Faire un don\n`+
				`> \`${prefix}buy <item>\` - Achèter un item de la boutique`
			)
		let activités = [`> \`${prefix}loto\` - Payez 10 pièces d'or, remportez ~~peut être~~ le gros lot !`]
		for(activité in data.activités){
			let s = "";if(data.activités[activité].timer.quantité>1)s="s";
			activités.push(`> \`${prefix}${activité}\` - Toutes les ${data.activités[activité].timer.quantité} ${data.activités[activité].timer.unité+s}.`)
		}
		embed.addField("Activités :",activités.join('\n'))
		if(ADMIN.includes(message.author.id)){
			embed.addField("🚫 Commandes de "+message.member.displayName,
				`> \`${prefix}stop\` - Empèche l'utilisation du bot\n`+
				`> \`${prefix}reset (@member)\` - Réinitialise les timers\n`+
				`> \`${prefix}give <quantité> @member\` - Money money 💸`
			)
		}
        message.channel.send(embed)

    }else if(message.content.startsWith(prefix + "update")){
        let newIndex = loadText('test.js')
            .replace(`message.content.startsWith(prefix + "update")`,'false')
            .replace("NTE1NDA3NjQwNzIyMTQ1Mjgx.Dtkq_A.5ZiaoOnCKASBZcqOzP5K_vRmOes","NTA5NzU4OTQzMTYyMjY5Njk4.Ds3-3w.e3culTSsbKzXkabu03nQJWQHTfU")
        saveText('index.js',newIndex)

    }else if(message.content.startsWith(prefix + "info")){
    	let bonnesCatégories = ["armures","armes","potions","ressources","ennemis","activités"]
    	let trucRecherché = message.content.replace(prefix + "info",'').replace(/è/g,'e').replace(/é/g,'e').toLowerCase().trim()
    	if(trucRecherché.length === 0)return message.channel.send(`:x: Vous n'avez pas renseigné(e) de donnée à afficher.`)
    	for(category in data){
    		if(bonnesCatégories.includes(category)){
    			for(element in data[category]){
    				if(element.replace(/è/g,'e').replace(/é/g,'e').includes(trucRecherché)){
    					// Trouvé !
    					let item = data[category][element]
    					let embed = new Discord.RichEmbed()
    						.setTitle(`Caractéristiques de ${capitalize(element)}`)
    						.setDescription(`${message.member} jette un oeil aux données du jeu...${separator}`)
    					if(category === "armures" || category === "armes"){
    						let puis = ""
    						let res = ""
    						let stt = ""
    						let fx = ""
    						if(item.hasOwnProperty('puissance')){
    							puis = `Augmente la force de ${item.puissance}%\n`
    						}
    						if(item.hasOwnProperty('résistance')){
    							res = `Réduit les dégâts reçus de ${item.résistance}%\n`
    						}
    						if(item.hasOwnProperty('status')){
    							stt = infoStatus(item.status)
    						}
    						if(item.hasOwnProperty('effets')){
    							fx = infoStatus(item.effets)
    						}
    						embed.addField(`Equipements`,`Les armures et les armes servent à augmenter respectivement la résistance et la puissance lors des combats. Leur durabilité baisse à chaque combat.${separator}`,false)
    						embed.addField(capitalize(element),
    							`Coûte ${item.prix} pièces d'or\n`+
    							`Dure pendant ${item.durabilité} combats\n`+
    							`${puis}${res}${stt}${fx}`
    						,true)
    						embed.addField(`Crafting`,infoCrafting(item.crafting),true)
    					}else if(category === "potions"){
    						let stt = ""
    						let fx = ""
    						if(item.hasOwnProperty('status')){
    							stt = infoStatus(item.status)
    						}
    						if(item.hasOwnProperty('effets')){
    							fx = infoEffets(item.effets)
    						}
    						embed.setThumbnail("https://cdn.discordapp.com/attachments/513847079857029135/513847272082243610/potion.png")
    						embed.addField(`Potions`,`Les potions servent à revenir dans la partie, éloigner les monstres, augmenter les gain ou bien la force... Vous ne pourrez pas vous passer de leurs effets si vous voulez avancer dans le jeu !${separator}`,false)
    						embed.addField(capitalize(element),
    							`Coûte ${item.prix} pièces d'or\n`+
    							`${fx}${stt}`
    						,true)
    						embed.addField(`Crafting`,infoCrafting(item.crafting),true)
    					}else if(category === "ressources"){
    						embed.addField(`Ressources`,`Des ressources peuvent s'obtenir grâce à toutes les activités, elles vous seront utiles pour le craft et le commerce.${separator}`,false)
    						embed.addField(`${item.logo} `+capitalize(element),
    							`Coûte ${item.prix*10} pièces d'or par lot de 10`
    						,true)
    					}else if(category === "ennemis"){
    						embed.addField(`Ennemis`,`Vous rencontrerez des ennemis aléatoirement dans toutes les activités, ils sont dangereux mais donnent des ressources obtenables nulle part ailleur.${separator}`,false)
    						embed.setThumbnail(item.image)
    						embed.addField(capitalize(element),
    							`Sa force est de ${item.force}\n`+
    							`${capitalize(directSexe(item.sexe).il)} possède ${item.vie} points de vie`
    						,true)
    						embed.addField(`Loots`,infoLoots(item.loots),true)
    					}else{
    						let ennemis = []
    						for(ennemi in item.ennemis){
    							ennemis.push(`> ${Math.round(item.ennemis[ennemi]*10*10)/10} chances sur 10 de rencontrer ${ennemi}`)
    						}
    						let ressources = []
    						for(ressource in item.ressources){
    							ressources.push(`> ${Math.round(item.ressources[ressource].chances*10*10)/10} chances sur 10 de trouver ${item.ressources[ressource].quantité[0]} à ${item.ressources[ressource].quantité[1]} ${ressource}`)
    						}
    						embed.addField(`Activités`,`Trouvez des ressources, de nouveaux ennemis et des équipements ! Impossible d'avancer dans le jeu si vous glandouillez chez vous :wink: ${separator}`,false)
    						embed.addField(capitalize(element),
    							`Faisable toutes les ${item.timer.quantité} ${item.timer.unité}s\n`+
    							`Vous pourrez y trouver entre ${item["pièces d'or"][0]} et ${item["pièces d'or"][1]} pièces d'or\n`+
    							`Vous avez ${Math.round(item.sanctuaire*10*10)/10} chances sur 10 de trouver un sanctuaire`
    						,true)
    						embed.addField(`Ennemis rencontrables`,`\`\`\`java\n${ennemis.join('\n')}\`\`\``,true)
    						embed.addField(`Ressources trouvables`,`\`\`\`java\n${ressources.join('\n')}\`\`\``,true)
    					}
    					return message.channel.send(embed)
    				}
    			}
    		}
    	}
    	message.channel.send(`:x: Je n'ai pas trouvé la donnée que vous recherchez. (${trucRecherché})`)

    }else if(message.content.startsWith(prefix + "sexe")){
    	let member = message.member
    	if(inscrit(member)){
    		if(save.players[member.id].sexe === "homme"){
    			save.players[member.id].sexe = "femme"
    		}else{
    			save.players[member.id].sexe = "homme"
    		}
    		let embed = new Discord.RichEmbed()
    			.setTitle(`🔃 Changement de sexe`)
    			.setThumbnail(member.user.avatarURL)
    			.setDescription(`Cette fonction vous permet d'adapter les textes du jeu à votre sexe.${separator}${member} est maintenant considéré${sexe(member).e} comme un${sexe(member).e} ${save.players[member.id].sexe}.`)
    		message.channel.send(embed)
    		saveFile("save.json",save)
    	}else{
    		message.channel.send(pascompte(member))
    	}

    }else if(message.content.startsWith(prefix + "titres")){
    	let member = message.member
    	if(inscrit(member)){
    		let num = 0
    		let embed = new Discord.RichEmbed()
    			.setTitle(`📜 Voici une liste des titres de ${member.displayName}`)
    			.setThumbnail(member.user.avatarURL)
    			.setDescription(`Pour changer de titre, faites la commande \`.titre <num>\`.${separator}`)
    			.addField(`Titres :`,save.players[member.id].titres.map(function(titre){
    				num ++
    				return `[ **\`${num}\`** ] - "${titre}"`
    			}).join('\n'))
    		message.channel.send(embed)
    	}else{
    		message.channel.send(pascompte(member))
    	}

    }else if(message.content.startsWith(prefix + "titre")){
    	let member = message.member
    	if(inscrit(member)){
    		let num = Number(message.content.replace(prefix + "titre",'').trim())
    		if(num===NaN||num===undefined)return message.channel.send(`:x: Vous devez rentrer le numéro du titre que vous voulez porter.`)
    		if(num < 1){
    			num = 1
    		}else if(num > save.players[member.id].titres.length){
    			num = save.players[member.id].titres.length
    		}
    		save.players[member.id].titre = num-1
    		saveFile("save.json",save)
    		let embed = new Discord.RichEmbed()
    			.setTitle(`📜 ${member.displayName} vient de changer son titre.`)
    			.setThumbnail(member.user.avatarURL)
    			.setDescription(`Son nouveau titre : "${save.players[member.id].titres[save.players[member.id].titre]}"`)
    		message.channel.send(embed)
    	}else{
    		message.channel.send(pascompte(member))
    	}

    }else if(message.content.startsWith(prefix + "loto")){
    	let member = message.member
    	if(inscrit(member)){
    		if(save.players[member.id]["pièces d'or"] >= 10){
    			let embed = new Discord.RichEmbed()
    				.setTitle(`🎟 ${member.displayName} achète un ticket de loto.`)
    				.setDescription(`${capitalize(sexe(member).il)} le gratte...${separator}`)
    			if(Math.random()<1/200){
    				embed.addField(`🎉 C'est gagné !`,`Félicitation, vous remportez la somme de ${save.loto} pièces d'or, faites-en bon usage !\nLa cagnote est réinitialisée.`)
    				embed.setThumbnail("https://cdn.discordapp.com/attachments/513847079857029135/514736167963328513/coffre_dor.png")
    				save.players[member.id]["pièces d'or"] += save.loto
                    save.players[member.id].compteurs["tickets de loto"].gagnants ++
    				save.players[member.id].titres.push(`Un ticket de loto, **${save.loto} pièces d'or**. Qui fait mieux ? 😏`)
    				save.loto = data.defaut.save.loto
    				saveFile("save.json",save)
    			}else if(Math.random()<1/3){
    				embed.addField(`C'est remboursé 😇`,`Vos 10 pièces vous ont été rendues.`)
                    save.players[member.id].compteurs["tickets de loto"].remboursés ++
                    saveFile("save.json",save)
    			}else{
    				embed.addField(`😦 C'est perdu...`,`Vos 10 pièces d'or font maintenant parties de la cagnotte.`,false)
    				save.players[member.id]["pièces d'or"] -= 10
                    save.players[member.id].compteurs["tickets de loto"].perdants ++
    				save.loto += 10
    				saveFile("save.json",save)
    			}
    			message.channel.send(embed)
    		}else{
    			message.channel.send(`:x: Il vous manque ${10-save.players[member.id]["pièces d'or"]} pièces d'or pour tenter votre chance.`)
    		}
    	}else{
    		message.channel.send(pascompte(member))
    	}

    }else if(message.content.startsWith(prefix + "stop")){
        if(!ADMIN.includes(message.author.id)) return;
        stop = !stop
    	if(stop){
    		message.channel.send("Mode stop : **Activé** !\nDésormais, seul <@"+MAHANO+"> peut avoir accès à mes commandes !")
        	client.user.setStatus('dnd')
    	}else{
    		message.channel.send("Mode stop : **Désactivé** !\nDésormais, tout le monde peut avoir accès à mes commandes !")
        	client.user.setStatus("online")
    	}

    }else if(message.content.startsWith(prefix + "start")){
		if(!inscrit(message.member)){
			var embed = new Discord.RichEmbed()
				.setTitle("✅ Compte créé !")
				.setDescription("50 pièces d'or vous ont été données pour un bon départ !")
			message.channel.send(embed)
			inscription(message.member)
			saveFile('save.json',save)
		} else {
			message.channel.send(":x: Vous avez déjà un compte !")
		}

	}else if(message.content.startsWith(prefix + "potion")){
		let member = message.member
		if(inscrit(member)){
			let objName = message.content.replace(prefix + "potion","").toLowerCase().replace(/è/g,'e').replace(/é/g,'e').trim()
			if(objName.length > 1){
				for(potion in save.players[member.id].inventaire.potions){
					let checkPotion = potion.replace(/è/g,'e').replace(/é/g,'e')
					if(checkPotion.includes(objName)){
						let embed = usePotion(potion,member)
						saveFile("save.json",save)
						return message.channel.send(embed)
					}
				}
				message.channel.send(`:x: Aucune "${objName}" ne se trouve dans votre inventaire.`)
			}else{
				message.channel.send(`:x: Vous devez marquer le nom ou un bout du nom de la potion que vous voulez utiliser.`)
			}
		}else{
			message.channel.send(pascompte(message.member))
		}

	}else if(message.content.startsWith(prefix + "équiper")){
		let member = message.member
		if(inscrit(member)){
			let objName = message.content.replace(prefix + "équiper","").toLowerCase().replace(/è/g,'e').replace(/é/g,'e').trim()
			if(objName.length > 1){
				for(armure in save.players[member.id].inventaire.armures){
					let checkArmure = armure.replace(/è/g,'e').replace(/é/g,'e')
					if(checkArmure.includes(objName)){
						let embed = useEquipement('armures',armure,member)
						return message.channel.send(embed)
					}
				}
				for(arme in save.players[member.id].inventaire.armes){
					let checkArme = arme.replace(/è/g,'e').replace(/é/g,'e')
					if(checkArme.includes(objName)){
						let embed = useEquipement('armes',arme,member)
						return message.channel.send(embed)
					}
				}
				message.channel.send(`:x: Aucun(e) "${objName}" ne se trouve dans votre équipement.`)
			}else{
                for(armure in save.players[member.id].inventaire.armures){
                    useEquipement('armures',armure,member)
                }
                for(arme in save.players[member.id].inventaire.armes){
                    useEquipement('armes',arme,member)
                }
                let embed = new Discord.RichEmbed()
                    .setTitle(`✅ ${member.displayName} s'équipe entièrement`)
                    .setDescription(`Tout l'équipement équipable de son inventaire est maintenant sur ${sexe(member).lui}.`)
                message.channel.send(embed)
			}
		}else{
			message.channel.send(pascompte(message.member))
		}
    }else if(message.content.startsWith(prefix + "guilde")){


    }else if(message.content.startsWith(prefix + "devise")){
        let member = message.member
        if(inscrit(member)){
            if(ADMIN.includes(member.id)){
                if(message.guild.owner.id === member.id){
                    let devise = message.content.replace(prefix + "devise","").trim()
                    debugGuilde(message.guild.id)
                    save.guildes[message.guild.id].devise = devise
                    let embed = new Discord.RichEmbed()
                        .setTitle(`🆕 Nouvelle devise de guilde`)
                        .setDescription(`${member} change la devise de la guilde.${separator}`)
                        .addField("Nouvelle devise",`*"${devise}"*`)
                        .setThumbnail(message.guild.iconURL)
                    message.channel.send(embed)
                }else{
                    message.channel.send(`:x: Vous n'ètes pas le maître de la guilde qui gère ce territoire.`)
                }
            }else{
                message.channel.send(`:x: Vous devez être **maître de guilde** pour changer la devise de votre guilde.`)
            }
        }else{
            message.channel.send(pascompte(member))
        }

    }else if(message.content.startsWith(prefix + "home")){
        let member = message.member
        if(inscrit(member)){
            if(client.guilds.has(save.players[member.id].guilde)){
                if(save.players[member.id].guilde !== message.guild.id){
                    if(message.guild.owner.id === message.member){
                        let embed = new Discord.RichEmbed()
                            .setTitle(`🔃 Changement d'étandart`)
                            .setDescription(`${member} brandit l'étandart de la guilde qui gère se territoire : **${message.guild.name}**${separator}`)
                            .setImage(message.guild.iconURL)
                        message.channel.send(embed)
                        save.players[member.id].guilde = message.guild.id
                        saveFile("save.json",save)
                    }else{
                        let embed = new Discord.RichEmbed()
                            .setTitle(`🔃 Changement de guilde`)
                            .setDescription(`${member} quitte la guilde **${client.guilds.get(save.players[member.id].guilde).name}** et brandit l'étandart de la guilde qui gère se territoire : **${message.guild.name}**${separator}`)
                            .setImage(message.guild.iconURL)
                        message.channel.send(embed)
                        save.players[member.id].guilde = message.guild.id
                        saveFile("save.json",save)
                    }
                }else{
                    message.channel.send(`:x: Vous appartenez déjà à la guilde qui gère ce territoire.`)
                }
            }else{
                let embed = new Discord.RichEmbed()
                    .setTitle(`🆕 Un nouveau membre dans la guilde`)
                    .setDescription(`${member} brandit l'étandart de la guilde qui gère se territoire : **${message.guild.name}**${separator}`)
                    .setImage(message.guild.iconURL)
                message.channel.send(embed)
                save.players[member.id].guilde = message.guild.id
                saveFile("save.json",save)
            }
        }else{
            message.channel.send(pascompte(member))
        }

	}else if(message.content.startsWith(prefix + "inventaire")){
		let member = message.member
		if(inscrit(member)){
			var embed =  new Discord.RichEmbed()
				.setTitle(`🎒 Inventaire de ${member.displayName} !`)
				.setDescription(separator)
				.addField("💰 Pièces d'or :",`${save.players[member.id]["pièces d'or"]+separator}`, false)
			let list = []
			for(ressource in save.players[member.id].inventaire.ressources){
				if(save.players[member.id].inventaire.ressources[ressource]>0){
					list.push(`${data.ressources[ressource].logo} ${capitalize(ressource)} : **${save.players[member.id].inventaire.ressources[ressource]}**`)
				}else{
					list.push(`${data.ressources[ressource].logo} ${capitalize(ressource)} : :x: `)
				}
			}
			embed.addField("🔷 Ressources :",list.join('\n'),true)
			inventaireField(embed,'Items',objCopy(save.players[member.id].inventaire.items))
			inventaireField(embed,'Potions',objCopy(save.players[member.id].inventaire.potions))
			equipArray = []
			for(armure in save.players[member.id].inventaire.armures){
				if(save.players[member.id].inventaire.armures[armure]>0){
					equipArray.push(`🛡 ${capitalize(armure)} x **${save.players[member.id].inventaire.armures[armure]}**`)
				}
			}
			for(arme in save.players[member.id].inventaire.armes){
				if(save.players[member.id].inventaire.armes[arme]>0){
					equipArray.push(`⚔ ${capitalize(arme)} x **${save.players[member.id].inventaire.armes[arme]}**`)
				}
			}
			if(equipArray.length > 0){
				embed.addField(`🔷 Equipements :`,equipArray.join('\n'),true)
			}
			message.channel.send(embed)
        }else{
        	message.channel.send(pascompte(member))
        }
	}else if(message.content.startsWith(prefix + "profil")){
        let member = message.member
        if(inscrit(member)){
        	var embed =  new Discord.RichEmbed()
				.setTitle(`${sexe(member).logo} Profil de ${member.displayName} !`)
				.setDescription(separator)
				.setThumbnail(member.user.avatarURL)
				.addField("⚔ Statistiques de combat",
					`💗 Vie : **${round(save.players[member.id].vie)}** / ${save.players[member.id].vietotal} points de vie\n`+
					`🗡 Force : **${save.players[member.id].force+Math.round(save.players[member.id].force*puissance(member,false))}**`
				, true)
				.addField(`💰 ${save.players[member.id]["pièces d'or"]} Pièces d'or`,`\`${prefix}shop\` pour les utiliser.`, true)
				.addField("📜 Titre",`${save.players[member.id].titres[save.players[member.id].titre]+separator}`, false)
			let armuresList = []
			for(armure in save.players[member.id].armures){
				if(save.players[member.id].armures[armure]>0){
					armuresList.push(`${capitalize(armure)} : **${save.players[member.id].armures[armure]}** durabilité.`)
				}else{
					armuresList.push(`${capitalize(armure)} : :x: `)
				}
			}
			embed.addField(`🛡 Armures (résistance de ${Math.round(résistance(member,false)*100)}%)`,armuresList.join('\n'),true)
			let armesList = []
			for(arme in save.players[member.id].armes){
				if(save.players[member.id].armes[arme]>0){
					armesList.push(`${capitalize(arme)} : **${save.players[member.id].armes[arme]}** durabilité.`)
				}else{
					armesList.push(`${capitalize(arme)} : :x: `)
				}
			}
			embed.addField(`⚔ Armes (puissance de ${Math.round(puissance(member,false)*100)}%)`,armesList.join('\n'),true)
			let statusArray = []
			for(status in save.players[member.id].status){
				statusArray.push(`${capitalize(status)} de ${save.players[member.id].status[status].valeur}% | Durabilité : ${save.players[member.id].status[status].durabilité}`)
			}
			if(statusArray.length > 0){
				embed.addField(`💪 Status :`,statusArray.join('\n'),true)
			}
			message.channel.send(embed)
        }else{
        	message.channel.send(pascompte(member))
        }

    }else if(message.content.startsWith(prefix + "reset")){
		if(message.mentions.members.size <= 0)return message.reply('vous devez @mentionner un membre.')
		var member = message.mentions.members.first() || message.member;
		if(ADMIN[0]===message.member.id){
			if(!inscrit(member)){
				var embed = new Discord.RichEmbed()
					.setTitle(":x: L'utilisateur que vous souhaitez reset n'a pas de compte !")
				message.channel.send(embed)
			}else{
				for(timer in save.players[member.id].timers){
					save.players[member.id].timers[timer] = newDate()
				}
				var embed = new Discord.RichEmbed()
					.addField(":smile: Reset !",`Les timers d'activité de ${member} ont été reset !`)
				message.channel.send(embed)
				saveFile("save.json",save)
			}
		}else{
			var embed = new Discord.RichEmbed()
				.setTitle(":x: Vous n'avez pas la permission !")
			message.channel.send(embed)
		}

	}else if(message.content.startsWith(prefix + "give")){
        var member = message.mentions.members.first()
        if(ADMIN[0]===message.author.id){
        	if(message.mentions.members.size > 0){
	        	if(inscrit(member)){
		            let sommegive = Numer(message.content.replace(prefix + "give","").replace(`${member}`,"").trim())
		            if(sommegive === 0||sommegive === undefined||sommegive === null||sommegive === NaN){
						var embed = new Discord.RichEmbed()
							.setTitle(":x: Il faut entrer une somme !")
						message.channel.send(embed)
					}else{
			            save.players[member.id]["pièce d'or"] += sommegive
                        save.players[member.id].compteurs["pièces d'or"].reçues += sommegive
						var embed = new Discord.RichEmbed()
							.addField(":moneybag: Give !",`${member} a reçu ${sommegive} pièce(s) d'or !`)
			            message.channel.send(embed)
						saveFile("save.json",save)
					}
				}else{
					message.send(pascompte(message.member))
				}
	        } else {
	        	message.reply('vous devez @mentionner un membre ou vous même.')
	        }
        }else{
        	var embed = new Discord.RichEmbed()
				.setTitle(":x: Vous n'avez pas la permission !")
			message.channel.send(embed)
        }
        
	}else if(message.content.startsWith(prefix + "shop")){
		if(inscrit(message.member)){
			let items = shopItems()
			var embed = new Discord.RichEmbed()
				.setTitle(`🛒 Shop`)
				.setDescription(`Votre solde : ${save.players[message.member.id]["pièces d'or"]} pièces d'or${separator}`)
				.setFooter("❓ Acheter : "+prefix+"buy <item>","http://pngimg.com/uploads/dollar_sign/dollar_sign_PNG10.png")
			for(category in items){
				let list = []
				for(item in items[category]){
					list.push(`> ${capitalize(item)} - ${items[category][item]} pièces d'or`)
				}
				embed.addField(`🔷 ${capitalize(category)}`,list.join('\n'),false)
			}
			message.channel.send(embed)
		}else{
			message.channel.send(pascompte(message.member))
		}

	}else if(message.content.startsWith(prefix + "buy")){
		if(inscrit(message.member)){
			let member = message.member
			let désir = message.content.replace(prefix + "buy",'').replace(/é/g,'e').replace(/è/g,'e').toLowerCase().trim()
			if(désir.length > 0){
				let items = objCopy(shopItems())
				for(category in items){
					for(item in items[category]){
						let checkItem = item.replace(/é/g,'e').replace(/è/g,'e')
						if(checkItem.includes(désir)){
							if(save.players[member.id]["pièces d'or"] >= items[category][item]){
								let found = objCopy(data[category][item])
								save.players[member.id]["pièces d'or"] -= items[category][item]
                                save.players[member.id].compteurs["pièces d'or"].used += items[category][item]
                                incrémenter(save.players[member.id].inventaire[category],item,1)
                                incrémenter(save.players[member.id].compteurs[category].buyed,item,1)
								saveFile('save.json',save)
								var embed = new Discord.RichEmbed()
									.setTitle(`🛍 Buy`)
									.setDescription(`Vous venez d'acheter un(e)/des **${item}** pour ${items[category][item]} pièces d'or.${separator}`)
									.setFooter("Merci pour votre achat.","http://pngimg.com/uploads/dollar_sign/dollar_sign_PNG10.png")
								return message.channel.send(embed)
							}else{
								return message.channel.send(":x: Il vous manque "+(items[category][item] - save.players[member.id]["pièces d'or"])+" pièces d'or.")
							}
						}
					}
				}
				message.channel.send(":x: Votre item est introuvable ("+désir+").")
			}else{
				message.channel.send(":x: Vous devez écrire le nom ou un bout du nom de l'objet que vous voulez acheter.")
			}
		}else{
			message.channel.send(pascompte(message.member))
		}

	}else if(message.content.startsWith(prefix + 'crafting')){
		if(inscrit(message.member)){
			let items = craftItems()
			var embed = new Discord.RichEmbed()
				.setTitle(`🛠 Crafting`)
				.setDescription(separator)
				.setFooter("❓ Crafter : "+prefix+"craft <item>","https://ubisafe.org/images/transparent-tool-logo-3.png")
			for(category in items){
				let list = []
				for(item in items[category]){
					let need = []
					for(typeRessource in items[category][item]){
						for(ressource in items[category][item][typeRessource]){
							let ligne = `> **${items[category][item][typeRessource][ressource]}** ${ressource}`
							if(save.players[message.member.id].inventaire[typeRessource][ressource] >= items[category][item][typeRessource][ressource]){
								ligne += " ✅"
							}else{
								ligne += " :x:"
							}
							need.push(ligne)
						}
					}
					list.push(`__Pour avoir un(e)/des **${item}**__\n${need.join('\n')}`)
				}
				embed.addField(`🔷 ${capitalize(category)}`,list.join('\n'),true)
			}
			message.channel.send(embed)
		}else{
			message.channel.send(pascompte(message.member))
		}
	}else if(message.content.startsWith(prefix + 'craft')){
		let member = message.member
		if(inscrit(member)){
			let itemCible = message.content.replace(prefix + 'craft','').replace(/é/g,'e').replace(/è/g,'e').toLowerCase().trim()
			if(itemCible.length > 1){
				for(category in data){
					if(craftable.includes(category)){
						for(item in data[category]){
                            let checkItem = item.replace(/é/g,'e').replace(/è/g,'e')
							if(checkItem.includes(itemCible)){
								// Item trouvé !
								for(typeRessource in data[category][item].crafting){
									for(ressource in data[category][item].crafting[typeRessource]){
										if(save.players[member.id].inventaire[typeRessource][ressource] < data[category][item].crafting[typeRessource][ressource]){
											return message.channel.send(`:x: Il vous manque **${data[category][item].crafting[typeRessource][ressource] - save.players[member.id].inventaire[typeRessource][ressource]} ${ressource}** pour crafter **${item}**.`)
										}
									}
									for(ressource in data[category][item].crafting[typeRessource]){
										save.players[member.id].inventaire[typeRessource][ressource] -= data[category][item].crafting[typeRessource][ressource]
                                        incrémenter(save.players[member.id].compteurs[typeRessource].used,ressource,data[category][item].crafting[typeRessource][ressource])
									}
								}
                                incrémenter(save.players[member.id].inventaire[category],item,1)
                                incrémenter(save.players[member.id].compteurs[category].crafted,item,1)
								saveFile("save.json",save)
								let embed = new Discord.RichEmbed()
									.setTitle(`🛠 Craft`)
									.setDescription(`${member} vient de craft **${item}**.\nCet objet ce trouve maintenant dans l'inventaire.${separator}`)
									.addField(`❔ Ressources utilisées :`,infoCrafting(data[category][item].crafting),false)
								return message.channel.send(embed)
							}
						}
					}
				}
				message.channel.send(`:x: Je n'ai pas trouvé l'item que vous voulez crafter. (${itemCible})`)
			}else{
				message.channel.send(":x: Vous devez rentrer le nom ou une partie du nom de l'item que vous voulez crafter.")
			}
		}else{
			message.channel.send(pascompte(message.member))
		}
		
	}else if(message.content.startsWith(prefix + 'banque')){
		if(inscrit(message.member)){
			let member = message.member
			if(message.content.trim() === prefix + 'banque'){
				let embed = new Discord.RichEmbed()
					.setTitle(`💰 Banque`)
					.setThumbnail("https://www.wannapik.com/media/W1siZiIsIjIwMTYvMDgvMjIvOTR0b2lwYjB6bF8yYTB4Y3NuNmczX2NhcnQxMDUwLnBuZyJdXQ/c2619250f2ef39c6/2a0xcsn6g3_cart1050.png")
					.setDescription(`Votre solde actuel : ${save.players[member.id]["pièces d'or"]} pièces d'or${separator}Pour avoir **1 pièce d'or**\n> **2** ressources d'or\nPour avoir **1 ressource d'or**\n> **2** pièces d'or${separator}`)
					.setFooter("❓ Transformer une ressource : "+prefix+"banque <quantité> <or/pièces>","http://pngimg.com/uploads/dollar_sign/dollar_sign_PNG10.png")
				message.channel.send(embed)
			}else{
				let args = message.content.replace(prefix + 'banque','').trim().split(" ")
				if(args.length === 2){
					args[0] = args[0].toLowerCase().trim()
					args[1] = args[1].toLowerCase().trim()
					if(Number(args[0])===NaN||Number(args[0])===0){
						return message.channel.send(`:x: Vous devez renseigner la quantité ressource que vous vouler transformer. \`<quantité> <ressource>\``)
					}
					let quantité = Number(args[0])
					let embed = new Discord.RichEmbed()
						.setTitle(`💰 Transformation effectuée`)
						.setThumbnail("https://www.wannapik.com/media/W1siZiIsIjIwMTYvMDgvMjIvOTR0b2lwYjB6bF8yYTB4Y3NuNmczX2NhcnQxMDUwLnBuZyJdXQ/c2619250f2ef39c6/2a0xcsn6g3_cart1050.png")
					if("or".includes(args[1])){
						if(save.players[member.id].inventaire.ressources.or < quantité){
							quantité = save.players[member.id].inventaire.ressources.or
						}
						save.players[member.id]["pièces d'or"] += Math.ceil(quantité/2)
                        save.players[member.id].compteurs["pièces d'or"].won += Math.ceil(quantité/2)
						save.players[member.id].inventaire.ressources.or -= quantité
                        incrémenter(save.players[member.id].compteurs.ressources.used,'or',quantité)
						embed.setDescription(`${member} vient de transformer **${quantité}** ressources d'or en ${quantité/2} pièces d'or !${separator}`)
					}else if("pièces".includes(args[1])||"pieces".includes(args[1])){
						if(save.players[member.id]["pièces d'or"] < quantité){
							quantité = save.players[member.id]["pièces d'or"]
						}
						save.players[member.id].inventaire.ressources.or += Math.ceil(quantité/2)
                        incrémenter(save.players[member.id].compteurs.ressources.won,'or',Math.ceil(quantité/2))
						save.players[member.id]["pièces d'or"] -= quantité
                        save.players[member.id].compteurs["pièces d'or"].used += quantité
						embed.setDescription(`${member} vient de transformer **${quantité}** pièces d'or en ${quantité/2} ressources d'or !${separator}`)
					}else{
						return message.channel.send(`:x: Vous devez renseigner le type de ressource que vous vouler transformer : \`or\` ou \`pièce\``)
					}
					embed.addField("Ressources restantes :",`> ${save.players[member.id]["pièces d'or"]} pièces d'or\n> ${save.players[member.id].inventaire.ressources.or} ressources d'or`)
					message.channel.send(embed)
					saveFile("save.json",save)
				}else{
					message.channel.send(`:x: Vous aves mal rédigé${sexe(member).e} la commande.\nArguments captés : \`${args.join(', ')}\``)
				}
			}
		}else{
			message.channel.send(pascompte(message.member))
		}

	}else if(message.content.startsWith(prefix + 'send')){
		if(message.mentions.members.size > 0){
			let member = message.member
			let cible = message.mentions.members.first()
			if(inscrit(member)){
				if(inscrit(cible)){
					let args = message.content.replace(prefix + 'send','').replace(`${cible}`,'').trim().split(" ")
					if(args.length === 2){
						args[0] = args[0].toLowerCase().trim()
						args[1] = args[1].toLowerCase().trim()
						for(ressource in save.players[member.id].inventaire.ressources){
							if(ressource.includes(args[0]) || ressource.includes(args[1])){
								let quantité = 0
								ressource.includes(args[0])?quantité=Number(args[1]):quantité=Number(args[0]);
								if(quantité===NaN||quantité<=0)return message.channel.send(`:x: La quantité rentrée est incorrecte. (${quantité}) [${args.join(', ')}]`)
								if(save.players[member.id].inventaire.ressources[ressource] >= quantité)quantité = save.players[member.id].inventaire.ressources[ressource]
								save.players[cible.id].inventaire.ressources[ressource] += quantité
								save.players[member.id].inventaire.ressources[ressource] -= quantité
                                incrémenter(save.players[cible.id].compteurs.ressources.received,ressource,quantité)
                                incrémenter(save.players[member.id].compteurs.ressources.sent,ressource,quantité)
								let embed = new Discord.RichEmbed()
									.setTitle(`📦 Transation de ressource effectuée !`)
									.setDescription(`${member} vient d'envoyer **${quantité} ${ressource}** à ${cible}.${separator}`)
									.addField(`Ressources actuelles :`,
										`> ${member} n'a plus que ${save.players[member.id].inventaire.ressources[ressource]} ${ressource}.\n`+
										`> ${cible} possède maintenant ${save.players[cible.id].inventaire.ressources[ressource]} ${ressource}.`
									)
								saveFile("save.json",save)
								return message.channel.send(embed)
							}
						}
						message.channel.send(`:x: La ressource renseignée est inexistante...`)
					}else{
						message.channel.send(`:x: Vous aves mal rédigé la commande.\nArguments captés : \`${args.join(', ')}\``)
					}
				}else{
					message.channel.send(`:x: ${cible} n'est pas inscrit${sexe(cible).e} au jeu.`)
				}
			}else{
				message.channel.send(pascompte(member))
			}
		}else{
			message.channel.send(':x: Vous devez mentionner un membre inscrit afin de lui envoyer des ressources.')
		}
	}else if(message.content.startsWith(prefix)){ // .activité
		for(activité in data.activités){
			activitéTestée = activité.replace(/é/g,'e').replace(/è/g,'e')
			commandeTestée = message.content.toLowerCase().replace(/é/g,'e').replace(/è/g,'e')
			if(commandeTestée.includes(activitéTestée)){
				if(inscrit(message.member)){
					let member = message.member
					let timeleft = checkTimer(member,activité)
					if(timeleft <= 0){
						var embed = new Discord.RichEmbed()
						let PO = random(data.activités[activité]["pièces d'or"])
						if(hasStatus(member,'avarice')){
							let status = useStatus(member,'avarice')
							PO += PO*(status.valeur/100)
						}
						save.players[member.id]["pièces d'or"] += PO
                        save.players[member.id].compteurs["pièces d'or"].won += PO
						embed.addField("💰 Butin",`Vous avez trouvé **${PO}** pièces d'or.${separator}`,false)
						let found = []
						for(ressource in data.activités[activité].ressources){
							if(Math.random() < data.activités[activité].ressources[ressource].chances){
								let gain = random(data.activités[activité].ressources[ressource].quantité)
								save.players[member.id].inventaire.ressources[ressource] += gain
                                incrémenter(save.players[member.id].compteurs.ressources.won,ressource,gain)
								found.push(`${capitalize(ressource)} **+ ${gain}**`)
							}
						}
						if(found.length === 0){
							found.push(`Aucune ressource trouvée 😦`)
						}
						embed.addField("☑ Ressources",found.join('\n')+separator,false)
						ennemisField(embed,member,activité)
						if(data.activités[activité].hasOwnProperty('sanctuaire')&&Math.random()<data.activités[activité].sanctuaire&&save.players[member.id].vie>0){
							embed.addField(`${separator}🏛 Sanctuaire`,
								`Sur le chemin du retour, vous appercevez un batîment au loin.\n`+
								`Vous décidez de vous y rendre afin de vous reposer.\n`+
								`**💗 vos points de vie ont étés restaurés !**${separator}`
							)
                            save.players[member.id].compteurs.sanctuaires ++
							save.players[member.id].vie = save.players[member.id].vietotal
						}
						if(save.players[member.id].vie>0){
							if(activité==='aventure'){
								embed.setDescription(`${capitalize(sexe(member).il)} fouille ses poches à la recherche de son butin.${separator}`)
								embed.setTitle(`🌄 ${member.displayName} revient de son aventure !`)
							}else if(activité==='mine'){
								embed.setDescription(`${capitalize(sexe(member).il)} pousse un chariot, voyons se qu'${sexe(member).il} a trouvé${sexe(member).e} !${separator}`)
								embed.setTitle(`⛏ ${member.displayName} remonte de la mine.`)
							}else if(activité==='garde'){
								embed.setDescription(`*"Haaaaan c'était si ennuyant..."* dit-${sexe(member).il}.${separator}`)
								embed.setTitle(`⚔ ${member.displayName} a fini${sexe(member).e} son tour de garde.`)
							}else if(activité==="taverne"){
								embed.setDescription(`*"Eeh moi :hups: tu sais, la boisson ça m'connait :hips:"* dit-${sexe(member).il}.${separator}`)
								embed.setTitle(`🍺 ${member.displayName} a fini${sexe(member).e} son verre.`)
							}else if(activité==='récolte'){
								embed.setDescription(`Esperons que la récolte ai été bonne !${separator}`)
								embed.setTitle(`🍄 ${member.displayName} a fait un tour du village.`)
							}
						}else{
							embed.setDescription(`Voici, ci-dessous, les conditions de sa regrettable mort.${separator}`)
							embed.setTitle(`☠ ${member.displayName} est mort${sexe(member).e} au combat...`)
							let dejaMort = (
								save.players[member.id].titres.includes(`Mort${sexe(member).e} au combat, au nom de la gloire 🤥`) ||
								save.players[member.id].titres.includes(`Fantôme d'aventur${sexe(member).ier} 👻`)
							)
							inscription(member)
							if(dejaMort){
								save.players[member.id].titres.push(`Fantôme d'aventur${sexe(member).ier} 👻`)
							}else{
								save.players[member.id].titres.push(`Mort${sexe(member).e} au combat, au nom de la gloire 🤥`)
							}
						}
						message.channel.send(embed)
						saveFile("save.json",save)
					} else {
						var embed = new Discord.RichEmbed()
							.setTitle(`:alarm_clock: Prochaine **${activité}** dans **${timeleft}** ${data.activités[activité].timer.unité}(s) !`)
						message.channel.send(embed)
					}
				}else{
					message.channel.send(pascompte(message.member))
				}
				return;
			}
		}
	}
})

function debugGuilde(guildID){
    if(!save.guildes.hasOwnProperty(guildID)){
        save.guildes[guildID] = objCopy(data.defaut.guilde)
    }
}
function incrémenter(obj,item,valeur){
    if(obj.hasOwnProperty(item)){
        obj[item] += valeur
    }else{
        obj[item] = valeur
    }
}
function infoStatus(itemStatus){
	let stt = ["Status obtenus ↓```java"]
	for(status in itemStatus){
		stt.push(`> ${capitalize(status)} de ${itemStatus[status].valeur}% pour ${itemStatus[status].durabilité} utilisations`)
	}
	stt.push('```')
	return stt.join('\n')
}
function infoEffets(itemEffets){
	let fx = ["Effets obtenus ↓```java"]
	for(effet in itemEffets){
		fx.push(`> ${capitalize(effet)} de ${itemEffets[effet]} points`)
	}
	fx.push('```')
	return fx.join('\n')
}
function infoLoots(itemLoots){
	let loots = ['```java']
	for(typeRessource in itemLoots){
        if(typeRessource === "titre"){
            loots.push(`> Titre "${itemLoots[typeRessource]}"`)
        }else{
            for(ressource in itemLoots[typeRessource]){
                loots.push(`> ${Math.round(itemLoots[typeRessource][ressource].chances*10*10)/10} chances sur 10 → ${itemLoots[typeRessource][ressource].quantité[0]} à ${itemLoots[typeRessource][ressource].quantité[1]} ${ressource}`)
            }
        }
	}
	return loots.join('\n')+'```'
}
function infoCrafting(itemCrafting){
	let craft = []
	for(typeRessource in itemCrafting){
		let minilog = [capitalize(typeRessource)+' :```java']
		for(ressource in itemCrafting[typeRessource]){
			minilog.push(`> ${itemCrafting[typeRessource][ressource]} ${ressource}`)
		}
		craft.push(minilog.join('\n')+'```')
	}
	return craft.join('')
}
function shopItems(){
	let shop = {}
	for(category in data){
		if(craftable.includes(category)){
			shop[category] = {}
			for(item in data[category]){
				shop[category][item] = data[category][item].prix
			}
		}
	}
	return shop
}
function craftItems(){
	let craft = {}
	for(category in data){
		if(craftable.includes(category)){
			craft[category] = {}
			for(item in data[category]){
				craft[category][item] = objCopy(data[category][item].crafting)
			}
		}
	}
	return craft
}
function usePotion(potionName, member){
	if(save.players[member.id].inventaire.potions[potionName]>0){
		let embed = new Discord.RichEmbed()
			.setTitle(`✅ ${member.displayName} utilise une ${potionName}.`)
			.setDescription(`Cette potion est retirée de votre inventaire.${separator}`)
			.setThumbnail("https://cdn.discordapp.com/attachments/513847079857029135/513847272082243610/potion.png")
		let potion = objCopy(data.potions[potionName])
		save.players[member.id].inventaire.potions[potionName] --
        incrémenter(save.players[member.id].compteurs.potions.used,potionName,1)
		if(potion.hasOwnProperty('effets')){
			if(potion.effets.hasOwnProperty('soin')){
				soin(member,potion.effets.soin)
				embed.addField(`💖 Soin`,`Vous vous soignez de ${potion.effets.soin} points de vie.`,false)
			}
		}
		if(potion.hasOwnProperty('status')){
			let array = []
			for(status in potion.status){
				setStatus(member,potion.status[status],status)
				array.push(`+ **${status}** de **${potion.status[status].valeur}** points pour **${potion.status[status].durabilité}** utilisations.`)
			}
			if(array.length === 0)array.push(":x:")
			embed.addField(`👅 Status`,array.join('\n'))
		}
		return embed
	}else{
		let embed = new Discord.RichEmbed()
			.setTitle(`:x: ${member.displayName} vous ne possèdez pas de ${potionName}.`)
			.setDescription(`Vouc pouvez cependant en acheter en faisant la commande \`${prefix}shop\``)
		return embed
	}
}
function useEquipement(category,item,member){
	if(save.players[member.id].inventaire[category][item]>0){
		if(save.players[member.id][category][item]<=0){
			let embed = new Discord.RichEmbed()
				.setTitle(`✅ ${member.displayName} s'équipe avec **${capitalize(item)}**.`)
				.setDescription(`Cet équipement est retiré de votre inventaire.${separator}`)
			let equipement = objCopy(data[category][item])
            if(equipement.hasOwnProperty('status')){
                for(status in equipement.status){
                    setStatus(member,equipement.status[status],status)
                }
            }
			save.players[member.id].inventaire[category][item] --
			save.players[member.id][category][item] = equipement.durabilité
            incrémenter(save.players[member.id].compteurs[category].used,item,1)
			saveFile("save.json",save)
			return embed
		}else{
			return `:x: Vous portez déjà un(e) **${capitalize(item)}** :wink: `
		}
	}else{
		let embed = new Discord.RichEmbed()
			.setTitle(`:x: ${member.displayName} vous ne possèdez pas de **${capitalize(item)}**.`)
			.setDescription(`Vouc pouvez cependant en acheter en faisant la commande \`${prefix}shop\``)
		return embed
	}
}
function setStatus(member,status,statusName){
	if(save.players[member.id].status.hasOwnProperty(statusName)){
		save.players[member.id].status[statusName].valeur = status.valeur
		save.players[member.id].status[statusName].durabilité += status.durabilité
	}else{
		save.players[member.id].status[statusName] = objCopy(status)
	}
}
function soin(member,ajout){
	save.players[member.id].vie += ajout
	if(save.players[member.id].vie > save.players[member.id].vietotal){
		save.players[member.id].vie = save.players[member.id].vietotal
	}
}
function checkTimer(member,activité){
	let date = newDate()
	let timeleft = null
	if(data.activités[activité].timer.unité === "minute"){
		timeleft = (
				(timers[member.id][activité].minutes - date.minutes) + 
				(60*(timers[member.id][activité].hours - date.hours)) +
				(24*60*(timers[member.id][activité].day - date.day))
		)
		if(timeleft<=0){
			timers[member.id][activité] = newDate()
			let minutesADD = data.activités[activité].timer.quantité
			if(hasStatus(member,'vitesse')){
				let status = useStatus(member,'vitesse')
				minutesADD -= minutesADD*(status.valeur/100)
			}
			timers[member.id][activité].minutes += minutesADD
			dateDebug(member,activité)
		}
	}else if(data.activités[activité].timer.unité === "heure"){

	}else if(data.activités[activité].timer.unité === "jour"){

	}else if(data.activités[activité].timer.unité === "semaine"){

	}
	return timeleft
}
function newDate(){
	var date = new Date()
	return {
		minutes: date.getMinutes(),
		hours: date.getHours(),
		day: date.getDay()
	}
}
function dateDebug(member,activité){
	if(timers[member.id][activité].minutes >= 60){
		timers[member.id][activité].minutes -= 60
		timers[member.id][activité].hours ++
		if(timers[member.id][activité].hours >= 24){
			timers[member.id][activité].hours -= 24
			timers[member.id][activité].day ++
			if(timers[member.id][activité].day >= 7){
				timers[member.id][activité].day -= 7
			}
		}
	}
}
function hasStatus(member,status){
	return save.players[member.id].status.hasOwnProperty(status) && save.players[member.id].status[status].durabilité > 0
}
function useStatus(member,status){
	if(hasStatus(member,status)){save.players[member.id].status[status].durabilité --}
	return save.players[member.id].status[status]
}
function inventaireField(embed,titre,obj){
	array = []
	for(item in obj){
		if(obj[item]>0){
			array.push(`> ${capitalize(item)} x **${obj[item]}**`)
		}
	}
	if(array.length > 0){
		embed.addField(`🔷 ${titre} :`,array.join('\n'),true)
	}
}
function ennemisField(embed,member,activité){
	let array = []
	let repulsion = useStatus(member,"répulsif")
	for(ennemi in data.activités[activité].ennemis){
		let Ennemi = objCopy(data.ennemis[ennemi])
		let rdm = Math.random()
		if(hasStatus(member,'répulsif')){
			rdm += rdm*(repulsion.valeur/100)
		}
		if(rdm<data.activités[activité].ennemis[ennemi]){
            incrémenter(save.players[member.id].compteurs.ennemis,ennemi,1)
			array.push(
				`**Un${directSexe(Ennemi.sexe).e} ${capitalize(ennemi)} vous a attaqué${directSexe(Ennemi.sexe).e}** 😱\n`+
				`💗 Sa vie : **${Ennemi.vie}**	| 💗 La votre : **${Math.round(save.players[member.id].vie)} / ${save.players[member.id].vietotal}**\n`+
				`🗡 Sa force : **${Ennemi.force}**	| 🗡 La votre : **${Math.round(save.players[member.id].force+(save.players[member.id].force*puissance(member,false)))}**`
			)
            if(!save.players[member.id].bestiaire.includes(ennemi)){
                save.players[member.id].bestiaire.push(ennemi)
                array.push(`✨ *- ${capitalize(ennemi)} est ajouté à votre bestiaire -* ✨`)
            }
			let log = []
			let degatsOccasionnés = 0
			let degatsReçus = 0
			let tours = 0
			while(Ennemi.vie > 0 && save.players[member.id].vie > 0){
				tours ++
				if(Ennemi.vie>0)degatsReçus += degats(member,Ennemi)
				if(save.players[member.id].vie>0)degatsOccasionnés += attaque(member,Ennemi)
			}
			puissance(member,true)
			résistance(member,true)
			log.push(`[ *le combat a duré ${tours} tours* ]`)
			log.push(`💔 ${directSexe(Ennemi.sexe).il} vous a infligé ${Math.round(degatsReçus)} dégats, il vous reste **${Math.round(save.players[member.id].vie)} points de vie**.`)
			log.push(`💢 vous lui avez infligé ${Math.round(degatsOccasionnés)} dégats, il lui reste ${Math.round(Ennemi.vie)} points de vie.`)
			if(Ennemi.vie <= 0){
				log.push(`${capitalize(ennemi)} est mort(e) ! 💀\n`)
				let loot = ["🛍 Loot :```"]
				if(Ennemi.loots.hasOwnProperty('titre')&&!save.players[member.id].titres.includes(Ennemi.loots.titre)){
					save.players[member.id].titres.push(Ennemi.loots.titre)
					loot.push(`+ Titre "${Ennemi.loots.titre} (n°${save.players[member.id].titres.length})"`)
				}
				if(Ennemi.loots.hasOwnProperty('items')){
					for(item in Ennemi.loots.items){
						let gain = random(Ennemi.loots.items[item].quantité)
						loot.push(`+ ${gain} ${capitalize(item)}`)
                        incrémenter(save.players[member.id].inventaire.items,item,gain)
                        incrémenter(save.players[member.id].compteurs.items.won,item,gain)
					}
				}
				if(Ennemi.loots.hasOwnProperty('ressources')){
					for(ressource in Ennemi.loots.ressources){
						let gain = random(Ennemi.loots.ressources[ressource].quantité)
						loot.push(`+ ${gain} ${capitalize(ressource)}`)
                        incrémenter(save.players[member.id].inventaire.ressources,ressource,gain)
                        incrémenter(save.players[member.id].compteurs.ressources.won,ressource,gain)
					}
				}
				loot.push('```')
				log.push(loot.join('\n'))
			}else{
				log.push(`${capitalize(ennemi)} vous a tué${directSexe(Ennemi.sexe).e}... 😵${separator}⚠ **Vous devez recommencer le jeu, votre compte à été réinitialisé.**`)
			}
			array.push(log.join('\n'))
			embed.setImage(Ennemi.image)
		}
	}
	if(array.length===0)array.push(`Aucun ennemi rencontré !`)
	embed.addField(`⚔ Combats`,array.join('\n'),false)
}
function attaque(member,ennemi){
	let blessure = save.players[member.id].force+(save.players[member.id].force*puissance(member,false))
	ennemi.vie -= blessure
    save.players[member.id].compteurs.dégâts.sent += blessure
	return blessure
}
function degats(member,ennemi){
	let blessure = ennemi.force-(ennemi.force*résistance(member,false))
	save.players[member.id].vie -= blessure
    save.players[member.id].compteurs.dégâts.received += blessure
	return blessure
}
function résistance(member,apply){
	let resist = 0
	for(armure in save.players[member.id].armures){
		if(save.players[member.id].armures[armure]>0){
			resist += data.armures[armure].résistance
			if(apply) save.players[member.id].armures[armure] --
		}
	}
	if(resist > 0){
		return resist/100
	}else{
		return 0
	}
}
function puissance(member,apply){
	let cummul = 0
	for(arme in save.players[member.id].armes){
		if(save.players[member.id].armes[arme]>0){
			cummul += data.armes[arme].puissance
			if(apply) save.players[member.id].armes[arme] --
		}
	}
	if(hasStatus(member,'puissance')){
		cummul += save.players[member.id].status['puissance'].valeur
		if(apply) save.players[member.id].status['puissance'].durabilité --
	}
	if(cummul > 0){
		return cummul/100
	}else{
		return 0
	}
}
function random(array){
    return Math.round(Math.random() * (array[1] - array[0]) + array[0])
}
function round(num){
	return Math.round(num*100)/100
}
function capitalize(texte){
	return texte.charAt(0).toUpperCase()+texte.slice(1).toLowerCase()
}
function inscrit(member){
	return save.players.hasOwnProperty(member.id)
}
function inscription(member){
	save.players[member.id] = objCopy(data.defaut.player)
	save.players[member.id].pseudo = member.user.username
    save.players[member.id].guilde = member.guild.id
	timers[member.id] = {
		"aventure": newDate(),
		"mine": newDate(),
		"garde": newDate(),
		"récolte": newDate(),
		"taverne": newDate()
	}
}
function objCopy(obj){
  return JSON.parse(JSON.stringify(obj));
}
function pascompte(member){
	var embed = new Discord.RichEmbed()
		.setTitle(`Vous n'êtes pas inscrit, ${member.displayName} :scream: `)
		.setFooter("❓ Commencez le jeu grâce à la commande : .start")
	return embed
}
function sexe(member){
	return directSexe(save.players[member.id].sexe)
}
function directSexe(sexe){
	if(sexe === "homme"){
		return {
			logo: '👦',
			il: 'il',
			lui: 'lui',
			e: '',
			le: 'le',
			ier: 'ier'
		}
	}else{
		return {
			logo:'👧',
			il: 'elle',
			lui: 'elle',
			e: 'e',
			le: 'la',
			ier: 'ière'
		}
	}
}
function saveFile(path,variable){
	fs.writeFile(path, JSON.stringify(variable,null,'\t'), (err) => {if (err) console.error(err);});
}
function loadFile(path){
	try {
	  return JSON.parse(fs.readFileSync(path))
	} catch (err) {
	  if (err.code !== 'ENOENT') throw err;
	  return objCopy(data.defaut.save)
	}
}
function saveText(path,variable){
    fs.writeFile(path, variable, (err) => {if (err) console.error(err);});
}
function loadText(path){
    try {
      return fs.readFileSync(path)
    } catch (err) {
      console.log("Je n'ai pas pu lire "+path)
    }
}