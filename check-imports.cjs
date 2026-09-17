const fs = require('fs');
const path = require('path');

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importPath = match[1];
                if (importPath.startsWith('.')) {
                    let resolvedPath = path.resolve(dir, importPath);
                    try {
                        let dirName = path.dirname(resolvedPath);
                        let baseName = path.basename(resolvedPath);
                        let possibleFiles = fs.readdirSync(dirName);
                        
                        let foundCaseInsensitive = possibleFiles.find(p => 
                            p.toLowerCase() === baseName.toLowerCase() || 
                            p.toLowerCase() === (baseName + '.js').toLowerCase() || 
                            p.toLowerCase() === (baseName + '.jsx').toLowerCase() ||
                            p.toLowerCase() === (baseName + '.css').toLowerCase() ||
                            (fs.statSync(path.join(dirName, p)).isDirectory() && p.toLowerCase() === baseName.toLowerCase())
                        );

                        if (foundCaseInsensitive) {
                            let foundCaseSensitive = possibleFiles.find(p => 
                                p === baseName || 
                                p === (baseName + '.js') || 
                                p === (baseName + '.jsx') ||
                                p === (baseName + '.css') ||
                                (fs.statSync(path.join(dirName, p)).isDirectory() && p === baseName)
                            );
                            
                            if (!foundCaseSensitive) {
                                console.log('Case mismatch in ' + fullPath + ' -> imported: ' + importPath + ' but actual file is: ' + foundCaseInsensitive);
                            }
                        }
                    } catch(e) {}
                }
            }
        }
    }
}

checkDir(path.join(process.cwd(), 'src'));
