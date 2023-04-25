from os import walk
from os import path
import fileinput
import os
import time
import shutil

print("Python Change Href")
localDirec = os.getcwd() + "\\"
urlLink= "https://appwebph.jolly777.com/"


html_directory = localDirec + "dist\\spa\\index.html"
directory = localDirec + "dist\\spa\\js"
css_directory = localDirec + "dist\\spa\\css"

substring = "app."
substring1 = "vendor."


filename= 'dist/spa/index.html'

with fileinput.FileInput(filename, inplace=True, backup='.bak') as index_file:
    for line in index_file:
        print(line.replace('base href=/', 'base href="'+urlLink+'"'), end='')


print("Python Rename")

js_arr = os.listdir(directory)

for file in js_arr:
  if substring in file and file != 'app.js':
    print(file)
    old_file = os.path.join(directory, file)
    new_file = os.path.join(directory, "app.js")
    os.rename(old_file,new_file)
    with fileinput.FileInput(filename, inplace=True, backup='.bak') as index_file:
      for line in index_file:
        print(line.replace(file, 'app.js'), end='')

  if substring1 in file and file != 'vendor.js':
      print(file)
      old_file2 = os.path.join(directory, file)
      new_file2 = os.path.join(directory, "vendor.js")
      os.rename(old_file2,new_file2)
      with fileinput.FileInput(filename, inplace=True, backup='.bak') as index_file:
        for line in index_file:
          print(line.replace(file, 'vendor.js'), end='')

css_arr = os.listdir(css_directory)

for css_file in css_arr:
  if substring in css_file and css_file != 'app.css':
      print(css_file)
      old_file = os.path.join(css_directory, css_file)
      new_file = os.path.join(css_directory, "app.css")
      os.rename(old_file,new_file)
      with fileinput.FileInput(filename, inplace=True, backup='.bak') as index_file:
        for line in index_file:
          print(line.replace(css_file, 'app.css'), end='')
  if substring1 in css_file and css_file != 'vendor.css':
      print(css_file)
      old_file2 = os.path.join(css_directory, css_file)
      new_file2 = os.path.join(css_directory, "vendor.css")
      os.rename(old_file2,new_file2)
      with fileinput.FileInput(filename, inplace=True, backup='.bak') as index_file:
          for line in index_file:
            print(line.replace(css_file, 'vendor.css'), end='')


print("Python Copy Version.js")

src = localDirec + "version.js"
dst = localDirec + "dist\\spa"

shutil.copy(src, dst)

print("Change Version of Version.js in APP.")

file_version= 'dist/spa/version.js'
x = str(time.time()).split('.')[0]

with fileinput.FileInput(file_version, inplace=True, backup=False) as version_file:
    for line in version_file:
        print(line.replace('XXX', str(x)), end='')
