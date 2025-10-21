import { callRPC, parseStruct } from "./js/rpc.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerTab = document.querySelector(".register-tab");
    const messageTab = document.querySelector(".message-tab");

    const messages = messageTab.querySelector(".messages");
    const messageTemplate = messageTab.querySelector("#message-template");
    const sendButton = messageTab.querySelector(".msg-btn");
    const updateButton = messageTab.querySelector(".update-btn");
    const msgInput = messageTab.querySelector("#msg-content");

    sendButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const text = msgInput.value;
        const user_id = localStorage.getItem("id");
        const username = localStorage.getItem("username");
        callRPC("sendMessage", [
            [text, "string"],
            [user_id, "int"]])
        .then(res => {
            const clone = messageTemplate.content.cloneNode(true);
            clone.querySelector(".username").textContent = username;
            clone.querySelector(".message-content").textContent = text;
            messages.appendChild(clone);
        })
    })

    updateButton.addEventListener("click", (event) => {
        event.preventDefault();
        callRPC("update", [])
        .then(res => {
            console.log(res);
        })
    });

    const register = registerTab.querySelector(".connect");
    const usernameInput = registerTab.querySelector("#username");
    register.addEventListener("click", async (event) => {
        event.preventDefault();
        const username = usernameInput.value;
        callRPC("register", [[username, "string"]])
        .then(res => {
            const struct = parseStruct(res);
            messageTab.classList.remove("none");
            registerTab.classList.add("none");
            localStorage.setItem("id", struct["id"]);
            localStorage.setItem("username", struct["username"]);
        });
    })
})