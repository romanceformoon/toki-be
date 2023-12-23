import json

import requests
from bs4 import BeautifulSoup

_resp = requests.get('https://stellabms.xyz/st/score.json')
aery_data = _resp.json()

data = {}

for _ in aery_data:
    if _["level"] != "LEVEL DUMMY":
        resp = requests.get(f'http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5={_["md5"]}')
        html = resp.text
        soup = BeautifulSoup(html, 'html.parser')
        result = soup.select("table:nth-of-type(3) > tr:nth-of-type(4) > td")

        fc_ratio = result[0].text
        hard_ratio = result[1].text
        groove_ratio = result[2].text
        easy_ratio = result[3].text

        print({
            "fc_ratio": fc_ratio, "hard_ratio": hard_ratio, "groove_ratio": groove_ratio, "easy_ratio": easy_ratio
        })

        data[_["md5"]] = {
            "fc_ratio": fc_ratio, "hard_ratio": hard_ratio, "groove_ratio": groove_ratio, "easy_ratio": easy_ratio
        }


file_path = "./ratingData.json"
with open(file_path, 'w', encoding='utf-8') as file:
    print(data)
    json.dump(data, file)

