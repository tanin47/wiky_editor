/**
 * @author Tanin
 */
(function($){

 	$.fn.extend({ 
 		
 		wiky_editor: function() {
			return this.each(function() {
				
				bold = function(input,key) {
					if (key != 66) return false;
					
					var pos = wiky_helper.get_selection(input);
					
					var s = input.value;
					var default_text = "ตัวหนา";
					
					var add = true;
					
					// if it has enclosing ''', then we remove it. Otherwise add it.
					
										
					// if it does not select anything, we select the current word automatically
					if (add == true && pos.end == pos.start) {
						while (pos.start >= 0 && s.charAt(pos.start) != ' ' && s.charAt(pos.start) != '\n') pos.start--;
						pos.start++;
						
						while (pos.end < s.length && s.charAt(pos.end) != ' ' && s.charAt(pos.end) != '\n') pos.end++;
					}
					
					if (add) {
						if (pos.end > pos.start) {
							s = s.substring(0, pos.start) + "'''" + s.substring(pos.start, pos.end) + "'''" + s.substring(pos.end);
						}
						else {
							s = s.substring(0, pos.start) + "'''" + default_text + "'''" + s.substring(pos.end);
							pos.end = pos.start + default_text.length;
						}
						
						input.value = s;
						wiky_helper.set_selection(input,pos.start+3,pos.end+3);
						
					} else {
						s = s.substring(0, pos.start - 3) + s.substring(pos.start, pos.end) + s.substring(pos.end + 3);
						
						input.value = s;
						wiky_helper.set_selection(input,pos.start-3,pos.end-3);
					}
					
					return true;
				}
				
				italic = function(input,key) {
					if (key != 73) return false;
					
					
					return true;
				}
				
				heading = function(input,key) {
					if (key != 72) return false;
					
					
					
					return true;
				}
				
				$(this).wiky_base_editor([bold,italic,heading]);
			});
		}
	});
})(jQuery);

wiky_helper = {}
wiky_helper.set_selection = function(el,start,end) {
    if (el.setSelectionRange) {
        el.focus();
        el.setSelectionRange(start, end);
    } else if (el.createTextRange) {
        var range = el.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}

wiky_helper.get_selection = function(el) {
    var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };

}
