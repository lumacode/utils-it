const cron = require('node-cron')
const { generateBkController } = require('./lib/generateBkController');
const cfg = require('./config');

const cronInit = () => {
    
    if(cfg.cronTab) {
        
        // cron run once a days (00:00)
        cron.schedule('0 0 * * *', async () => {

            await generateBkController(true, 'wp_dev_db', 'wp_dev', 'password', '/var/www/wp-dev.example.com', 's3DirName')
            
        });

        //cron.schedule('*/10 * * * * *', () => {
            //.....
        //});

    }
    
}

module.exports = { cronInit };