describe("Validator Messages", function() {
    var validatinator;

    // Let's make sure we have a fresh Validatinator instance before each `spec.`
    beforeEach(function() {
        validatinator = new Validatinator({
            "my-form": {
                "first-name": "required|min:5|max:10",
                "last-name": "required"
            }
        });
    });
    
    it('addCurrentFormAndField should add the current form and field to the errors object on the Validatinator core.', function() {
        validatinator.currentForm = "my-form";
        validatinator.currentField = "first-name";
        
        validatinator.messages.addCurrentFormAndField();
        
        expect(validatinator.errors).toEqual({
            "my-form": {
                "first-name": {}
            }
        });
    });
    
    it('addValidationErrorMessage should populate the errors object with the corresponding validation message.', function() {
        validatinator.currentForm = "my-form";
        validatinator.currentField = "first-name";
        
        validatinator.messages.addValidationErrorMessage("required");
        expect(validatinator.errors).toEqual({
            "my-form": {
                "first-name": {
                    "required": "This field is required."
                }
            }
        });
    });
    
    it('replaceCurlyBracesWithValues should replace all string values like {$0} and {$1} with values from the parameters', function() {
        expect(validatinator.messages.replaceCurlyBracesWithValues(
            'This field must be the same value as {$0}.',
            ['{$0}'],
            ['10']
        )).toEqual("This field must be the same value as 10.");
        
        expect(validatinator.messages.replaceCurlyBracesWithValues(
            "This field must be between {$0} and {$1}.",
            ['{$0}', '{$1}'],
            ['20', '30']
        )).toEqual("This field must be between 20 and 30.");
        
        expect(validatinator.messages.replaceCurlyBracesWithValues(
            "This field must be above {$0} or below {$0}.",
            ["{$0}"],
            ['10']
        )).toEqual("This field must be above 10 or below 10.");
    });

    it('validationMessages should easily be accessable via validatinator.messages.validationMessages["validationName"].', function() {
        expect(validatinator.messages.validationMessages["required"]).toEqual("This field is required.");
        expect(validatinator.messages.validationMessages["accepted"]).toEqual("This field must be accepted.");
        expect(validatinator.messages.validationMessages["alpha"]).toEqual("This field only allows alpha characters.");
        expect(validatinator.messages.validationMessages["same"]).toEqual("This field must be the same value as {$0}.");
    });
});