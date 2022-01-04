/*\
title: $:/plugins/DoolPlex/RTEditor/RTEditorWidget.js
type: application/javascript
module-type: widget

  Rich Text Editor widget

\*/

/*jslint node: true, browser: true */
/*global $tw: false */

(function() {
    'use strict';
  
    var Widget = require("$:/core/modules/widgets/widget.js").widget;
    
    var RTEditorWidget = function(parseTreeNode,options) {
        this.initialise(parseTreeNode,options);
      };
    
    RTEditorWidget.prototype = new Widget();

    RTEditorWidget.prototype.render = function(parent,nextSibling) {
      this.parentDomNode = parent;
      this.editTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
			this.editField = this.getAttribute("field","text");


      // Rendering toolbars
      var toolbar = this.document.createElement('div');
      toolbar.setAttribute('id', 'toolbar1');
      toolbar.innerHTML = this.Toolbar1();
      parent.insertBefore(toolbar, nextSibling);
      this.domNodes.push(toolbar);

      toolbar = this.document.createElement('div');
      toolbar.setAttribute('id', 'toolbar2');
      toolbar.innerHTML = this.Toolbar2();
      parent.insertBefore(toolbar, nextSibling);
      this.domNodes.push(toolbar);


      // Rendering the text area
      var textarea = this.document.createElement('div');
      textarea.style.border = '1px #000000 solid;';
      textarea.style.width = '100%';
      textarea.style.height = '15em';
      textarea.style.overflow = 'scroll;';
      textarea.setAttribute('id', 'textarea');
      textarea.setAttribute('class', 'RTEBox');
      textarea.setAttribute('contenteditable', 'true');

      // adding eventhandler for keys
      textarea.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key == 'Tab') {
          e.preventDefault();

          
          document.execCommand('outdent', false);
          document.getElementById('textarea').focus();    

        } else if (e.key == 'Tab') {
          e.preventDefault();

          document.execCommand('indent', false);
          document.getElementById('textarea').focus();    
        }
      });

      textarea.addEventListener('focusout', function(e) {
        var value = textarea.innerHTML;

        var tiddler = self.wiki.getTiddler(self.editTitle),
						updateFields = {
							title: self.editTitle
						};
					updateFields[self.editField] = value;
					self.wiki.addTiddler(new $tw.Tiddler(self.wiki.getCreationFields(),tiddler,updateFields,self.wiki.getModificationFields()));
      });


      // Setting the value
      var tiddler = this.wiki.getTiddler(this.editTitle);
      textarea.innerHTML = tiddler.getFieldString(this.editField);

      // Adding observer for handling changes and saving them
      var self = this;
      var observer = new MutationObserver(function(mutations) {
        var value = textarea.innerHTML;

        var tiddler = self.wiki.getTiddler(self.editTitle),
						updateFields = {
							title: self.editTitle
						};
					updateFields[self.editField] = value;
					self.wiki.addTiddler(new $tw.Tiddler(self.wiki.getCreationFields(),tiddler,updateFields,self.wiki.getModificationFields()));
      });

      var config = { characterData: true, attributes: false, childList: true, subtree: true };
//      observer.observe(textarea, config);

    
      // Adding textarea to DOM
      parent.insertBefore(textarea, nextSibling);
      this.domNodes.push(textarea);

      textarea.focus();
    };


    RTEditorWidget.prototype.refresh = function(changedTiddlers) {
      this.refreshSelf();
      return true;
    };

    RTEditorWidget.prototype.Toolbar1 = function() {
        return `
            <select onchange="document.execCommand('formatblock', false, this[this.selectedIndex].value); document.getElementById('textarea').focus();this.selectedIndex=0;">
                <option selected>- formatting -</option>
                <option value="h1">Title 1 &lt;h1&gt;</option>
                <option value="h2">Title 2 &lt;h2&gt;</option>
                <option value="h3">Title 3 &lt;h3&gt;</option>
                <option value="h4">Title 4 &lt;h4&gt;</option>
                <option value="h5">Title 5 &lt;h5&gt;</option>
                <option value="h6">Subtitle &lt;h6&gt;</option>
                <option value="p">Paragraph &lt;p&gt;</option>
                <option value="pre">Preformatted &lt;pre&gt;</option>
            </select>
            <select onchange="document.execCommand('forecolor', false, this[this.selectedIndex].value); document.getElementById('textarea').focus();this.selectedIndex=0;">
                <option class="heading" selected>- color -</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="black">Black</option>
            </select>
            <select onchange="document.execCommand('backcolor', false, this[this.selectedIndex].value); document.getElementById('textarea').focus();this.selectedIndex=0;">
                <option class="heading" selected>- background -</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="black">Black</option>
            </select>
        `;
    }

    RTEditorWidget.prototype.Toolbar2 = function() {
        return `
            <img class="intLink" title="Undo" onclick="document.execCommand('undo', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAOMKADljwliE33mOrpGjuYKl8aezxqPD+7/I19DV3NHa7P///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARR8MlJq7046807TkaYeJJBnES4EeUJvIGapWYAC0CsocQ7SDlWJkAkCA6ToMYWIARGQF3mRQVIEjkkSVLIbSfEwhdRIH4fh/DZMICe3/C4nBQBADs=" />
            <img class="intLink" title="Redo" onclick="document.execCommand('redo', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAMIHAB1ChDljwl9vj1iE34Kl8aPD+7/I1////yH5BAEKAAcALAAAAAAWABYAAANKeLrc/jDKSesyphi7SiEgsVXZEATDICqBVJjpqWZt9NaEDNbQK1wCQsxlYnxMAImhyDoFAElJasRRvAZVRqqQXUy7Cgx4TC6bswkAOw==" />
            <img class="intLink" title="Remove formatting" onclick="document.execCommand('removeFormat', false); document.getElementById('textarea').focus();" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGPC/xhBQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAAd0SU1FB9oECQMCKPI8CIIAAAAIdEVYdENvbW1lbnQA9syWvwAAAuhJREFUOMtjYBgFxAB501ZWBvVaL2nHnlmk6mXCJbF69zU+Hz/9fB5O1lx+bg45qhl8/fYr5it3XrP/YWTUvvvk3VeqGXz70TvbJy8+Wv39+2/Hz19/mGwjZzuTYjALuoBv9jImaXHeyD3H7kU8fPj2ICML8z92dlbtMzdeiG3fco7J08foH1kurkm3E9iw54YvKwuTuom+LPt/BgbWf3//sf37/1/c02cCG1lB8f//f95DZx74MTMzshhoSm6szrQ/a6Ir/Z2RkfEjBxuLYFpDiDi6Af///2ckaHBp7+7wmavP5n76+P2ClrLIYl8H9W36auJCbCxM4szMTJac7Kza////R3H1w2cfWAgafPbqs5g7D95++/P1B4+ECK8tAwMDw/1H7159+/7r7ZcvPz4fOHbzEwMDwx8GBgaGnNatfHZx8zqrJ+4VJBh5CQEGOySEua/v3n7hXmqI8WUGBgYGL3vVG7fuPK3i5GD9/fja7ZsMDAzMG/Ze52mZeSj4yu1XEq/ff7W5dvfVAS1lsXc4Db7z8C3r8p7Qjf///2dnZGxlqJuyr3rPqQd/Hhyu7oSpYWScylDQsd3kzvnH738wMDzj5GBN1VIWW4c3KDon7VOvm7S3paB9u5qsU5/x5KUnlY+eexQbkLNsErK61+++VnAJcfkyMTIwffj0QwZbJDKjcETs1Y8evyd48toz8y/ffzv//vPP4veffxpX77z6l5JewHPu8MqTDAwMDLzyrjb/mZm0JcT5Lj+89+Ybm6zz95oMh7s4XbygN3Sluq4Mj5K8iKMgP4f0////fv77//8nLy+7MCcXmyYDAwODS9jM9tcvPypd35pne3ljdjvj26+H2dhYpuENikgfvQeXNmSl3tqepxXsqhXPyc666s+fv1fMdKR3TK72zpix8nTc7bdfhfkEeVbC9KhbK/9iYWHiErbu6MWbY/7//8/4//9/pgOnH6jGVazvFDRtq2VgiBIZrUTIBgCk+ivHvuEKwAAAAABJRU5ErkJggg==">
            <img class="intLink" title="Bold" onclick="document.execCommand('bold', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=" />
            <img class="intLink" title="Italic" onclick="document.execCommand('italic', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==" />
            <img class="intLink" title="Underline" onclick="document.execCommand('underline', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7" />
            <img class="intLink" title="Left align" onclick="document.execCommand('justifyleft', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JMGELkGYxo+qzl4nKyXAAAOw==" />
            <img class="intLink" title="Center align" onclick="document.execCommand('justifycenter', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIfhI+py+0Po5y02ouz3jL4D4JOGI7kaZ5Bqn4sycVbAQA7" />
            <img class="intLink" title="Right align" onclick="document.execCommand('justifyright', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAIghI+py+0Po5y02ouz3jL4D4JQGDLkGYxouqzl43JyVgAAOw==" />
            <img class="intLink" title="Numbered list" onclick="document.execCommand('insertorderedlist', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAADljwliE35GjuaezxtHa7P///////yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKSespwjoRFvggCBUBoTFBeq6QIAysQnRHaEOzyaZ07Lu9lUBnC0UGQU1K52s6n5oEADs=" />
            <img class="intLink" title="Dotted list" onclick="document.execCommand('insertunorderedlist', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAMIGAAAAAB1ChF9vj1iE33mOrqezxv///////yH5BAEAAAcALAAAAAAWABYAAAMyeLrc/jDKSesppNhGRlBAKIZRERBbqm6YtnbfMY7lud64UwiuKnigGQliQuWOyKQykgAAOw==" />
            <img class="intLink" title="Quote" onclick="document.execCommand('formatblock', false, 'blockquote'); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAIQXAC1NqjFRjkBgmT9nqUJnsk9xrFJ7u2R9qmKBt1iGzHmOrm6Sz4OXw3Odz4Cl2ZSnw6KxyqO306K63bG70bTB0rDI3bvI4P///////////////////////////////////yH5BAEKAB8ALAAAAAAWABYAAAVP4CeOZGmeaKqubEs2CekkErvEI1zZuOgYFlakECEZFi0GgTGKEBATFmJAVXweVOoKEQgABB9IQDCmrLpjETrQQlhHjINrTq/b7/i8fp8PAQA7" />
            <img class="intLink" title="Delete indentation" onclick="document.execCommand('outdent', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAMIHAAAAADljwliE35GjuaezxtDV3NHa7P///yH5BAEAAAcALAAAAAAWABYAAAM2eLrc/jDKCQG9F2i7u8agQgyK1z2EIBil+TWqEMxhMczsYVJ3e4ahk+sFnAgtxSQDqWw6n5cEADs=" />
            <img class="intLink" title="Add indentation" onclick="document.execCommand('indent', false); document.getElementById('textarea').focus();" src="data:image/gif;base64,R0lGODlhFgAWAOMIAAAAADljwl9vj1iE35GjuaezxtDV3NHa7P///////////////////////////////yH5BAEAAAgALAAAAAAWABYAAAQ7EMlJq704650B/x8gemMpgugwHJNZXodKsO5oqUOgo5KhBwWESyMQsCRDHu9VOyk5TM9zSpFSr9gsJwIAOw==" />
            <img class="intLink" title="Hyperlink" onclick="var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){document.execCommand('createlink', false, sLnk); document.getElementById('textarea').focus();}" src="data:image/gif;base64,R0lGODlhFgAWAOMKAB1ChDRLY19vj3mOrpGjuaezxrCztb/I19Ha7Pv8/f///////////////////////yH5BAEKAA8ALAAAAAAWABYAAARY8MlJq7046827/2BYIQVhHg9pEgVGIklyDEUBy/RlE4FQF4dCj2AQXAiJQDCWQCAEBwIioEMQBgSAFhDAGghGi9XgHAhMNoSZgJkJei33UESv2+/4vD4TAQA7" />
        `;
    }

    RTEditorWidget.prototype.getAttribute = function () {
			//parameters are passed to parent so get them from there
			return this.parentWidget.getAttribute.apply(this.parentWidget, arguments);
		}

    RTEditorWidget.prototype.refresh = function(changedTiddlers) {
      return false;
    }


    exports.rteditor = RTEditorWidget;

})();  
