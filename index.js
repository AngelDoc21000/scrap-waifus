const cheerio = require('cheerio');
const { cp } = require('fs');
const got = require('got');
const { default: asPromise } = require('got/dist/source/as-promise');
const fs = require("fs")

let baseUrl = 'https://mywaifulist.moe';
let db = require("./waifus.json");

let num = 0;

(async () => {

    for (let i = 1; i!==4859; i++) {

        let url = `https://www.anime-planet.com/characters/all?gender_id=2&page=${i}`;
        let baseUrl = "https://www.anime-planet.com"
        
        const response = await got(url);
        const $ = cheerio.load(response.body);

        $(".name").toArray().forEach(async (a) => {
            
            let info = await got(baseUrl+$(a).attr("href"))
            info = cheerio.load(info.body)

            let name = $(a).text()
            let image = baseUrl+info(".screenshots").attr("src")
            let rank = info("a").toArray().filter(a => a.attribs.href === "/characters/top-loved" && info(a).text().split("").includes("#")).map(a => info(a).text())[0]
            let tags = info(".tags ul li a").toArray().map(a => info(a).text())
            let animes = info(".tooltip").toArray().filter(a => info(a).attr("href").includes("anime")).map(a => info(a).text())
            let mangas = info(".tooltip").toArray().filter(a => info(a).attr("href").includes("manga")).map(a => info(a).text())


            let json = {
                name: name,
                image: image,
                rank: rank,
                tags: tags,
                animes: animes,
                mangas: mangas
            }

            db[name] = json
            fs.writeFileSync("./waifus.json", JSON.stringify(db, 0, 4))

		num++
            console.log(`${num} + ${name} ajoutée`)

        })
    
    }

})();
