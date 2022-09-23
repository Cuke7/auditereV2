import { Handler } from "@netlify/functions";
import axios from "axios";

const handler: Handler = async (event: any, context) => {
    let search = decodeURI(event.queryStringParameters.search);

    let { data } = await axios("https://www.youtube.com/results?search_query=" + search);

    let start = data.indexOf("var ytInitialData = ");
    let end = data.indexOf("</script>", start);

    let obj = data.substring(start + 20, end - 1);
    let refinements = JSON.parse(obj).refinements;

    if (refinements == undefined) {
        refinements = [];
    }
    return {
        statusCode: 200,
        body: JSON.stringify(refinements),
    };

};

export { handler };