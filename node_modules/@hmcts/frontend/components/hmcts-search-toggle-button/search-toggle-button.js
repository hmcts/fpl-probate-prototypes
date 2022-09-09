HMCTSFrontend.SearchToggleButton = function(options) {
  this.options = options;
  this.toggleButton = $('<button class="hmcts-search-toggle__button" type="button" aria-haspopup="true" aria-expanded="false">'+this.options.toggleButton.text+'</button>');
	this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick'));
  this.options.toggleButton.container.append(this.toggleButton);
};

HMCTSFrontend.SearchToggleButton.prototype.onToggleButtonClick = function() {
  if(this.toggleButton.attr('aria-expanded') == 'false') {
    this.toggleButton.attr('aria-expanded', 'true');
    this.options.search.container.removeClass('hmcts-hidden');
    this.options.search.container.find('input').first().focus();
	} else {
		this.options.search.container.addClass('hmcts-hidden');
		this.toggleButton.attr('aria-expanded', 'false');
	}
};
