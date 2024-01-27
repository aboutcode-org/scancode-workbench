# Documentation development

The first step you want to do is create the python virtual environment:

```
$ cd docs/
$ python -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

Run Sphinx documentation server:

```
$ make docs
```

Build Sphinx documentation

```
$ make html
```
