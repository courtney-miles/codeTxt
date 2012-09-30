// initialize the widget

window.addEventListener(
  'load',
  function(ev) {
    var codeBtns = document.getElementById('codeBtns').childNodes;
    for (var i = 0; i < codeBtns.length; i++) {
      if (codeBtns[i].nodeType == 1 && codeBtns[i].nodeName == 'BUTTON') {
        if (typeof window.codeTxt[codeBtns[i].getAttribute('id')] == 'function') {
          codeBtns[i].addEventListener('click', function(ev) {
            window.codeTxt[this.getAttribute('id')]();
            /*if (this.getAttribute('id') != 'undo') {
              undos.push(document.getElementById('txt').value);
            }*/
          }, false);
        }
      }
    }
  },
  false);

// // define a namespace to hold our widget specific functions,
// avoid polluting the global namespace
var codeTxt = codeTxt || {};

/*var undos = [];
codeTxt.undo = function (e) {
  if (undos.length > 0) {
    document.getElementById('txt').value = undos.pop();
  }
}*/

codeTxt.toHtml = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  textSelect.replaceWith(codeTxt.htmlentities(str));
}

codeTxt.toHtml2 = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  str =  str.replace(/&/g, '&amp;');
  str =  str.replace(/</g, '&lt;');
  str =  str.replace(/>/g, '&gt;');
  textSelect.replaceWith(str);
}

codeTxt.fromHtml = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var div = document.createElement('div');
  div.innerHTML = textSelect.getString();
  textSelect.replaceWith(div.firstChild.data);
}

codeTxt.toUrl = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  textSelect.replaceWith(encodeURIComponent(str));
}

codeTxt.fromUrl = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  textSelect.replaceWith(decodeURIComponent(str));
}

codeTxt.toUpper = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  textSelect.replaceWith(str.toUpperCase());
}

codeTxt.toLower = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  textSelect.replaceWith(str.toLowerCase());
}

codeTxt.toJs = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  str = codeTxt.addslashes(str);
  str = str.replace(/\r?\n|\r/g, '\\n\\\n');
  str = str.replace(/<\/script>/g, '<\\/script>');
  textSelect.replaceWith('"'+str+'"');
}

codeTxt.fromJs = function (e) {
  var textSelect = new codeTxt.textSelect(document.getElementById('txt'));
  var str = textSelect.getString();
  str = str.replace(/^"([\s\S]*)"$/g, '$1');
  str = str.replace(/\\n\\/g, '');
  str = str.replace(/<\\\/script>/g, '</script>');
  str = codeTxt.stripslashes(str);
  textSelect.replaceWith(str);
}

codeTxt.textSelect = function (element) {
    this.element = element;
    this.len = element.value.length;
    this.start = element.selectionStart;
    this.end = element.selectionEnd;
    
    if (this.start-this.end == 0) {
        this.sel = element.value;
    } else {
        this.sel = element.value.substring(this.start, this.end);
    }
    
    this.getString = function () {
        return this.sel;
    }
    this.replaceWith = function (str) {
        if (this.start-this.end == 0) {
            element.value = str;
        } else {
            element.value = element.value.substring(0,this.start) + str + element.value.substring(this.end,this.len);
        }
    }
}
  
codeTxt.addslashes = function (str) {
  str=str.replace(/\\/g,'\\\\');
  str=str.replace(/\'/g,'\\\'');
  str=str.replace(/\"/g,'\\"');
  str=str.replace(/\0/g,'\\0');
  return str;
}

codeTxt.stripslashes = function (str) {
  str=str.replace(/\\'/g,'\'');
  str=str.replace(/\\"/g,'"');
  str=str.replace(/\\0/g,'\0');
  str=str.replace(/\\\\/g,'\\');
  return str;
}

codeTxt.htmlentities = function (string, quote_style) {
    // Convert all applicable characters to HTML entities  
    // 
    // version: 1103.1210
    // discuss at: http://phpjs.org/functions/htmlentities
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: nobbler
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // -    depends on: get_html_translation_table
    // *     example 1: htmlentities('Kevin & van Zonneveld');
    // *     returns 1: 'Kevin &amp; van Zonneveld'
    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
    // *     returns 2: 'foo&#039;bar'
    var hash_map = {},
        symbol = '',
        tmp_str = '',
        entity = '';
    tmp_str = string.toString();
 
    if (false === (hash_map = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }
    hash_map["'"] = '&#039;';
    for (symbol in hash_map) {
        entity = hash_map[symbol];
        tmp_str = tmp_str.split(symbol).join(entity);
    }
    
    return tmp_str;
}

codeTxt.get_html_translation_table = function (table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}
    var entities = {},
        hash_map = {},
        decimal = 0,
        symbol = '';
    var constMappingTable = {},
        constMappingQuoteStyle = {};
    var useTable = {},
        useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0] = 'HTML_SPECIALCHARS';
    constMappingTable[1] = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: " + useTable + ' not supported');
        // return false;
    }
    
    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    // Defining the quote last still puts it at the beginning of the array in Opera
    /*if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }*/
    if (useQuoteStyle === 'ENT_QUOTES') {
         entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';

    // ascii decimals to real symbols
    for (decimal in entities) {
        symbol = String.fromCharCode(decimal);
        hash_map[symbol] = entities[decimal];
    }
    
    // Force the quote to be defined last for Opera
    hash_map['"'] = '&quot;';

    return hash_map;
}