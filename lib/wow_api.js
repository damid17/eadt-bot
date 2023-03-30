const https = require('https');
const api_key = require("../api.json");
const qs = require('querystring');
const wait = require('node:timers/promises').setTimeout;
const Discord = require("discord.js");

var token = null;
var stringResponse = null;
const identificacion = api_key.blizzardId + ':' + api_key.blizzardSecret;
const encoded = Buffer.from(identificacion, 'utf8').toString('base64');

exports.get_token = async function(){  
    
    const options = {
        hostname: 'us.battle.net',
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + encoded
        }
    };

    var req = https.request(options, function (res) {
        var chunks = [];
      
        res.on("data", function (chunk) {
          chunks.push(chunk);
        });
      
        res.on("end", function (chunk) {
          var body = Buffer.concat(chunks);
          var bodyJson = JSON.parse(body);
          token = bodyJson.access_token;
        });
      
        res.on("error", function (error) {
          console.error(error);
          return;
        });
    });
      
    var postData = qs.stringify({'grant_type': 'client_credentials'});
    req.write(postData);
    req.end();
    await wait(2000);
    return token;
}

exports.get_char = async function(realm, character, access_token){  

    console.log('Parametros: ', realm + ' | ' + character + ' | ' + access_token);

    const options = {
        hostname: 'us.api.blizzard.com',
        path: '/profile/wow/character/' + realm.toLowerCase() + '/' + character.toLowerCase() + '/statistics?namespace=profile-us&locale=es_MX',
        method: 'GET',
        'headers': {
          'Authorization': 'Bearer ' + access_token
        },
    };

    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
        
        res.on("end", function (chunk) {
            var body = Buffer.concat(chunks);
            var jsonBody = JSON.parse(body);
            res.on('response', function (response) {
                console.log('Response', response.statusCode);
            }); 
            if (jsonBody.code == 200 || jsonBody.code == undefined){
                stringResponse = new Discord.EmbedBuilder()
                .setTitle ('Estadisticas de ' + jsonBody.character.name)
                .addFields ({name: "General:", value: 'Vida: ' + jsonBody.health + '\n' + '' + jsonBody.power_type.name + ': ' + jsonBody.power},
                {name: "Atributos:", value: 'Fuerza: '+ jsonBody.strength.effective  + '\n' + 
                                        'Agilidad: '+ jsonBody.agility.effective + '\n'+
                                        'Intelecto: '+ jsonBody.intellect.effective + '\n'+
                                        'Aguante: '+ jsonBody.stamina.effective + '\n' + 
                                        'Versatilidad: '+ jsonBody.versatility + '\n' + 
                                        'Maestría: '+ Math.round(jsonBody.mastery.value) + '\n' + 
                                        'Parasitar: '+ jsonBody.lifesteal.value},
                {name: "Fisico: ",   value: 'Poder de ataque: '+ jsonBody.attack_power + '\n' + 
                                        'Daño mano principal (min/max): '+ Math.round(jsonBody.main_hand_damage_min)+'/'+Math.round(jsonBody.main_hand_damage_max) + '\n' + 
                                        'Daño mano secundaria (min/max): '+ Math.round(jsonBody.off_hand_damage_min)+'/'+Math.round(jsonBody.off_hand_damage_max) + '\n' + 
                                        'D.P.S. mano principal: '+ Math.round(jsonBody.main_hand_dps) + '\n' + 
                                        'D.P.S. mano secundaria: '+ Math.round(jsonBody.off_hand_dps) + '\n' + 
                                        'Crítico rango: '+ Math.round(jsonBody.ranged_crit.value) + '%\n' +
                                        'Celeridad rango: '+ Math.round(jsonBody.ranged_haste.value) + '%\n' +
                                        'Velocidad mano principal: ' + jsonBody.main_hand_speed + '\n' +                                                                  
                                        'Velocidad mano secundaria: ' + jsonBody.off_hand_speed},
                {name: "Magicos: ",  value:'Poder de hechizos: '+jsonBody.spell_power + '\n' + 
                                        'Penetración: '+ jsonBody.spell_penetration + '\n' + 
                                        'Celeridad: '+ Math.round(jsonBody.spell_haste.value) + '%\n' +
                                        'Crítico: '+Math.round(jsonBody.spell_crit.value) + '%\n'+
                                        'Regeneración maná: ' + jsonBody.mana_regen},
                {name: "Defensas: ", value:'Armadura: '+ jsonBody.armor.effective + '\n' + 
                                        'Esquivar: '+ Math.round(jsonBody.dodge.value) + '\n' + 
                                        'Parada: '+ Math.round(jsonBody.parry.value) + '\n' + 
                                        'Bloqueo: '+ Math.round(jsonBody.block.value)})
                .setTimestamp()                  
            }else{
                stringResponse = new Discord.EmbedBuilder()
                .setTitle ('Estadisticas de ' + character)
                .addFields ({name: "Error", value: 'Error encontrando las estadísticas'})
                .setTimestamp()
            }
        });
        
        res.on("error", function (error) {
            stringResponse = new Discord.EmbedBuilder()
            .setTitle ('Estadisticas de ' + character)
            .addFields ({name: "Error", value: 'Error encontrando las estadísticas'})
            .setTimestamp()
            console.error('Error: ',error);
        });
    });
      
    req.end(); 
    await wait(4000);
    console.log('String Response', stringResponse);
    return stringResponse;
}