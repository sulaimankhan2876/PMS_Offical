try { require('./electron/main.cjs') } catch(e) { require('fs').writeFileSync('error.log', e.stack) }  
