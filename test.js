{
    async function execProcedure(procName, params)
    {
    const body = {
        "procedure": procName,
        "params":params
    }
    const request = {
        url: "http://localhost:3000/api/procedure",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify(
                body


            )
        }
    }


    try {
        const response =  await pm.sendRequest(request, (error, response) => {
            if (error) {
               // console.log(error);
                throw new Error("Request failed: ", err);
            }
            const responseBody = response.json();
            console.log(responseBody);
            return responseBody;
        });


    }
    catch (err) {
        //console.error(err);
    }
}

    async function sendSQL(querySql) {

    const request = {
        url: "http://localhost:3000/api/query",
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: {
            mode: "raw",
            raw: JSON.stringify(
                querySql


            )
        }
    }


    try {
        const response =  await pm.sendRequest(request, (error, response) => {
            if (error) {
               // console.log(error);
                throw new Error("Request failed: ", err);
            } 
            const responseBody = response.json();
            console.log(responseBody);
            return responseBody;
        });


    }
    catch (err) {
        //console.error(err);
    }
}
}

module.exports = {sendSQL,execProcedure};