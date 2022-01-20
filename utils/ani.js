import cheerio from "cheerio"
import slugify from "slugify"
import CryptoJS from "crypto-js"
import url from "url"
import { Buffer } from "buffer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { BASEURL, CORS, USERAGENT } from "utils/constants"

const fetchWeb = async (url) => {
  const response = await fetch(url)
  const htmlString = await response.text()
  return cheerio.load(htmlString)
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function f_random(length) {
  var i = length,
    str = ""
  while (i > 0x0) {
    i--, (str += getRandomInt(0, 9))
  }
  return str
}

function generateEncryptAjaxParameters($, id) {
  const value6 = $("script[data-name=\x27ts\x27]").data("value")
  const value5 = $("[name='crypto']").attr("content")
  const value1 = CryptoJS.enc.Utf8.stringify(
    CryptoJS.AES.decrypt(
      $("script[data-name=\x27crypto\x27]").data("value"),
      CryptoJS.enc.Utf8.parse(value6.toString() + value6.toString()),
      {
        iv: CryptoJS.enc.Utf8.parse(value6),
      }
    )
  )
  const value4 = CryptoJS.AES.decrypt(value5, CryptoJS.enc.Utf8.parse(value1), {
    iv: CryptoJS.enc.Utf8.parse(value6),
  })
  const value3 = CryptoJS.enc.Utf8.stringify(value4)
  const value2 = f_random(16)
  return (
    "id=" +
    CryptoJS.AES.encrypt(id, CryptoJS.enc.Utf8.parse(value1), {
      iv: CryptoJS.enc.Utf8.parse(value2),
    }).toString() +
    "&time=" +
    "00" +
    value2 +
    "00" +
    value3.substring(value3.indexOf("&"))
  )
}

const getEmbedUrl = async ($) => {
  const url = "https:" + $(".vidcdn").find("a").attr("data-video")
  return url
}

const getAvailableVideos = async (data) => {
  const embedUrl = await getEmbedUrl(data)
  const embed = url.parse(embedUrl, true)
  const $ = await fetchWeb(`${CORS}/${embedUrl}`)
  const params = generateEncryptAjaxParameters($, embed.query.id)
  const response = await fetch(
    `${CORS}/${embed.protocol}//${embed.hostname}/encrypt-ajax.php?${params}`,
    {
      headers: {
        "User-Agent": USERAGENT,
        Referer: embedUrl,
        "X-Requested-With": "XMLHttpRequest",
      },
    }
  ).then((resp) => resp.json())

  return response.source.map((s) => ({
    ...s,
    file: Buffer.from(s.file).toString("base64"),
  }))
}

export const fetchData = async (slug = "", ep = "") => {
  const $ = await fetchWeb(`${BASEURL}/${slug}-episode-${ep}`)
  return await getAvailableVideos($)
}

export const searchFn = async (text = "") => {
  const url = `${BASEURL}//search.html?keyword=${text.replace(" ", "%20")}`
  const $ = await fetchWeb(url)
  const list = $('ul[class="items"] li')
    .toArray()
    .map((el) => ({
      img: $(el).find("div > a > img").attr("src"),
      title: $(el).find("p > a").text(),
      slug: slugify($(el).find("p > a").text(), { strict: true, lower: true }),
      released: $(el).find('p[class="released"]').text().trim(),
    }))
  return list
}

export const getEpisodeFn = async (text = "") => {
  const $ = await fetchWeb(`${CORS}/${BASEURL}/category/${text}`)

  let ep = $("#episode_page li").toArray().pop()
  let count = $(ep).find("a").text().split("-").pop()
  return [...Array(parseInt(count)).keys()].map((i) => i + 1).reverse()
}

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.log(e)
  }
}

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log(e)
  }
}
