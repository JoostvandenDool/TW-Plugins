/*\
title: $:/plugins/Doolplex/GroupedTable/GroupedTable.js
type: application/javascript
module-type: macro
A TiddlyWiki 5 macro which creates a table with rowgrouping
\*/
(function() {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.name = "groupedtable";

    exports.params = [
        {name: "tag", default: ""},
        {name: "groupfield", default: ""},
        {name: "fieldlist",  default: ""},
        {name: "filtercriteria",  default: ""}
    ];

    /*
    Run the macro. Make sure it accepts the parameters you have defined above.
    */
    exports.run = function(tag, groupfield, fieldlist, filtercriteria) {
        try {
            var fields = fieldlist.split(",");
            var nrofFields = fields.length;
            var filter = "[each[" + groupfield + "]tag[" + tag + "]sort[" + groupfield + "]" + filtercriteria + "]";
            var subfilter = "[field:" + groupfield + "{!!" + groupfield + "}sort[title]" + filtercriteria + "]";

            var resultText = "";

            // Write the header of the table
            resultText += "<table><tr class='gt-headerrow'>";

            for (var i = 0; i < nrofFields; i++)
                resultText += "<th align=left>" + fields[i] + "</th>"; 

            resultText += "</tr>"; 

            if (groupfield == "") {
                filter = "[tag[" + tag + "]sort[" + groupfield + "]" + filtercriteria + "]";

                resultText += "<$list filter=" + filter + ">";
                resultText += "<tr>";

                for (var fi = 0; fi < nrofFields; fi++) {
                    if (fi == 0) 
                        resultText += "<td><$link to[[!!title]]><$view field=" + fields[fi] + " /></$link></td>";
                    else
                        resultText += "<td><$view field=" + fields[fi] + " /></td>";
                }
                resultText += "</tr>";
                resultText += "</$list>";
            } else {
                resultText += "<$list filter=" + filter + ">";
                resultText += "<tr><td class='gt-groupheader' colspan='" + nrofFields + "'>" + groupfield + ":&nbsp;<$view field='" + groupfield + "' /></td></tr>";
                resultText += "<$list filter='" + subfilter + "'>";
                resultText += "<tr>";

                for (var fi = 0; fi < nrofFields; fi++) {
                    if (fi == 0) 
                        resultText += "<td><$link to[[!!title]]><$view field=" + fields[fi] + " /></$link></td>";
                    else
                        resultText += "<td><$view field=" + fields[fi] + " /></td>";
                }

                resultText += "</tr>";
                resultText += "</$list>";
                resultText += "</$list>";
            }

            // close the table and return the result
            resultText += "</table>"; 

            return resultText;
        } catch (err) {
            console.error(err.stack)
            return "(ERROR: " + err.message + ") ";
        }
    };

})();