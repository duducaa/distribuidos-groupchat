import { callRPC } from "./js/rpc.js";

document.addEventListener("DOMContentLoaded", () => {
    const switchButton = document.querySelector(".switch-tabs");
    const registerTab = document.querySelector(".register-tab");
    const messageTab = document.querySelector(".message-tab");
    switchButton.addEventListener("click", () => {
        if (!registerTab.classList.contains("none")) {
            registerTab.classList.add("none");
            messageTab.classList.remove("none");
        } else {
            registerTab.classList.remove("none");
            messageTab.classList.add("none");
        }
    })

    const sendButton = messageTab.querySelector(".msg-btn");
    const msgInput = messageTab.getElementById("msg-content");

    sendButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const msg_value = msgInput.value;
        const texto = await callRPC("sendMessage", [msg_value], ["string"]);
        console.log(texto);
    })

    const register = registerTab.querySelector(".connect");
    const usernameInput = registerTab.getElementById("username");
    register.addEventListener("click", async (event) => {
        event.preventDefault();
        const username = usernameInput.value;
        const texto = await callRPC("register", [username], ["string"]);
        console.log(texto);
    })
})