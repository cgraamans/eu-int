import {db} from "../lib/services/db";
import Google from "../lib/services/google";

(async () => {

    const calendar = await Google.Calendar({
        from:((new Date((new Date()).getTime()-360000).toString())),
        to:(new Date()).toString()})

        console.log(calendar);

})();