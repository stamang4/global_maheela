const fs = require('fs');

const path = require('path');


const communityFolder =
    path.join(
        __dirname,
        'assets',
        'community'
    );


const outputFile =
    path.join(
        __dirname,
        'community-images.js'
    );


if (!fs.existsSync(communityFolder)) {

    console.error(
        'ERROR: assets/community folder does not exist.'
    );

    process.exit(1);

}


const allowedExtensions =
    new Set([
        '.jpg',
        '.jpeg'
    ]);


const files =
    fs.readdirSync(
        communityFolder
    );


const images =
    files

        .filter((file) => {

            const extension =
                path
                    .extname(file)
                    .toLowerCase();


            return allowedExtensions.has(
                extension
            );

        })

        .sort()

        .map((file) => {

            return (
                'assets/community/' +
                encodeURIComponent(file)
            );

        });


const output =
    `window.communityImages = ${JSON.stringify(
        images,
        null,
        2
    )};
`;


fs.writeFileSync(
    outputFile,
    output,
    'utf8'
);


console.log(
    `Found ${images.length} JPEG images.`
);


console.log(
    'Created community-images.js'
);