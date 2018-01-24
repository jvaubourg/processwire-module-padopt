#!/usr/bin/env python3

import sys
import json
import requests
import re
import shutil
import time
import os.path

imgDirectory = './'

if(len(sys.argv) != 2):
  print('USAGE: ' + sys.argv[0] + ' url')
  exit(1)

url = sys.argv[1]

domain = re.search('(https?://[^/]+/)', url)
domain = domain.group(1)

req = requests.get(url)

params = re.search('var wc_add_to_cart_params = ({.+});', req.text)
params = json.loads(params.group(1))
destination = domain + params['ajax_url']

inventory = re.search(' var jckpc_inventory = ({.+}) ', req.text)
inventory = json.loads(inventory.group(1))

prodid = re.search('data-product_id="([^"]+)" data-product_variations=', req.text)
prodid = json.loads(prodid.group(1))

options_lists = {}

for variation in inventory:
  variationName = variation.replace('pa_', 'padopt_')
  variationName = re.sub(r'-([A-Za-z])', lambda x: x.group(1).upper(), variationName)

  optionid = 1
  options_lists[variationName] = {}

  for option in inventory[variation]:
    imgName = variationName + '_' + str(optionid) + '.png'
    imgPath = imgDirectory + imgName

    options_lists[variationName][optionid] = option
    optionid += 1

    if os.path.exists(imgPath):
      print('Pass ' + imgName + ' (' + variationName + '/' + option + ')')
      continue

    print('Getting data for ' + variation + '/' + option)

    payload = {
      'action': 'jckpc_get_image_layer',
      'prodid': prodid,
      'selectedVal': 'jckpc-' + option,
      'selectedAtt': 'jckpc-' + variation
    }

    req = requests.post(destination, payload)

    img = req.json()['image']

    if(not img):
      print('No image (' + str(img) + ')')
      continue

    src = re.search('<.*src="([^"]+)".*>', img)
    src = src.group(1)
    
    print('Getting ' + src)
    req = requests.get(src, stream=True)

    with open(imgPath, 'wb') as file:
      req.raw.decode_content = True
      shutil.copyfileobj(req.raw, file)
      print('-> ' + imgName + ' (' + variationName + '/' + option + ')')

    time.sleep(1)

print()

for variation, options_list in options_lists.items():
  print('=> ' + variation + ':')

  for i, option in options_list.items():
    print(str(i) + '=' + option)

  print()

exit(0)
