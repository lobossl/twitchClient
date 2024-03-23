/*
    Twitch Chat Bot Med WebSocket

    TODO:
    - Add Reply (Add inputChat.value @nickName text...?)
*/

let addChat = document.getElementById("addChat")
let inputChat = document.getElementById("inputChat")
let btnChat = document.getElementById("btnChat")
let inputChannel = document.getElementById("inputChannel")
let inputOauth = document.getElementById("inputOauth")
let connect = document.getElementById("connect")
let systemMessages = document.getElementById("systemMessages")

let settings = {
    server: "wss://irc-ws.chat.twitch.tv:443"
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
        if(inputOauth.value.length > 0)
        {
            socket.send("PASS " + inputOauth.value + "\r\n")
        }
        socket.send("NICK justinfan12345\r\n")
        socket.send("JOIN #" + inputChannel.value + "\r\n")

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
                return null
            }
        }
    })
}

document.addEventListener("click",(e) => {
    if(e.target.className === "reply")
    {
        inputChat.innerText = "@" + e.target.id + " "
    }
})

btnChat.addEventListener("click",() => {
    try
    {
        if(socket.readyState === WebSocket.OPEN)
        {
            socket.send("PRIVMSG #" + inputChannel.value + " " + inputChat.innerText + "\r\n")
    
            inputChat.innerText = ""
        }
        else
        {
            systemMessages.innerText = "You are not connected, failed to send message! #1"
        }
    }
    catch(err)
    {
        systemMessages.innerText = "You are not connected, failed to send message! #2"
    }
})

function CREATEDIVS(info,currentNick,currentMessage,currentChannel)
{
    let createDiv = document.createElement("div")
    let createDivIcons = document.createElement("div")
    let createDivReply = document.createElement("img")
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
    createDivReply.style.border = "1px solid #CCCCCC"
    createDivReply.style.borderRadius = "3px"
    createDivReply.style.cursor = "pointer"

    createDivIcons.style.textAlign = "right"
    createDivIcons.style.borderBottom = "1px solid #CCCCCC"

    createDivIcons.append(createDivReply)
    createDiv.append(createDivIcons)
    createDiv.append(createDivNick)
    createDiv.append(createDivMsg)

    addChat.append(createDiv)

    addChat.scrollTop = addChat.scrollHeight
}