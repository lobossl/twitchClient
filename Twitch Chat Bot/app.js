/*
    Twitch Chat Bot Med WebSocket

    https://github.com/lobossl
*/

let addChat = document.getElementById("addChat")
let inputChat = document.getElementById("inputChat")
let btnChat = document.getElementById("btnChat")
let inputChannel = document.getElementById("inputChannel")
let inputOauth = document.getElementById("inputOauth")
let connect = document.getElementById("connect")
let systemMessages = document.getElementById("systemMessages")
let btnPause = document.getElementById("btnPause")

let settings = {
    server: "wss://irc-ws.chat.twitch.tv:443",
    pause: false
}

let socket

connect.addEventListener("click",() => {
    systemMessages.innerText = "Reconnecting.."
    connectWebSocket()
})

function connectWebSocket() {
    socket = new WebSocket(settings.server)
    
    socket.addEventListener("close",() => {
        systemMessages.innerText = "Connection closed #3, reconnecting in 5 seconds"
        setTimeout(() => {
            connectWebSocket()
        },5000)
    })
    
    socket.addEventListener("error",() => {
        systemMessages.innerText = "Connection error #4, reconnecting in 5 seconds"
        setTimeout(() => {
            connectWebSocket()
        },5000)
    })
    
    socket.addEventListener("open",() => {
        if(inputOauth.length > 0)
        {
            socket.send("PASS " + inputOauth.value + "\r\n")
            socket.send("NICK Anonymous3331\r\n")
            socket.send("JOIN #" + inputChannel.value + "\r\n")
        }
        else
        {
            socket.send("NICK justinfan3331\r\n")
            socket.send("JOIN #" + inputChannel.value + "\r\n")
        }

        systemMessages.innerText = "Connected to " + inputChannel.value
    })
    
    socket.addEventListener("message", (e) => {
        let data = e.data.split(" ")
    
        if(data[0] === "PING")
        {
            console.log("Ping Pong!")
            socket.send("PONG " +  data[0] + "\r\n")
        }
        else
        {
            if(data[1] === "PRIVMSG")
            {
                let emtyStr = ""
    
                let getNick = data[0].split("!",1)[0].split(":",2)[1]
                let getChannel = data[2]
                let getMessage = data.slice(3,data.length)
                let getInfo = data[1]
    
                getMessage.forEach((e,index) => {
                    emtyStr += e + " "
                })
    
                CREATEDIVS(getInfo,getNick,emtyStr,getChannel)
            }
            else
            {
                console.log(data)
            }
        }
    })
}

document.addEventListener("click",(e) => {
    if(e.target.className === "reply")
    {
        inputChat.innerText = "@" + e.target.id
    }
    else if(e.target.className === "ban")
    {
        inputChat.innerText = "/ban " + e.target.id + " " + "Banned"
    }
    else
    {
        return null
    }
})

btnPause.addEventListener("click",() => {
    if(settings.pause)
    {
        settings.pause = false
    }
    else
    {
        settings.pause = true
    }
})

btnChat.addEventListener("click",() => {
    try
    {
        socket.send("PRIVMSG #" + inputChannel.value + " :" + inputChat.innerText + "\r\n")

        CREATEDIVS("PRIVMSG","YOU",":" + inputChat.innerText,inputChannel.value)

        inputChat.innerText = ""
    }
    catch(err)
    {
        systemMessages.innerText = "Error, failed to send message"
    }
})

function CREATEDIVS(info,currentNick,currentMessage,currentChannel)
{
    let createDiv = document.createElement("div")
    let createDivIcons = document.createElement("div")
    let createDivReply = document.createElement("img")
    let createDivBan = document.createElement("img")
    let createDivNick = document.createElement("span")
    let createDivMsg = document.createElement("span")

    if(info === "PRIVMSG")
    {
        createDivNick.innerText = currentNick
        createDivMsg.innerText = currentMessage
    }
    else
    {
        return null
    }

    createDiv.style.border = "1px solid #CCCCCC"
    createDiv.style.borderRadius = "6px"
    createDiv.style.wordBreak = "break-word"
    createDiv.style.padding = "5px"
    createDiv.style.margin = "5px"
    createDiv.style.textAlign = "left"
    createDiv.style.fontFamily = "monospace"
    createDiv.style.fontSize = "1.2em"
    createDiv.style.backgroundColor = "#FFFFFF"

    createDivNick.style.color = "orange"
    createDivNick.style.fontSize = "1.3em"

    createDivMsg.style.color = "grey"
    createDivMsg.style.fontSize = "1em"
    createDivMsg.style.margin = "5px"

    createDivReply.src = "img/reply.png"
    createDivReply.id = currentNick
    createDivReply.className = "reply"
    createDivReply.style.margin = "2px"
    createDivReply.style.padding = "2px"
    createDivReply.style.border = "1px solid #556677"
    createDivReply.style.borderRadius = "3px"
    createDivReply.style.cursor = "pointer"

    createDivBan.src = "img/banned.png"
    createDivBan.id = currentNick
    createDivBan.className = "ban"
    createDivBan.style.margin = "2px"
    createDivBan.style.padding = "2px"
    createDivBan.style.border = "1px solid #FF0000"
    createDivBan.style.borderRadius = "3px"
    createDivBan.style.cursor = "pointer"

    createDivIcons.style.textAlign = "right"
    createDivIcons.style.borderBottom = "1px solid #CCCCCC"

    createDivIcons.append(createDivReply)
    createDivIcons.append(createDivBan)
    createDiv.append(createDivIcons)
    createDiv.append(createDivNick)
    createDiv.append(createDivMsg)

    addChat.append(createDiv)

    if(settings.pause == false)
    {
        addChat.scrollTop = addChat.scrollHeight
    }
}