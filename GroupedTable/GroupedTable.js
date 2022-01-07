/*\
title: $:/plugins/DoolPlex/GroupedTable/GroupedTable.js
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
            var filter = "[tag[" + tag + "]" + filtercriteria + "each[" + groupfield + "]sort[" + groupfield + "]]";
            var subfilter = "[tag[" + tag + "]" + filtercriteria + "field:" + groupfield + "{!!" + groupfield + "}sort[title]]";

            var resultText = "";

            // Write the header of the table
            resultText += "<table><tr class='gt-headerrow'>";

            for (var i = 0; i < nrofFields; i++)
            {
                if (fields[i][0] == "*" )
                    resultText += "<th align=left>" + fields[i].slice(-(fields[i].length-1))  + "</th>"; 
                else
                    resultText += "<th align=left>" + fields[i] + "</th>"; 
            }

            resultText += "</tr>"; 
            console.log("Header written");


            if (groupfield == "") {
                filter = "[tag[" + tag + "]sort[" + groupfield + "]" + filtercriteria + "]";

                resultText += "<$list filter=" + filter + ">";
                resultText += "<tr>";

                for (var fi = 0; fi < nrofFields; fi++) {
                    if (fi == 0) 
                        resultText += "<td><$link to[[!!title]]><$view field=" + fields[fi] + " /></$link></td>";
                    else if (fields[fi][0] == "*" )
                        resultText += "<td><$link to={{!!" + fields[fi].slice(-(fields[fi].length-1)) + "}}><$view field=" + fields[fi].slice(-(fields[fi].length-1)) + " /></$link></td>";
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
                    else if (fields[fi][0] == "*" )
                        resultText += "<td><$link to={{!!" + fields[fi].slice(-(fields[fi].length-1)) + "}}><$view field=" + fields[fi].slice(-(fields[fi].length-1)) + " /></$link></td>";
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