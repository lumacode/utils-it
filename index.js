const  { cronInit }= require('./cron');

const app = {}

app.init = async () => {

    cronInit();

}

app.init();

