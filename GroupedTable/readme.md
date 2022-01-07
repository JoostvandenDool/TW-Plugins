# Usage
To be described later

# Building
Use the following command to built the plugin after you havecreated the tiddlers:
$tw.utils.repackPlugin("$:/plugins/DoolPlex/GroupedTable",[
    "$:/plugins/DoolPlex/GroupedTable/GroupedTable.js", 
    "$:/plugins/DoolPlex/GroupedTable/GTStyles"])

# Release notes
In version 0.2.0 the following has been done:
- fixed bug with not showing all results in table
- added support for field list to have a column with a link by prefixing the field name with *
