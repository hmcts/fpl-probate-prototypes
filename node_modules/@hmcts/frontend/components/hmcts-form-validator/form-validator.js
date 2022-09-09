HMCTSFrontend.FormValidator = function(form, options) {
  this.form = form;
  this.errors = [];
  this.validators = [];
  $(this.form).on('submit', $.proxy(this, 'onSubmit'));
  this.summary = (options && options.summary) ? $(options.summary) : $('.govuk-error-summary');
  this.originalTitle = document.title;
};

HMCTSFrontend.FormValidator.entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

HMCTSFrontend.FormValidator.prototype.escapeHtml = function(string) {
  return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
    return HMCTSFrontend.FormValidator.entityMap[s];
  });
};

HMCTSFrontend.FormValidator.prototype.resetTitle = function() {
  document.title = this.originalTitle;
};

HMCTSFrontend.FormValidator.prototype.updateTitle = function() {
  document.title = "" + this.errors.length + " errors - " + document.title;
};

HMCTSFrontend.FormValidator.prototype.showSummary = function () {
  this.summary.html(this.getSummaryHtml());
  this.summary.removeClass('hmcts-hidden');
  this.summary.attr('aria-labelledby', 'errorSummary-heading');
  this.summary.focus();
};

HMCTSFrontend.FormValidator.prototype.getSummaryHtml = function() {
  var html = '<h2 id="error-summary-title" class="govuk-error-summary__title">There is a problem</h2>';
  html += '<div class="govuk-error-summary__body">';
  html += '<ul class="govuk-list govuk-error-summary__list">';
  for (var i = 0, j = this.errors.length; i < j; i++) {
    var error = this.errors[i];
    html += '<li>';
    html +=   '<a href="#' + this.escapeHtml(error.fieldName) + '">';
    html +=     this.escapeHtml(error.message);
    html +=   '</a>';
    html += '</li>';
  }
  html += '</ul>';
  html += '</div>';
  return html;
};

HMCTSFrontend.FormValidator.prototype.hideSummary = function() {
  this.summary.addClass('hmcts-hidden');
  this.summary.removeAttr('aria-labelledby');
};

HMCTSFrontend.FormValidator.prototype.onSubmit = function (e) {
  this.removeInlineErrors();
  this.hideSummary();
  this.resetTitle();
  if(!this.validate()) {
    e.preventDefault();
    this.updateTitle();
    this.showSummary();
    this.showInlineErrors();
  }
};

HMCTSFrontend.FormValidator.prototype.showInlineErrors = function() {
  for (var i = 0, j = this.errors.length; i < j; i++) {
    this.showInlineError(this.errors[i]);
  }
};

HMCTSFrontend.FormValidator.prototype.showInlineError = function (error) {
  var errorSpanId = error.fieldName + '-error';
  var errorSpan = '<span class="govuk-error-message" id="'+ errorSpanId +'">'+this.escapeHtml(error.message)+'</span>';
  var control = $("#" + error.fieldName);
  var fieldContainer = control.parents(".govuk-form-group");
  var label = fieldContainer.find('label');
  var legend = fieldContainer.find("legend");
  var fieldset = fieldContainer.find("fieldset");
  fieldContainer.addClass('govuk-form-group--error');
  if(legend.length) {
    legend.after(errorSpan);
    fieldContainer.attr('aria-invalid', 'true');
    HMCTSFrontend.addAttributeValue(fieldset[0], 'aria-describedby', errorSpanId);
  } else {
    label.after(errorSpan);
    control.attr('aria-invalid', 'true');
    HMCTSFrontend.addAttributeValue(control[0], 'aria-describedby', errorSpanId);
  }
};

HMCTSFrontend.FormValidator.prototype.removeInlineErrors = function() {
  var error;
  var i;
  for (var i = 0; i < this.errors.length; i++) {
    this.removeInlineError(this.errors[i]);
  }
};

HMCTSFrontend.FormValidator.prototype.removeInlineError = function(error) {
  var control = $("#" + error.fieldName);
  var fieldContainer = control.parents(".govuk-form-group");
  fieldContainer.find('.govuk-error-message').remove();
  fieldContainer.removeClass('govuk-form-group--error');
  fieldContainer.find("[aria-invalid]").attr('aria-invalid', 'false');
  var errorSpanId = error.fieldName + '-error';
  HMCTSFrontend.removeAttributeValue(fieldContainer.find('[aria-describedby]')[0], 'aria-describedby', errorSpanId);
};

HMCTSFrontend.FormValidator.prototype.addValidator = function(fieldName, rules) {
  this.validators.push({
    fieldName: fieldName,
    rules: rules,
    field: this.form.elements[fieldName]
  });
};

HMCTSFrontend.FormValidator.prototype.validate = function() {
  this.errors = [];
  var validator = null,
    validatorReturnValue = true,
    i,
    j;
  for (i = 0; i < this.validators.length; i++) {
    validator = this.validators[i];
    for (j = 0; j < validator.rules.length; j++) {
      validatorReturnValue = validator.rules[j].method(validator.field,
        validator.rules[j].params);

      if (typeof validatorReturnValue === 'boolean' && !validatorReturnValue) {
        this.errors.push({
          fieldName: validator.fieldName,
          message: validator.rules[j].message
        });
        break;
      } else if(typeof validatorReturnValue === 'string') {
        this.errors.push({
          fieldName: validatorReturnValue,
          message: validator.rules[j].message
        });
        break;
      }
    }
  }
  return this.errors.length === 0;
};