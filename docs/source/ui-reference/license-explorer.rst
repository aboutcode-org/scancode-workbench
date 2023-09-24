.. _license-explorer:

============================
:index:`License Explorer`
============================

Details of Top level License detections and clues

License Navigation Pane
-------------------------
User can scroll through the licenses and select particular license to see detailed information in the License details pane. Licenses are divided into two sections:
- License Detections
- License Clues

These sections' height & navigation pane's width can be adjusted as per convenience.

.. image:: data/license-explorer/license-explorer.gif


License Details Pane
----------------------
User can see detailed information of the license selected in the navigation pane.
Title of details pane - License Expression
Instances - No. of times license is detected
Score - Shown only for clues, indicating clue's confidence about the license

Matches Table
User can view the match details resulting the selected license 
    - ``Score``
    - ``Matched length``
    - ``Match Coverage``
    - ``Matcher``
    - ``Matched Text``
        | User can click on the text to view a diff of Matched & Rule text
        | (Requires ``--license-references`` flag)
    - ``Rule`` - User can click on the Rule to open the rule used by scancode-toolkit in browser
    - ``SPDX License expression``

File Regions Table
User can view the files in which selected license was detected
    - ``Path`` - Path of file, User can click on it to view the specific file in TableView
    - ``Lines`` - Specific lines in the file at which license was detected
    - ``Detection origin`` - Type of file

View License details, go to & from file <-> license explorer
--------------------
.. image:: data/license-explorer/license-explorer-nav.gif

View Matched Text diff
------------------------

.. image:: data/license-explorer/license-explorer-matchedtext.gif