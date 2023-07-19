if('contentEditable' in document.documentElement) {
  HMCTSFrontend.RichTextEditor = function(options) {
    this.options = options;
    this.options.toolbar = this.options.toolbar || {
      bold: false,
      italic: false,
      underline: false,
      list: true,
      numbers: true
    };
    this.textarea = this.options.textarea;
    this.container = $(this.textarea).parent();
    this.createToolbar();
    this.hideDefault();
    this.configureToolbar();
    this.keys = {
      left: 37,
      right: 39,
      up: 38,
      down: 40
    };
    this.container.on('click', '.hmcts-rich-text-editor__toolbar-button', $.proxy(this, 'onButtonClick'));
    this.container.find('.hmcts-rich-text-editor__content').on('input', $.proxy(this, 'onEditorInput'));
    this.container.find('label').on('click', $.proxy(this, 'onLabelClick'));
    this.toolbar.on('keydown', $.proxy(this, 'onToolbarKeydown'));
  };

  HMCTSFrontend.RichTextEditor.prototype.onToolbarKeydown = function(e) {
    var focusableButton;
    switch(e.keyCode) {
      case this.keys.right:
      case this.keys.down:
        focusableButton = this.toolbar.find('button[tabindex=0]');
        var nextButton = focusableButton.next('button');
        if(nextButton[0]) {
          nextButton.focus();
          focusableButton.attr('tabindex', '-1');
          nextButton.attr('tabindex', '0');
        }
        break;
      case this.keys.left:
      case this.keys.up:
        focusableButton = this.toolbar.find('button[tabindex=0]');
        var previousButton = focusableButton.prev('button');
        if(previousButton[0]) {
          previousButton.focus();
          focusableButton.attr('tabindex', '-1');
          previousButton.attr('tabindex', '0');
        }
        break;
    }
  };

  HMCTSFrontend.RichTextEditor.prototype.getToolbarHtml = function() {
    var html = '';

    html += '<div class="hmcts-rich-text-editor__toolbar" role="toolbar">';

    if(this.options.toolbar.bold) {
      html += '<button class="hmcts-rich-text-editor__toolbar-button hmcts-rich-text-editor__toolbar-button--bold" type="button" data-command="bold"><span class="govuk-visually-hidden">Bold</span></button>';
    }

    if(this.options.toolbar.italic) {
      html += '<button class="hmcts-rich-text-editor__toolbar-button hmcts-rich-text-editor__toolbar-button--italic" type="button" data-command="italic"><span class="govuk-visually-hidden">Italic</span></button>';
    }

    if(this.options.toolbar.underline) {
      html += '<button class="hmcts-rich-text-editor__toolbar-button hmcts-rich-text-editor__toolbar-button--underline" type="button" data-command="underline"><span class="govuk-visually-hidden">Underline</span></button>';
    }

    if(this.options.toolbar.list) {
      html += '<button class="hmcts-rich-text-editor__toolbar-button hmcts-rich-text-editor__toolbar-button--unordered-list" type="button" data-command="insertUnorderedList"><span class="govuk-visually-hidden">Unordered list</span></button>';
    }

    if(this.options.toolbar.numbers) {
      html += '<button class="hmcts-rich-text-editor__toolbar-button hmcts-rich-text-editor__toolbar-button--ordered-list" type="button" data-command="insertOrderedList"><span class="govuk-visually-hidden">Ordered list</span></button>';
    }

    html += '</div>';
    return html;
  };

  HMCTSFrontend.RichTextEditor.prototype.getEnhancedHtml = function(val) {
    return this.getToolbarHtml() + '<div class="hmcts-rich-text-editor__content" contenteditable="true" spellcheck="false"></div>';
  };

  HMCTSFrontend.RichTextEditor.prototype.hideDefault = function() {
    this.textarea = this.container.find('textarea');
    this.textarea.addClass('govuk-visually-hidden');
    this.textarea.attr('aria-hidden', true);
    this.textarea.attr('tabindex', '-1');
  };

  HMCTSFrontend.RichTextEditor.prototype.createToolbar = function() {
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'hmcts-rich-text-editor';
    this.toolbar.innerHTML = this.getEnhancedHtml();
    this.container.append(this.toolbar);
    this.toolbar = this.container.find('.hmcts-rich-text-editor__toolbar');
    this.container.find('.hmcts-rich-text-editor__content').html(this.textarea.val());
  };

  HMCTSFrontend.RichTextEditor.prototype.configureToolbar = function() {
    this.buttons = this.container.find('.hmcts-rich-text-editor__toolbar-button');
    this.buttons.prop('tabindex', '-1');
    var firstTab = this.buttons.first();
    firstTab.prop('tabindex', '0');
  };

  HMCTSFrontend.RichTextEditor.prototype.onButtonClick = function(e) {
    document.execCommand($(e.currentTarget).data('command'), false, null);
  };

  HMCTSFrontend.RichTextEditor.prototype.getContent = function() {
    return this.container.find('.hmcts-rich-text-editor__content').html();
  };

  HMCTSFrontend.RichTextEditor.prototype.onEditorInput = function(e) {
    this.updateTextarea();
  };

  HMCTSFrontend.RichTextEditor.prototype.updateTextarea = function() {
    document.execCommand('defaultParagraphSeparator', false, 'p');
    this.textarea.val(this.getContent());
  };

  HMCTSFrontend.RichTextEditor.prototype.onLabelClick = function(e) {
    e.preventDefault();
    this.container.find('.hmcts-rich-text-editor__content').focus();
  };

}