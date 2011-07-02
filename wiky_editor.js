/**
 * @author Tanin
 */
(function($){

 	$.fn.extend({ 
 		
 		wiky_editor: function() {
			return this.each(function() {
				
				this.insert_bold = function(input,key) {
					if (key != undefined && key != 66) return false;
					
					var count_sym = wiky_helper.count_wrapper(input,"'",3);
					
					if (count_sym.left >= 3 && count_sym.right >= 3) {
						wiky_helper.unwrap(input, count_sym.pos.start, count_sym.pos.end, "'''", "ตัวหนา");
					}
					else {
						
						var pos = wiky_helper.identify_whole_word(input);
						wiky_helper.wrap(input, pos.start, pos.end, "'''", "ตัวหนา");
					}
					
					return true;
				}
				
				this.insert_italic = function(input,key) {
					if (key != undefined && key != 73) return false;
					
					var count_sym = wiky_helper.count_wrapper(input,"'",2);
					
					
					if (count_sym.left >= 2 && 
						count_sym.right >= 2 &&
						count_sym.left != 3 &&
						count_sym.right != 3) {
					
						wiky_helper.unwrap(input, count_sym.pos.start, count_sym.pos.end, "''", "ตัวเอียง");
						
					} else {
					
						var pos = wiky_helper.identify_whole_word(input);
						wiky_helper.wrap(input, pos.start, pos.end, "''", "ตัวเอียง");
					}
					
					
					
					return true;
				}
				
				this.insert_heading = function(input,key) {
					if (key != undefined && key != 72) return false;
					
					var count_sym = wiky_helper.count_beginning_and_end(input,"=");
					
					if (count_sym.left >= 3 && count_sym.right >= 3) {
						wiky_helper.unwrap(input, count_sym.pos.start, count_sym.pos.end, "=", "หัวข้อ");
					}
					else if (count_sym.left >= 2 && count_sym.right >= 2) {
						wiky_helper.unwrap(input, count_sym.pos.start, count_sym.pos.end, "==", "หัวข้อ");
					} else {
					
						var pos = wiky_helper.identify_whole_line(input);
						wiky_helper.wrap(input, pos.start, pos.end, "===", "หัวข้อ");
					}
					
					
					return true;
				}
				
				$(this).wiky_base_editor([this.insert_bold,this.insert_italic,this.insert_heading]);
			});
		}
	});
})(jQuery);

wiky_helper = {}
wiky_helper.wrap = function(input, pos_start, pos_end, symbols, default_text){
	var s = input.value;
	
	if (pos_end > pos_start) {
		s = s.substring(0, pos_start) + ""+symbols+"" + s.substring(pos_start, pos_end) + ""+symbols+"" + s.substring(pos_end);
	}
	else {
		s = s.substring(0, pos_start) + ""+symbols+"" + default_text + ""+symbols+"" + s.substring(pos_end);
		pos_end = pos_start + default_text.length;
	}
	
	input.value = s;
	wiky_helper.set_selection(input, pos_start + symbols.length, pos_end + symbols.length);
}

wiky_helper.unwrap = function(input, pos_start, pos_end, symbols, default_text){
	var s = input.value;
	
	s = s.substring(0, pos_start - symbols.length) + s.substring(pos_start, pos_end) + s.substring(pos_end + symbols.length);
	
	input.value = s;
	wiky_helper.set_selection(input, pos_start - symbols.length, pos_end - symbols.length);
}

wiky_helper.count_beginning_and_end = function(input,sym) {
	
	var result = {left:0,right:0,pos: {start:0,end:0}};
	var s = input.value;
	
	var pos = wiky_helper.get_selection(input);
	
	{
		var count_single_quote = 0;
		var tmp_pos_start = pos.start;
		while (tmp_pos_start >= 0) {
			if (s.charAt(tmp_pos_start) == sym) {
				count_single_quote++;
			}
			else {
				if (s.charAt(tmp_pos_start) == "\n") {
					break;
				}
				else {
					count_single_quote = 0;
				}
			}
			
			tmp_pos_start--;
		}
		
		result.left = count_single_quote;
		result.pos.start = tmp_pos_start + count_single_quote+1;
	}
	
	{
		var count_single_quote = 0;
		var tmp_pos_end = pos.end;
		while (tmp_pos_end < s.length) {
			if (s.charAt(tmp_pos_end) == sym) {
				count_single_quote++;
			}
			else 
				if (s.charAt(tmp_pos_end) == "\n") {
					break;
				}
				else {
					count_single_quote = 0;
				}
			

			tmp_pos_end++;
		}
		
		result.right = count_single_quote;
		result.pos.end = tmp_pos_end - count_single_quote;
	}
	
	return result;
}

wiky_helper.count_wrapper = function(input,sym,min) {
	
	var result = {left:0,right:0,pos: {start:0,end:0}};
	var s = input.value;
	
	var pos = wiky_helper.get_selection(input);
	
	{
		var count_single_quote = 0;
		var tmp_pos_start = pos.start;
		while (tmp_pos_start >= 0) {
			if (s.charAt(tmp_pos_start) == sym) {
				count_single_quote++;
			}
			else {
				if (s.charAt(tmp_pos_start) == "\n") {
					break;
				}
				else {
					if (count_single_quote >= min) {
						break;
					} else {
						count_single_quote = 0;
					}
					
				}
			}
			
			tmp_pos_start--;
		}
		
		result.left = count_single_quote;
		result.pos.start = tmp_pos_start + count_single_quote+1;
	}
	
	{
		var count_single_quote = 0;
		var tmp_pos_end = pos.end;
		while (tmp_pos_end < s.length) {
			if (s.charAt(tmp_pos_end) == sym) {
				count_single_quote++;
			}
			else 
				if (s.charAt(tmp_pos_end) == "\n") {
					break;
				}
				else {
					if (count_single_quote >= min) {
						break;
					} else {
						count_single_quote = 0;
					}
				}
			

			tmp_pos_end++;
		}
		
		result.right = count_single_quote;
		result.pos.end = tmp_pos_end - count_single_quote;
	}
	
	return result;
}

wiky_helper.identify_whole_line = function(input) {
	
	var s = input.value;
	var pos = wiky_helper.get_selection(input);
	
	// identify the whole line
	while (pos.start >= 0 && s.charAt(pos.start) != '\n') pos.start--;
	pos.start++;
	
	while (pos.end < s.length && s.charAt(pos.end) != '\n') pos.end++;

	return pos;
}

wiky_helper.identify_whole_word = function(input) {
	
	var s = input.value;
	var pos = wiky_helper.get_selection(input);
	// if it does not select anything, we select the current word automatically
	if (pos.end == pos.start) {
		while (pos.start >= 0 && s.charAt(pos.start) != ' ' && s.charAt(pos.start) != '\n') pos.start--;
		pos.start++;
		
		while (pos.end < s.length && s.charAt(pos.end) != ' ' && s.charAt(pos.end) != '\n') pos.end++;
	}
	
	return pos;
}

wiky_helper.wrap2 = function(input,symbols,default_text) {
	
	var singleChar = symbols.charAt(0);
	
	var pos = wiky_helper.get_selection(input);
					
	var s = input.value;
	
	
	var add = true;
	
	// if it has enclosing symbols, then we remove it. Otherwise add it.
	var found_start = false;
	var found_end = false;
	{
		var count_single_quote = 0;
		var tmp_pos_start = pos.start;
		while (tmp_pos_start >= 0) {
			if (s.charAt(tmp_pos_start) == singleChar) {
				count_single_quote++;
			}
			else 
				if (s.charAt(tmp_pos_start) == "\n") {
					break;
				}
				else {
					count_single_quote = 0;
				}
			
			if (count_single_quote == symbols.length) {
				pos.start = tmp_pos_start + symbols.length;
				found_start = true;
				break;
			}
			
			tmp_pos_start--;
		}
	}
	
	{
		var count_single_quote = 0;
		var tmp_pos_end = pos.end;
		while (tmp_pos_end < s.length) {
			if (s.charAt(tmp_pos_end) == singleChar) {
				count_single_quote++;
			}
			else 
				if (s.charAt(tmp_pos_end) == "\n") {
					break;
				}
				else {
					count_single_quote = 0;
				}
			
			if (count_single_quote == symbols.length) {
				pos.end = tmp_pos_end - symbols.length + 1;
				found_end = true;
				break;
			}
			
			tmp_pos_end++;
		}
	}
	
	if (found_start == true && found_end == true) add = false;
	
						
	// if it does not select anything, we select the current word automatically
	if (add == true && pos.end == pos.start) {
		while (pos.start >= 0 && s.charAt(pos.start) != ' ' && s.charAt(pos.start) != '\n') pos.start--;
		pos.start++;
		
		while (pos.end < s.length && s.charAt(pos.end) != ' ' && s.charAt(pos.end) != '\n') pos.end++;
	}
	
	if (add) {
		if (pos.end > pos.start) {
			s = s.substring(0, pos.start) + ""+symbols+"" + s.substring(pos.start, pos.end) + ""+symbols+"" + s.substring(pos.end);
		}
		else {
			s = s.substring(0, pos.start) + ""+symbols+"" + default_text + ""+symbols+"" + s.substring(pos.end);
			pos.end = pos.start + default_text.length;
		}
		
		input.value = s;
		wiky_helper.set_selection(input, pos.start + symbols.length, pos.end + symbols.length);
		
	} else {
		s = s.substring(0, pos.start - symbols.length) + s.substring(pos.start, pos.end) + s.substring(pos.end + symbols.length);
		
		input.value = s;
		wiky_helper.set_selection(input,pos.start-symbols.length,pos.end-symbols.length);
	}
}

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
