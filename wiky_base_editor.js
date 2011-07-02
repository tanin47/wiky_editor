(function($){

 	$.fn.extend({ 
 		
		//pass the options variable to the function
 		wiky_base_editor: function(handles) {
			return this.each(function() {
				
				this.wiky_editor = {};
				this.wiky_editor.editor = this;
				this.wiky_editor.action_count = 0;
				this.wiky_editor.action_save_count = 40;
				this.wiky_editor.data = [this.value];
				this.wiky_editor.data_max = 100;
				this.wiky_editor.current_pointer = 0;
				this.wiky_editor.just_undo_redo = false;
				this.wiky_editor.just_did_special_action = false;
				this.wiky_editor.handles = [];
				
				if (handles != undefined) {
					this.wiky_editor.handles = handles;
				}
				
				this.wiky_editor.undo = function() {
					if (this.current_pointer < (this.data.length - 1)) {
						this.current_pointer++;
						this.editor.value = this.data[this.current_pointer];
					}
					
//					console.log(this.data);
//					console.log('undo ' + this.current_pointer);
				}
				
				this.wiky_editor.redo = function() {
					if (this.current_pointer > 0) {
						this.current_pointer--;
						this.editor.value = this.data[this.current_pointer];
					}
					
//					console.log(this.data);
//					console.log('redo ' + this.current_pointer);
				}
			
			    $(this).keydown(function(e)
			    {
					var zKey = 90, yKey = 89, vKey = 86;
					
					this.wiky_editor.just_undo_redo = false;
					this.wiky_editor.just_did_special_action = false;
					
					if (e.ctrlKey == true) {
						
						doSomething = true;
						if (e.which == zKey) {
							
							this.wiky_editor.just_undo_redo = true;
							this.wiky_editor.undo();
							
						} else if (e.which == yKey) {
							
							this.wiky_editor.just_undo_redo = true;
							this.wiky_editor.redo();
							
						} else {
							doSomething = false;
							
							for (var i=0;i<this.wiky_editor.handles.length;i++) {
								if (this.wiky_editor.handles[i](this,e.which)) {
									doSomething = true;
									this.wiky_editor.just_did_special_action = true;
									break;
								}
							}
							
							if (e.which == vKey) {
								this.wiky_editor.just_did_special_action = true;
							}
						}
						
						if (doSomething == true) {
							e.preventDefault();
						}
					}
			    }).keypress(function(e) {
					
					if (this.wiky_editor.just_undo_redo == true) {
						this.wiky_editor.just_undo_redo = false;
						return;
					}

					this.wiky_editor.just_undo_redo = false;

					var obj = this;
					var latest_key = e.which;
					
					setTimeout(function() {
						obj.wiky_editor.action_count++;
						
						// This occurs when users press some undoes and type something new, so we delete the lines of redoes.
						if (obj.wiky_editor.data.length > 0 && obj.value != obj.wiky_editor.data[0]) {
							if (obj.wiky_editor.current_pointer > 0) {
								obj.wiky_editor.data.splice(0,obj.wiky_editor.current_pointer);
								obj.wiky_editor.current_pointer = 0;
							}
						}
						
						
						// It makes sense to save:
						// (1) when typing some x characters
						// (2) press enter (it is a thought unit)
						// (3) Ctrl + V (patse a content)
						if (obj.wiky_editor.action_count >= obj.wiky_editor.action_save_count
							|| latest_key == 13 // enter
							|| (obj.wiky_editor.just_did_special_action == true && obj.value != obj.wiky_editor.data[0])
							) {
							
							if (obj.wiky_editor.data.length == 0 || obj.value != obj.wiky_editor.data[0]) {
								
								obj.wiky_editor.data.unshift(obj.value);
								if (obj.wiky_editor.data.length > obj.wiky_editor.data_max) {
									obj.wiky_editor.data.pop();
								}
								
								console.log(obj.wiky_editor.data);
							}
							
							obj.wiky_editor.action_count = 0;
							
						}
						
						obj.wiky_editor.just_did_special_action == true
					},1);
				});
			});
		}
		
	});
	
})(jQuery);