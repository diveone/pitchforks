#!/usr/bin/python3
import json
import os

deps = open('deps.md', 'a+')
print('test')

def walk():
    for root, dirs, files in os.walk("node_modules"):
        print("Walking node_modules...")
        heading = '## {} \n'.format(root)
        print(heading)
        deps.write(heading)
        for file in files:
            if file.startswith('package.json'):
                print("File name: {}".format(file))
                with open(file, 'r') as f:
                    package = json.loads(f.read())
                    dependencies = package['dependencies']
                    dep_count = 0
                    for k,v in dependencies.items():
                        item = '- {} : {} \n'.format(k, v)
                        deps.write(item)
                        dep_count += 1
                    deps.write(dep_count)

    deps.close()

walk()
