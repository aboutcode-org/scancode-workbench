============
Contributing
============

Contributions are welcome and appreciated!
Every little bit helps, and a credit will always be given.

.. _issues : https://github.com/nexB/scancode-workbench/issues
__ issues_

If you are new to ScanCode Workbench and want to find easy tickets to work on,
check `easy issues <https://github.com/nexB/scancode-workbench/labels/easy>`_

When contributing to ScanCode Workbench (such as code, bugs, documentation, etc.) you
agree to the Developer `Certificate of Origin <http://developercertificate.org/>`_
and the ScanCode license (see the `NOTICE <https://github.com/nexB/scancode-workbench/blob/develop/NOTICE>`_ file).
The same approach is used by Linux Kernel developers and several other projects.

For commits, it is best to simply add a line like this to your commit message,
with your name and email::

    Signed-off-by: Jane Doe <developer@example.com>

Please try to write a good commit message, see `good commit message wiki
<https://aboutcode.readthedocs.io/en/latest/contributing/writing_good_commit_messages.html>`_ for
details. In particular use the imperative for your commit subject: think that
you are giving an order to the codebase to update itself.


Feature requests and feedback
=============================

To send feedback or ask a question, `file an issue <issues_>`_

If you are proposing a feature:

* Explain how it would work.
* Keep the scope as simple as possible to make it easier to implement.
* Remember that your contributions are welcomed to implement this feature!


Chat with other developers
==========================

For other questions, discussions, and chats, we have:

- an official Gitter channel at https://gitter.im/aboutcode-org/discuss
  Gitter also has an IRC bridge at https://irc.gitter.im/
  This is the main place where we chat and meet.

- a Gitter channel to discuss Documentation at https://gitter.im/aboutcode-org/gsod-season-of-docs

Bug reports
===========

When `reporting a bug`__ please include:

* Your operating system name, version, and architecture.
* Your ScanCode Workbench version.
* Any additional details about your local setup that might be helpful to
  diagnose this bug.
* Detailed steps to reproduce the bug, such as the scan file you imported, filters you applied, etc.
* The error messages or failure trace if any.
* If helpful, you can add a screenshot as an issue attachment when relevant or
  some extra file as a link to a `Gist <https://gist.github.com>`_.


Documentation improvements
==========================

Documentation can come in the form of new documentation pages/sections, tutorials/how-to documents,
any other general upgrades, etc. Even a minor typo fix is welcomed. 

If something is missing in the documentation or if you found some part confusing,
please file an issue with your suggestions for improvement. Your help and contribution make ScanCode Workbench docs better, we love hearing from you!

The ScanCode Workbench documentation is hosted at `scancode-workbench.readthedocs.io <https://scancode-workbench.readthedocs.io/en/latest/>`_.

If you want to contribute to Scancode Workbench Documentation, you'll find `this guide here <https://scancode-workbench.readthedocs.io/en/latest/contribute/building.html#building-documentation>`_ helpful.


Pull Request Guidelines
-----------------------

If you need a code review or feedback while you are developing the code just
create a pull request. You can add new commits to your branch as needed.

For merging, your request would need to:

1. Include unit tests that are passing (run ``npm test``).
2. Update documentation as needed for new UI screen, functionality, etc.
3. Add a note to ``CHANGELOG.rst`` about the changes.
4. Add your name to ``AUTHORS.rst``.
