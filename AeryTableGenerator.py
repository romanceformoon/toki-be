import os
import sqlite3
import sys

import requests

db_path = ''
if getattr(sys, 'frozen', False):
    db_path = os.path.dirname(os.path.abspath(sys.executable)) + '\LR2files\Database\song.db'
else:
    db_path = os.path.dirname(os.path.abspath(__file__)) + '\LR2files\Database\song.db'

print(db_path)
conn = sqlite3.connect(db_path)
cur = conn.cursor()

try:
    conn.execute('DROP TABLE Aery')
except:
    pass

try:
    conn.execute('CREATE TABLE Aery(md5 TEXT, folder TEXT, level TEXT)')
except:
    pass

table_data = requests.get('https://asumatoki.kr/table/aery/data_test.json')
input_json = table_data.json()

header_data = requests.get('https://asumatoki.kr/table/aery/header_test.json')
header_json = header_data.json()
levels = header_json['level_order']
last_update = header_json['last_update']

level_dict = {}
for level in levels:
    level_dict[level] = [x for x in input_json if x['folder'] == f'{level}']
    for e in level_dict[level]:
        cur.executemany('INSERT INTO Aery VALUES (?, ?, ?)',
                        [(e['md5'], e['folder'], e['level'])])

conn.commit()
conn.close()

table_folder = 'AeryTable'
isExist = os.path.exists(table_folder)
if not isExist:
    os.makedirs(table_folder) 

for idx, level in enumerate(levels):
    lr2folder = [f"#COMMAND song.hash   in (SELECT md5 FROM Aery WHERE folder = '{level}') \n", "#MAXTRACKS 0\n", "#CATEGORY [5KEYS AERY]\n", f"#TITLE {level}\n", f"#INFORMATION_A LAST UPDATE: {last_update}\n", "#INFORMATION_B\n"]
    f = open(table_folder + f'/{idx:04d}.lr2folder', 'w')
    f.writelines(lr2folder)
    f.close()