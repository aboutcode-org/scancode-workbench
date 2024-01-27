# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = 'ScanCode Workbench Documentation'
copyright = 'nexB Inc. and others'
author = 'nexB Inc. and others'
github_user = "nexB"
github_repo = "scancode-workbench"
github_branch = "update/docs"
html_favicon = '_static/favicon.ico'

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx.ext.intersphinx",
    'sphinx_rtd_theme',
    "sphinx_rtd_dark_mode",
    "sphinx_reredirects",
    "sphinx.ext.extlinks",
    "sphinx_copybutton",
    "sphinx.ext.autosectionlabel",
]


# Redirects for olds pages
# See https://documatt.gitlab.io/sphinx-reredirects/usage.html
redirects = {}

# This points to aboutcode.readthedocs.io
# In case of "undefined label" ERRORS check docs on intersphinx to troubleshoot
# Link was created at commit - https://github.com/nexB/aboutcode/commit/faea9fcf3248f8f198844fe34d43833224ac4a83

intersphinx_mapping = {
    "aboutcode": ("https://aboutcode.readthedocs.io/en/latest/", None),
    'scancode-toolkit': ('https://scancode-toolkit.readthedocs.io/en/latest/', None),
}

default_dark_mode = False

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "sphinx_rtd_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]

master_doc = "index"

html_context = {
    "display_github": True,
    "github_user": github_user,
    "github_repo": github_repo,
    "github_version": github_branch,  # branch
    "conf_py_path": "/docs/source/",  # path in the checkout to the docs root
}

html_css_files = ["_static/theme_overrides.css"]


# If true, "Created using Sphinx" is shown in the HTML footer. Default is True.
html_show_sphinx = True

# Define CSS and HTML abbreviations used in .rst files.  These are examples.
# .. role:: is used to refer to styles defined in _static/theme_overrides.css and is used like this: :red:`text`
rst_prolog = """
.. |psf| replace:: Python Software Foundation

.. # define a hard line break for HTML
.. |br| raw:: html

   <br />

.. role:: red

.. role:: img-title

.. role:: img-title-para

"""

# Define reusable URLs using extlinks
extlinks = {
    'github_repo': (f"https://github.com/{github_user}/{github_repo}/%s", '%s'),
    'scan_samples': (f"https://github.com/{github_user}/{github_repo}/blob/{github_branch}/samples/%s", '%s'),
}

# -- Options for LaTeX output -------------------------------------------------

latex_elements = {
    'classoptions': ',openany,oneside'
}
