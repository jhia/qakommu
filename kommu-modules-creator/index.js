const fs = require('fs');
const readline = require('readline')
const utils = require('./utils');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

module.exports = ()=>{
	if(!fs.existsSync('./modules')){
		
		console.log('\n*** Module folder doesn\'t esixts ***');
		rl.question('\nDo you want to create it?(y/n): ', (ans) =>{
			const parseAns = ans.trim().toLowerCase();
			if(parseAns != 'y' && parseAns != 'n'){
				console.log('\nINVALID PARAM: ',ans);
				rl.close();
				return;
			}
			if (parseAns == 'n'){
				console.log('\nFOLDER IS NEEDED, CANCELING...');
				rl.close();
				return;
			}
			fs.mkdirSync('./modules');
			utils.createModule(process.argv.slice(2)[0]);
			rl.close();
		});

	}else{
		utils.createModule(process.argv.slice(2)[0]);
		rl.close();
	}
}