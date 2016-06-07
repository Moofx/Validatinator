/**
 * @mixin
 */
var Messages = {
  validationMessages: {
    accepted: "This field must be accepted.",
    alpha: "This field only allows alpha characters.",
    alphaDash: "This field only allows alpha, dash and underscore characters.",
    alphaNum: "This field only allows alpha, dash, underscore and numerical characters.",
    between: "This field must be between {$0}",
    betweenLength: "This field must be between {$0} characters long.",
    confirmed: "This field must be the same as {$0}.",
    contains: "This field must be one of the following values, {$0}.",
    dateBefore: "This field must be a date before {$0}.",
    dateAfter: "This field must be a date after {$0}.",
    different: "This field must not be the same as {$0}.",
    digitsLength: "This field must be a numerical value and {$0} characters long.",
    digitsLengthBetween: "This field must be a numerical value and between {$0} characters long.",
    email: "This field only allows valid email addresses.",
    ipvFour: "This field only allows valid ipv4 addresses.",
    max: "This field must be equal to or less than {$0}.",
    maxLength: "This field must be {$0} or less characters long.",
    min: "This field must be equal to or more than {$0}.",
    minLength: "This field must be {$0} or more characters long.",
    notIn: "This field must not be contained within the following values, {$0}.",
    number: "This field only allows valid numerical values.",
    required: "This field is required.",
    requiredIf: "This field is required if the value of {$0} equals {$1}.",
    requiredIfNot: "This field is required if the value of {$0} does not equal {$1}.",
    same: "This field must be the same value as {$0}.",
    url: "This field only allows valid urls."
  },

  /**
   * Overrides or adds new validation error messages.
   *
   * @since 0.1.0-beta
   * @param {Object} newErrorMessages - Keys: validation method names
   * @param {String} newErrorMessages.validationMethodName - Validation error message
   */
  overwriteAndAddNewMessages: function(newErrorMessages) {
    var errorMessage;

    for (errorMessage in newErrorMessages) {
      this.validationMessages[errorMessage] = newErrorMessages[errorMessage];
    }
  },

  /**
   * Adds the validation's error message based on the method that was called.
   *
   * @since 0.1.0-beta
   */
  addValidationErrorMessage: function(methodName, parametersArray) {
    var currentForm = this.parent.currentForm,
        currentField = this.parent.currentField,
        validationMessage = this.getValidationErrorMessage(methodName);

    if (! this.parent.errors.hasOwnProperty(currentForm)) {
      this.parent.errors[currentForm] = {};
    }

    if (! this.parent.errors[currentForm].hasOwnProperty(currentField)) {
      this.parent.errors[currentForm][currentField] = {};
    }

    if (parametersArray.length > 0) {
      validationMessage = this.replaceCurlyBracesWithValues(validationMessage, parametersArray);
    }

    // Form and field are both added so let's add our failed validation message.
    this.parent.errors[currentForm][currentField][methodName] = validationMessage;
  },

  /**
   * Attempts to retrieve an error message from the supplied methodName.  This
   * this method will first check to see if there is a form and field specific
   * custom error message, if not then it'll get the top-level validation message.
   *
   * @since 0.1.0-beta
   * @returns {String} Error Message
   */
  getValidationErrorMessage: function(methodName) {
    var currentForm = this.parent.currentForm,
        currentField = this.parent.currentField,
        validationMessage;

    try {
      validationMessage = this.validationMessages[currentForm][currentField][methodName];
    }
    catch(e) { }

    if (! validationMessage) {
      validationMessage = this.validationMessages[methodName];
    }

    return validationMessage;
  },

  /**
   * Replaces the curly brackets within the validation error message with
   * the corresponding values.
   *
   * @since 0.1.0-beta
   * @returns {String}
   */
  replaceCurlyBracesWithValues: function(validationMessage, parametersArray) {
    var i,
        paramVal,
        valToReplace;

    for (i = 0; i < parametersArray.length; i++) {
      paramVal = parametersArray[i];
      valToReplace = "{$" + i + "}";

      // If the index in the parameterArray doesn't exist or if the validation
      // doesn't contain the {$i} value then continue to the next index.
      if (! validationMessage.contains(valToReplace) && (paramVal === null && paramVal === undefined)) {
        continue;
      }

      // If the value is not an array then we will go ahead and just
      // replace the string with the value.  Also note: regex is bad mojo!
      // Try to use anything that is not a regex before reverting to one.
      if (! this.utils.isValueAnArray(parametersArray[i])) {
        validationMessage = validationMessage.split(valToReplace).join(paramVal);
      }
      else {
        validationMessage = validationMessage.split(valToReplace).join(
          this.utils.convertArrayValuesToEnglishString(paramVal));
      }
    }

    return validationMessage;
  }
};

module.exports = Messages;