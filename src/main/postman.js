var jsonData = pm.response.json(); 
var loop_reset, data_found, j, arrFieldName;

//Loop through each element in the array
loop_reset = "Yes";
for (var i in jsonData.accountPositions) {
    validateArrayField("accountPositions",i,"fundCode");
    validateArrayField("accountPositions",i,"accountCheckDigit");
    validateArrayField("accountPositions",i,"accountStatus");
    validateArrayField("accountPositions",i,"acctRepId1");
    loop_reset = "Yes";
}

/* **************************************************************** */
/*      Validate array elements                                     */
/* **************************************************************** */

function validateArrayField(parent,subscript,fieldName) {
    var testCaseName = pm.variables.get("TestCaseName") + " - " + fieldName;
    console.log(testCaseName + " - " + loop_reset + " - " + j);
    //Find the array in the excel sheet
    if (loop_reset == "Yes") {
        data_found = "No";
        for (j =0; j < 3 && data_found == "No"; j++) {
            arrFieldName = fieldName + "[" + j + "]";
            if (jsonData[parent][subscript][fieldName].toString() == pm.variables.get(arrFieldName).toString()) {
                data_found = "Yes";
                loop_reset = "No";
                j--;
            }
        }
    }
    else {
        arrFieldName = fieldName + "[" + j + "]";
    }
    
    switch (pm.variables.get(arrFieldName).toString()) {
        case 'NA':
            break;
        case 'Exists':
            pm.test(testCaseName + " - Exists Test", function () {
                pm.expect(jsonData[parent][subscript]).to.have.property(fieldName);
            });
            break;
        case 'NotExists':
            pm.test(testCaseName + " - Not Exists Test", function () {
                pm.expect(jsonData[parent][subscript]).to.not.have.property(fieldName);
            });
            break;
        default:
            pm.test(testCaseName + " - Data Test", function () {
                pm.expect(jsonData[parent][subscript][fieldName].toString()).to.eql(pm.variables.get(arrFieldName).toString());
            });
            break;
    }
    return;
}

function validateObjectField(parent,fieldName) {
    var jsonData = pm.response.json(); 
    var testCaseName = pm.variables.get("TestCaseName") + " - " + fieldName;
    switch (pm.variables.get(fieldName)) {
        case 'NA':
            break;
        case 'Exists':
            pm.test(testCaseName + " Exists Test", function () {
                pm.expect(jsonData[parent][fieldName]).to.have.property(fieldName);
            });
            break;
        default:
            pm.test(testCaseName + " Data Test", function () {
                pm.expect(jsonData[parent][fieldName]).to.eql(pm.variables.get(fieldName));
            });
            break;
    }
    return;
}

function validateField(fieldName, type) {
    var jsonData = pm.response.json(); 
    var testCaseName = pm.variables.get("TestCaseName") + " - " + fieldName;
    switch (pm.variables.get(fieldName)) {
        case 'NA':
            break;
        case 'Exists':
            pm.test(testCaseName + " Exists Test", function () {
                pm.expect(jsonData).to.have.property(fieldName);
            });
            break;
        default:
        	console.log("default" + testCaseName);
                if (type == "string") {
                    pm.test(testCaseName + " Data Test", function () {
                    	pm.expect(jsonData[fieldName]).to.eql(pm.variables.get(fieldName));
                    });}
            else {
            	pm.test(testCaseName + " Data Test", function () {
                pm.expect(jsonData[fieldName].toString()).to.eql(pm.variables.get(fieldName));
            });}
            break;
    }
    return;
}

/* backup function
function validateArrayField(parent,subscript,fieldName) {
    var testCaseName = pm.variables.get("TestCaseName") + " - " + fieldName;
    switch (pm.variables.get(fieldName)) {
        case 'NA':
            break;
        case 'Exists':
            pm.test(testCaseName + " Exists Test", function () {
                pm.expect(jsonData[parent][fieldName]).to.have.property(fieldName);
            });
            break;
        default:
        	console.log("object default" + " - " + fieldName);
            pm.test(testCaseName + " - Data Test", function () {
                data_found = "No";
                if (loop_reset == "Yes") {
                    for (j =0; j < 3 && data_found == "No"; j++) {
                        arrFieldName = fieldName + "[" + j + "]";
                        if (jsonData[parent][subscript][fieldName].toString() == pm.variables.get(arrFieldName).toString()) {
                            data_found = "Yes";
                            loop_reset = "No";
                            j--;
                        }
                    }
                }
                else {
                    arrFieldName = fieldName + "[" + j + "]";
                }
                pm.expect(jsonData[parent][subscript][fieldName].toString()).to.eql(pm.variables.get(arrFieldName).toString());
            });
            break;
    }
    return;
}
*/