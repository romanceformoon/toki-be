import { writeFile } from 'fs';
import aeryDataJSON from './ratingData.json';

export const gradeData = () => {
    const aeryData = aeryDataJSON;

    const lv16 = Object.values(aeryData).filter((_) => _.level === 'LEVEL 16');
    const lv17 = Object.values(aeryData).filter((_) => _.level === 'LEVEL 17');
    const lv18 = Object.values(aeryData).filter((_) => _.level === 'LEVEL 18');
    const lv19 = Object.values(aeryData).filter((_) => _.level === 'LEVEL 19');
    const lv20 = Object.values(aeryData).filter((_) => _.level === 'LEVEL 20');

    writeFile(
        './gradeData.json',
        JSON.stringify(
            {
                'LEVEL 16': {
                    'S+': lv16.filter(
                        (_) => parseInt(_.hard_ratio.split('%')[0]) <= 50
                    ),
                    S: lv16.filter(
                        (_) =>
                            50 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 55
                    ),
                    'A+': lv16.filter(
                        (_) =>
                            55 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 65
                    ),
                    A: lv16.filter(
                        (_) =>
                            65 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 70
                    ),
                    B: lv16.filter(
                        (_) =>
                            70 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 80
                    ),
                    C: lv16.filter(
                        (_) =>
                            80 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 90
                    ),
                    F: lv16.filter(
                        (_) =>
                            90 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 100
                    ),
                },
                'LEVEL 17': {
                    'S+': lv17.filter(
                        (_) => parseInt(_.hard_ratio.split('%')[0]) <= 50
                    ),
                    S: lv17.filter(
                        (_) =>
                            50 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 55
                    ),
                    'A+': lv17.filter(
                        (_) =>
                            55 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 65
                    ),
                    A: lv17.filter(
                        (_) =>
                            65 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 70
                    ),
                    B: lv17.filter(
                        (_) =>
                            70 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 80
                    ),
                    C: lv17.filter(
                        (_) =>
                            80 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 90
                    ),
                    F: lv17.filter(
                        (_) =>
                            90 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 100
                    ),
                },
                'LEVEL 18': {
                    'S+': lv18.filter(
                        (_) => parseInt(_.hard_ratio.split('%')[0]) <= 30
                    ),
                    S: lv18.filter(
                        (_) =>
                            30 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 40
                    ),
                    'A+': lv18.filter(
                        (_) =>
                            40 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 50
                    ),
                    A: lv18.filter(
                        (_) =>
                            50 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 60
                    ),
                    B: lv18.filter(
                        (_) =>
                            60 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 70
                    ),
                    C: lv18.filter(
                        (_) =>
                            70 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 80
                    ),
                    F: lv18.filter(
                        (_) =>
                            80 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 100
                    ),
                },
                'LEVEL 19': {
                    'S+': lv19.filter(
                        (_) => parseInt(_.hard_ratio.split('%')[0]) <= 30
                    ),
                    S: lv19.filter(
                        (_) =>
                            30 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 40
                    ),
                    'A+': lv19.filter(
                        (_) =>
                            40 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 50
                    ),
                    A: lv19.filter(
                        (_) =>
                            50 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 60
                    ),
                    B: lv19.filter(
                        (_) =>
                            60 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 70
                    ),
                    C: lv19.filter(
                        (_) =>
                            70 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 80
                    ),
                    F: lv19.filter(
                        (_) =>
                            80 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 100
                    ),
                },
                'LEVEL 20': {
                    'S+': lv20.filter(
                        (_) => parseInt(_.hard_ratio.split('%')[0]) <= 5
                    ),
                    S: lv20.filter(
                        (_) =>
                            5 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 20
                    ),
                    'A+': lv20.filter(
                        (_) =>
                            20 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 30
                    ),
                    A: lv20.filter(
                        (_) =>
                            30 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 40
                    ),
                    B: lv20.filter(
                        (_) =>
                            40 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 50
                    ),
                    C: lv20.filter(
                        (_) =>
                            50 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 70
                    ),
                    F: lv20.filter(
                        (_) =>
                            70 < parseInt(_.hard_ratio.split('%')[0]) &&
                            parseInt(_.hard_ratio.split('%')[0]) <= 100
                    ),
                },
            },
            null,
            2
        ),
        () => {}
    );
};
