async function callRPC(method, params, params_types) {
    const params_str = "";

    for (let index = 0; index < params.length; index++) {
        const param = params[index];
        const type = params_types[index];
        
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
        ${params}
        </params>
    </methodCall>
    `.trim();

    const resposta = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
        "Content-Type": "text/xml"
    },
    body: xml
    });

    const texto = await resposta.text();
    return texto;
}

export { callRPC };