.. Note::
   For CentOS (or linux distros without the new libstdc++), follow these steps:

   -  Install the new libstdc++ library:

      .. code-block:: bash

         yum provides libstdc++

   -  Update LD_LIBRARY_PATH:

      .. code-block:: bash

         export LD_LIBRARY_PATH="/usr/local/lib64/:$LD_LIBRARY_PATH"

   -  Run the application with ``no-sandbox`` option:

      .. code-block:: bash

         ./ScanCode-Workbench-4.0.2-linux-x64/ScanCode-Workbench-4.0.2 --no-sandbox
