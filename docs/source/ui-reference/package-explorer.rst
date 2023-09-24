.. _package-explorer:

============================
:index:`Package Explorer`
============================

Details of Top level License detections and clues

License Navigation Pane
--------------------
User can scroll through the licenses and select particular license to see detailed information in the License details pane. Licenses are divided into two sections:
- License Detections
- License Clues

These sections' height & navigation pane's width can be adjusted as per convenience.

.. image:: data/license-explorer/license-explorer.gif


License Details Pane
--------------------
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
    - ``Rule`` - User can click on the Rule to see the rule used by scancode-toolkit
    - ``SPDX License expression``

File Regions Table
User can view the files in which selected license was detected
    - ``Path`` - Path of file, User can click on it to view the specific file in TableView
    - ``Lines`` - Specific lines in the file at which license was detected
    - ``Detection origin`` - Type of file

.. image:: data/license-explorer/license-explorer-nav.gif