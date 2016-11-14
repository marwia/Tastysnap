#!/usr/bin/python

import sys
import json
import random
import string

# Generate random string
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.SystemRandom().choice(chars) for _ in range(size))

# Create an empty file
def create():
    print("creating new file")
    try:
        file=open('invitation_list.json','a')

        file.close()

    except:
            print("error occured")
            sys.exit(0)

def addEmail():
    print("adding new email")
    email=raw_input ("enter the email:")
    new_data = {}
    new_data["email"] = email
    new_data["list"] = [id_generator(16), id_generator(16), id_generator(16)]

    with open('invitation_list.json', 'r') as fp:
        data = json.load(fp)
        # Assume that the file has an array
        if not hasattr(data, "__len__"):
            data = []
        data.append(new_data)

        with open('invitation_list.json', 'w') as outfile:
            json.dump(data, outfile, indent=4)

create()
addEmail()