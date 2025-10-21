async function callRPC(method, params) {
    let params_str = "";

    for (let index = 0; index < params.length; index++) {
        const param = params[index][0];
        const type = params[index][1];
        
        params_str += `
            <param>
                <value><${type}>${param}</${type}></value>
            </param>
        `;
    }

    const xml = `
    <?xml version="1.0"?>
    <methodCall>
        <methodName>${method}</methodName>
        <params>
        ${params_str}
        </params>
    </methodCall>
    `.trim();
    console.log(xml)

    const resposta = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
        "Content-Type": "text/xml"
    },
    body: xml
    });

    return await resposta.text();
}

function parseStruct(xmlString) {
    console.log(xmlString);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    const structNode = xmlDoc.querySelector("param > value > struct");
    const obj = {};
    const members = structNode.querySelectorAll("member");
    members.forEach(member => {
        const key = member.querySelector("name").textContent;
        const valueNode = member.querySelector("value");
        
        let value;
        if (valueNode.querySelector("string")) {
            value = valueNode.querySelector("string").textContent;
        } else if (valueNode.querySelector("int")) {
            value = parseInt(valueNode.querySelector("int").textContent, 10);
        } else if (valueNode.querySelector("boolean")) {
            value = valueNode.querySelector("boolean").textContent === "1";
        } else {
            value = valueNode.textContent;
        }

        obj[key] = value;
    });
  return obj;
}



export { callRPC, parseStruct };