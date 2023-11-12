import axios from 'axios';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import { IGraphResult } from '~/@types/graph';
import { logger } from '~/config/winston';
import { sqliteGetSync } from '~/utils/sqliteGetSync';

export const getUser = async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;

        if (!uid) return res.status(404).send('User not found');

        const tempPath = `scores/${uid}`;

        if (existsSync(tempPath)) {
            const sqlite3 = require('sqlite3').verbose();
            const db = new sqlite3.Database(tempPath);

            const graph: IGraphResult = {
                FC_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
                HARD_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
                GROOVE_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
                EASY_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
                FAILED_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
                NOPLAY_COUNT: {
                    'LEVEL 1': 0,
                    'LEVEL 2': 0,
                    'LEVEL 3': 0,
                    'LEVEL 4': 0,
                    'LEVEL 5': 0,
                    'LEVEL 6': 0,
                    'LEVEL 7': 0,
                    'LEVEL 8': 0,
                    'LEVEL 9': 0,
                    'LEVEL 10': 0,
                    'LEVEL 11': 0,
                    'LEVEL 12': 0,
                    'LEVEL 13': 0,
                    'LEVEL 14': 0,
                    'LEVEL 15': 0,
                    'LEVEL 16': 0,
                    'LEVEL 17': 0,
                    'LEVEL 18': 0,
                    'LEVEL 19': 0,
                    'LEVEL 20': 0,
                },
            };

            const data = await axios.get(
                'https://hibyethere.github.io/table/data.json'
            );
            const tableData = data.data;

            const danData = {
                '1 DAN':
                    '00000000002000000000000000008265092d4c4597d78fde5bde5e79583e2a21285b4d42a2feb17a8de615c5732f75cc586eecf05016b61b3a737087da4b53f772a3bfe9bf6a2fd20b1b7db7affc55ff',
                '2 DAN':
                    '00000000002000000000000000008265779c5cee43891cf6516ebd9a5e73b648b7c62a473c739085f2b85ad19c8f6fb07384c7487c47149f5ee9b6bcbd6f9491959614f4dd366638ab6f617e3b87fc6c',
                '3 DAN':
                    '000000000020000000000000000082658a7d1acf1f4baa2160cece323197550d1f6828e9c46f3646c7c8fe3a3885c045632ad8cdfedf4ddec8bcbfc387b7e690363945fb89b936aaa5f2e74df6cff924',
                '4 DAN':
                    '000000000020000000000000000082652e374d1b6e04db7b77c02fc4c7f01da30ef415fe32c7b4643762425f7d9080b284f5aa52e5ca6753b8766bd38509cf889dd3f8494dbf2610a12c8fb06e675eba',
                '5 DAN':
                    '00000000002000000000000000008265199aa09741df8c57f75c1a68c5f7c6608e26da57d0bebdf8691cda660c8ce7717f6e2b3e8bb2d013566b59c4f6b1b11f008de2c8277e04c8a3274dfab0b3f86b',
                '6 DAN':
                    '00000000002000000000000000008265448ee2bf92651eaf45a79c98eb7630c8fc87e6e4b76e9883844e45328d6deca59c1d3541043e001547363d1539395aee5f49f59a42d6b5241293fef257ad0165',
                '7 DAN':
                    '0000000000200000000000000000826545a6c24e6e05496975b6bf8e247976bb0eb90124ce909c57643d2ab782e6ad2f312bbaf65a12cc6953d7b8835b40d2bf04138a82e311f4c0619a59e73b8274b6',
                '8 DAN':
                    '00000000002000000000000000008265ea4c20ea8770bf106f3e619339a7d29f011b5b10874d806991feb0c477942c9ca08272dc4fffda4f3a7bcee3c02c0f8ace11fa9eb9b41ac1b7f6aef7167f5b39',
                '9 DAN':
                    '000000000020000000000000000082654a308297ed92ef5b84a2d364e887d47692e87e37dc27498a746ee5b95e5bee2e68d70074bd6ab2d921df9c0afcbc1b0b204e522a8a1450d28baa489fb1738409',
                '10 DAN':
                    '00000000002000000000000000008265ded28f8d4dda2947ea4638f374bee96754e7a4815bebbac3b69d48c1bce163dea4c4a98f13c2ef9da08c61e8c46697a45571fdd440253f1ab63ce9f0941f15b3',
                'KAIDEN DAN':
                    '0000000000200000000000000000826595f14007516fc382c36d44aedfcbb1cb43eb214cfb65388b11933d3902043b774789bd0c9b22a03462d59df1baf111db71a29e4cc396881b11c389879874598c',
                'OVERJOY DAN':
                    '000000000020000000000000000082657108a3a73795a5da5fb9df03d0c2b09d5bc01c009d2d092ab29a42ddafd66f1ce66a509dcbb4ae2e0aa28e5b713291d420aad85c9812c6e3b7bc3633fc72b1c9',
            };

            for (const data of tableData) {
                const currentSongLevel: string = data['level'];

                if (currentSongLevel === 'LEVEL DUMMY') continue;

                try {
                    const row = await sqliteGetSync(
                        db,
                        `SELECT clear FROM score WHERE hash = '${data['md5']}'`
                    );

                    if (!row) graph['NOPLAY_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 5)
                        graph['FC_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 4)
                        graph['HARD_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 3)
                        graph['GROOVE_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 2)
                        graph['EASY_COUNT'][currentSongLevel] += 1;
                    else if (row['clear'] === 1)
                        graph['FAILED_COUNT'][currentSongLevel] += 1;
                } catch (err) {
                    return res.status(400).send('db not available');
                }
            }

            let clearDan = 'None';

            for (const [dan, hash] of Object.entries(danData).reverse()) {
                try {
                    const row = await sqliteGetSync(
                        db,
                        `SELECT clear FROM score WHERE hash = '${hash}'`
                    );

                    if (!row) break;
                    if (row['clear'] > 1) {
                        clearDan = dan;
                        break;
                    }
                } catch (err) {
                    console.log(err);
                    return res.status(400).send('db not available');
                }
            }

            db.close();

            const [userQuery] = await req.database.query(
                'SELECT nickname, avatar FROM user WHERE uid = ?',
                [uid]
            );

            req.database.end();

            return res.status(200).json({
                graph: graph,
                clearDan: clearDan,
                nickname: userQuery[0].nickname,
                avatar: userQuery[0].avatar,
            });
        } else {
            return res.status(404).send('Not found');
        }
    } catch (err) {
        logger.error(`Error occured: ${err}`);
        return res.status(500).send('Unknown error occurred.');
    }
};
